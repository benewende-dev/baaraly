import { Router } from "express";
import type { Db } from "@paperclipai/db";
import { agentTemplates, agentInstances, agents as agentsTable } from "@paperclipai/db";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { assertBoard, assertCompanyAccess } from "./authz.js";
import { notFound, forbidden, badRequest } from "../errors.js";

const createTemplateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  role: z.string().min(1),
  emoji: z.string().optional(),
  color: z.string().optional(),
  category: z.string().optional(),
  tier: z.number().int().min(1).max(3).optional(),
  description: z.string().min(1),
  systemPrompt: z.string().min(1),
  tools: z.array(z.string()).optional(),
  superpowers: z.array(z.string()).optional(),
  price: z.number().int().min(0).optional(),
  isPremium: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  sortIndex: z.number().int().optional(),
});

const updateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  emoji: z.string().optional(),
  color: z.string().optional(),
  category: z.string().optional(),
  tier: z.number().int().min(1).max(3).optional(),
  description: z.string().min(1).optional(),
  systemPrompt: z.string().min(1).optional(),
  tools: z.array(z.string()).optional(),
  superpowers: z.array(z.string()).optional(),
  price: z.number().int().min(0).optional(),
  isPremium: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  sortIndex: z.number().int().optional(),
});

export function agentTemplateRoutes(db: Db) {
  const router = Router();

  router.get("/agent-templates", async (_req, res) => {
    const templates = await db.query.agentTemplates.findMany({
      orderBy: [agentTemplates.sortIndex, agentTemplates.name],
    });
    res.json({ templates });
  });

  router.get("/agent-templates/admin", async (req, res) => {
    assertBoard(req);
    const templates = await db.query.agentTemplates.findMany({
      orderBy: [agentTemplates.sortIndex, agentTemplates.name],
    });
    res.json({ templates });
  });

  router.get("/agent-templates/:id", async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const template = await db.query.agentTemplates.findFirst({
      where: eq(agentTemplates.id, id),
    });
    if (!template) throw notFound("Template not found");
    res.json({ template });
  });

  router.post("/agent-templates", validate(createTemplateSchema), async (req, res) => {
    assertBoard(req);
    const body = req.body as z.infer<typeof createTemplateSchema>;

    const existing = await db.query.agentTemplates.findFirst({
      where: eq(agentTemplates.name, body.name),
    });
    if (existing) throw forbidden("A template with this name already exists");

    const [created] = await db
      .insert(agentTemplates)
      .values({
        name: body.name,
        slug: body.slug ?? body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        role: body.role,
        emoji: body.emoji ?? "🤖",
        color: body.color ?? "#0071E3",
        category: body.category ?? "tech",
        tier: body.tier ?? 1,
        description: body.description,
        systemPrompt: body.systemPrompt,
        tools: body.tools ?? [],
        superpowers: body.superpowers ?? [],
        price: body.price ?? 0,
        isPremium: body.isPremium ?? false,
        isActive: body.isActive ?? true,
        isPublic: body.isPublic ?? true,
        sortIndex: body.sortIndex ?? 0,
      })
      .returning();

    res.status(201).json({ template: created });
  });

  router.put("/agent-templates/:id", validate(updateTemplateSchema), async (req, res) => {
    assertBoard(req);
    const body = req.body as z.infer<typeof updateTemplateSchema>;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const existing = await db.query.agentTemplates.findFirst({
      where: eq(agentTemplates.id, id),
    });
    if (!existing) throw notFound("Template not found");

    const [updated] = await db
      .update(agentTemplates)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(agentTemplates.id, id))
      .returning();

    res.json({ template: updated });
  });

  router.delete("/agent-templates/:id", async (req, res) => {
    assertBoard(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const existing = await db.query.agentTemplates.findFirst({
      where: eq(agentTemplates.id, id),
    });
    if (!existing) throw notFound("Template not found");

    const instances = await db.query.agentInstances.findMany({
      where: eq(agentInstances.templateId, id),
    });
    if (instances.length > 0) {
      throw badRequest(`Cannot delete template: ${instances.length} agent(s) are using it`);
    }

    await db.delete(agentTemplates).where(eq(agentTemplates.id, id));

    res.json({ success: true });
  });

  router.get("/companies/:companyId/agent-instances", async (req, res) => {
    assertCompanyAccess(req, req.params.companyId);

    const instances = await db.query.agentInstances.findMany({
      where: eq(agentInstances.companyId, req.params.companyId),
    });

    const templateIds = instances
      .map((i) => i.templateId)
      .filter((id): id is string => id !== null);

    let templates: typeof agentTemplates.$inferSelect[] = [];
    if (templateIds.length > 0) {
      templates = await db.query.agentTemplates.findMany({
        where: inArray(agentTemplates.id, templateIds),
      });
    }

    const templateMap = new Map(templates.map((t) => [t.id, t]));

    const enriched = instances.map((instance) => ({
      ...instance,
      template: instance.templateId ? templateMap.get(instance.templateId) ?? null : null,
    }));

    res.json({ instances: enriched });
  });

  router.post("/companies/:companyId/agent-instances/:agentId/sync", async (req, res) => {
    assertCompanyAccess(req, req.params.companyId);

    const agent = await db.query.agents.findFirst({
      where: and(
        eq(agentsTable.id, req.params.agentId),
        eq(agentsTable.companyId, req.params.companyId),
      ),
    });
    if (!agent) throw notFound("Agent not found");

    const instance = await db.query.agentInstances.findFirst({
      where: and(
        eq(agentInstances.agentId, req.params.agentId),
        eq(agentInstances.companyId, req.params.companyId),
      ),
    });
    if (!instance) throw notFound("Agent instance not found");

    if (!instance.templateId) throw badRequest("Instance has no linked template");

    const template = await db.query.agentTemplates.findFirst({
      where: eq(agentTemplates.id, instance.templateId),
    });
    if (!template) throw notFound("Template not found");

    const [updated] = await db
      .update(agentInstances)
      .set({
        templateSnapshot: {
          name: template.name,
          role: template.role,
          emoji: template.emoji,
          color: template.color,
          category: template.category,
          tier: template.tier,
          description: template.description,
          systemPrompt: template.systemPrompt,
          tools: template.tools,
          superpowers: template.superpowers,
        },
        lastSyncedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(agentInstances.id, instance.id))
      .returning();

    res.json({ instance: updated });
  });

  return router;
}
