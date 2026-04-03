import { Router } from "express";
import type { Db } from "@paperclipai/db";
import { agentTemplates, agentInstances, agents as agentsTable } from "@paperclipai/db";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { assertBoard, assertCompanyAccess } from "./authz.js";
import { notFound, forbidden, badRequest, conflict } from "../errors.js";
import { agentService, logActivity } from "../services/index.js";
import { AGENT_ROLES, AGENT_ICON_NAMES } from "@paperclipai/shared";

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

const hireAgentSchema = z.object({
  model: z.string().optional().default("opencode/qwen3.6-plus-free"),
  command: z.string().optional().default("opencode"),
  budgetMonthlyCents: z.number().int().nonnegative().optional().default(0),
});

const hireAllSchema = z.object({
  model: z.string().optional().default("opencode/qwen3.6-plus-free"),
  command: z.string().optional().default("opencode"),
  budgetMonthlyCents: z.number().int().nonnegative().optional().default(0),
  templateIds: z.array(z.string().uuid()).optional(),
});

function resolveRole(category: string, templateRole: string): string {
  const roleMap: Record<string, string> = {
    tech: "engineer",
    marketing: "marketing",
    finance: "finance",
    commerce: "sales",
    juridique: "legal",
    trading: "trading",
    crypto: "crypto",
    divertissement: "entertainment",
  };
  const resolved = roleMap[category] ?? templateRole;
  return AGENT_ROLES.includes(resolved as typeof AGENT_ROLES[number]) ? resolved : "general";
}

function resolveIcon(emoji: string): string {
  return AGENT_ICON_NAMES.includes(emoji as typeof AGENT_ICON_NAMES[number]) ? emoji : "robot";
}

export function agentTemplateRoutes(db: Db) {
  const router = Router();
  const svc = agentService(db);

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
          capabilities: template.capabilities,
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

  router.post(
    "/companies/:companyId/agent-templates/:templateId/hire",
    validate(hireAgentSchema),
    async (req, res) => {
      const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
      assertCompanyAccess(req, companyId);
      const templateId = Array.isArray(req.params.templateId)
        ? req.params.templateId[0]
        : req.params.templateId;
      const body = req.body as z.infer<typeof hireAgentSchema>;

      const template = await db.query.agentTemplates.findFirst({
        where: eq(agentTemplates.id, templateId),
      });
      if (!template) throw notFound("Template not found");
      if (!template.isActive) throw forbidden("Template is not active");

      const existing = await db.query.agents.findFirst({
        where: and(
          eq(agentsTable.companyId, companyId),
          eq(agentsTable.name, template.name),
        ),
      });
      if (existing) throw conflict(`Agent "${template.name}" already exists in this company`);

      const role = resolveRole(template.category, template.role);
      const icon = resolveIcon(template.emoji);

      const adapterConfig: Record<string, unknown> = {
        command: body.command,
        model: body.model,
        dangerouslySkipPermissions: true,
      };

      const created = await svc.create(companyId, {
        name: template.name,
        role,
        title: `${template.name} — ${template.category}`,
        icon,
        adapterType: "opencode_local",
        adapterConfig,
        budgetMonthlyCents: body.budgetMonthlyCents,
        status: "idle",
        metadata: {
          sourceTemplateId: template.id,
          sourceTemplateName: template.name,
          category: template.category,
        },
      });

      await db.insert(agentInstances).values({
        companyId,
        agentId: created.id,
        templateId: template.id,
        templateSnapshot: {
          name: template.name,
          role: template.role,
          emoji: template.emoji,
          color: template.color,
          category: template.category,
          tier: template.tier,
          description: template.description,
          capabilities: template.capabilities,
          systemPrompt: template.systemPrompt,
          tools: template.tools,
          superpowers: template.superpowers,
        },
        isPaid: true,
        lastSyncedAt: new Date(),
      });

      res.status(201).json({ agent: created });
    },
  );

  router.post(
    "/companies/:companyId/agent-templates/hire-all",
    validate(hireAllSchema),
    async (req, res) => {
      const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
      assertCompanyAccess(req, companyId);
      const body = req.body as z.infer<typeof hireAllSchema>;

      const templates = await db.query.agentTemplates.findMany({
        where: body.templateIds?.length
          ? inArray(agentTemplates.id, body.templateIds)
          : eq(agentTemplates.isActive, true),
        orderBy: [agentTemplates.sortIndex, agentTemplates.name],
      });

      if (templates.length === 0) throw notFound("No active templates found");

      const existingNames = new Set(
        (await db.query.agents.findMany({
          where: eq(agentsTable.companyId, companyId),
        })).map((a) => a.name),
      );

      const hired: Array<{ name: string; id: string }> = [];
      const skipped: string[] = [];

      for (const template of templates) {
        if (existingNames.has(template.name)) {
          skipped.push(template.name);
          continue;
        }

        const role = resolveRole(template.category, template.role);
        const icon = resolveIcon(template.emoji);

        const adapterConfig: Record<string, unknown> = {
          command: body.command,
          model: body.model,
          dangerouslySkipPermissions: true,
        };

        const created = await svc.create(companyId, {
          name: template.name,
          role,
          title: `${template.name} — ${template.category}`,
          icon,
          adapterType: "opencode_local",
          adapterConfig,
          budgetMonthlyCents: body.budgetMonthlyCents,
          status: "idle",
          metadata: {
            sourceTemplateId: template.id,
            sourceTemplateName: template.name,
            category: template.category,
          },
        });

        await db.insert(agentInstances).values({
          companyId,
          agentId: created.id,
          templateId: template.id,
          templateSnapshot: {
            name: template.name,
            role: template.role,
            emoji: template.emoji,
            color: template.color,
            category: template.category,
            tier: template.tier,
            description: template.description,
            capabilities: template.capabilities,
            systemPrompt: template.systemPrompt,
            tools: template.tools,
            superpowers: template.superpowers,
          },
          isPaid: true,
          lastSyncedAt: new Date(),
        });

        hired.push({ name: template.name, id: created.id });
      }

      res.status(201).json({ hired, skipped, total: templates.length });
    },
  );

  return router;
}
