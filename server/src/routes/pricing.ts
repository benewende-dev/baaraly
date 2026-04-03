import { Router } from "express";
import type { Db } from "@paperclipai/db";
import { plans, companyCredits, creditTransactions } from "@paperclipai/db";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { assertBoard, assertCompanyAccess } from "./authz.js";
import { notFound, badRequest, unprocessable } from "../errors.js";

const CREDIT_PACKS: Record<string, { credits: number; priceFcfa: number }> = {
  "1000": { credits: 1000, priceFcfa: 2500 },
  "5000": { credits: 5000, priceFcfa: 10000 },
  "15000": { credits: 15000, priceFcfa: 25000 },
};

const addCreditsSchema = z.object({
  pack: z.enum(["1000", "5000", "15000"]),
});

const deductCreditsSchema = z.object({
  amount: z.number().int().positive(),
  agentId: z.string().uuid().optional(),
  description: z.string().min(1),
});

export function pricingRoutes(db: Db) {
  const router = Router();

  router.get("/plans", async (_req, res) => {
    const allPlans = await db.query.plans.findMany({
      where: and(eq(plans.isPublic, true), eq(plans.isActive, true)),
      orderBy: [plans.order],
    });
    res.json({ plans: allPlans });
  });

  router.get("/plans/all", async (req, res) => {
    assertBoard(req);
    const allPlans = await db.query.plans.findMany({
      where: eq(plans.isActive, true),
      orderBy: [plans.order],
    });
    res.json({ plans: allPlans });
  });

  router.get("/companies/:companyId/credits", async (req, res) => {
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    assertCompanyAccess(req, companyId);

    let credits = await db.query.companyCredits.findFirst({
      where: eq(companyCredits.companyId, companyId),
    });

    if (!credits) {
      const [created] = await db
        .insert(companyCredits)
        .values({ companyId, balance: 0, totalPurchased: 0, totalUsed: 0 })
        .returning();
      credits = created;
    }

    const transactions = await db.query.creditTransactions.findMany({
      where: eq(creditTransactions.companyId, companyId),
      orderBy: [desc(creditTransactions.createdAt)],
      limit: 20,
    });

    res.json({ credits, transactions });
  });

  router.post("/companies/:companyId/credits/add", validate(addCreditsSchema), async (req, res) => {
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    assertCompanyAccess(req, companyId);
    const body = req.body as z.infer<typeof addCreditsSchema>;

    const pack = CREDIT_PACKS[body.pack];
    if (!pack) throw badRequest(`Pack "${body.pack}" not found`);

    let credits = await db.query.companyCredits.findFirst({
      where: eq(companyCredits.companyId, companyId),
    });

    if (!credits) {
      const [created] = await db
        .insert(companyCredits)
        .values({ companyId, balance: pack.credits, totalPurchased: pack.credits, totalUsed: 0 })
        .returning();
      credits = created;
    } else {
      [credits] = await db
        .update(companyCredits)
        .set({
          balance: credits.balance + pack.credits,
          totalPurchased: credits.totalPurchased + pack.credits,
          updatedAt: new Date(),
        })
        .where(eq(companyCredits.id, credits.id))
        .returning();
    }

    await db.insert(creditTransactions).values({
      companyId,
      type: "purchase",
      amount: pack.credits,
      balanceAfter: credits.balance,
      description: `Achat pack ${pack.credits} crédits`,
      priceFcfa: pack.priceFcfa,
    });

    res.json({ credits, pack });
  });

  router.post("/companies/:companyId/credits/deduct", validate(deductCreditsSchema), async (req, res) => {
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    assertCompanyAccess(req, companyId);
    const body = req.body as z.infer<typeof deductCreditsSchema>;

    const credits = await db.query.companyCredits.findFirst({
      where: eq(companyCredits.companyId, companyId),
    });

    if (!credits) throw unprocessable("Aucun solde de crédits trouvé");
    if (credits.balance < body.amount) {
      return res.status(402).json({
        error: "Crédits insuffisants",
        message: `Il te reste ${credits.balance} crédits. Cette action en coûte ${body.amount}. Rechargez pour continuer.`,
        balance: credits.balance,
        required: body.amount,
      });
    }

    const newBalance = credits.balance - body.amount;

    await db
      .update(companyCredits)
      .set({
        balance: newBalance,
        totalUsed: credits.totalUsed + body.amount,
        updatedAt: new Date(),
      })
      .where(eq(companyCredits.id, credits.id));

    await db.insert(creditTransactions).values({
      companyId,
      type: "usage",
      amount: -body.amount,
      balanceAfter: newBalance,
      description: body.description,
      agentId: body.agentId ?? null,
    });

    res.json({ credits: { ...credits, balance: newBalance } });
  });

  return router;
}
