import { Router } from "express";
import type { Db } from "@paperclipai/db";
import { companies, agents, creditTransactions } from "@paperclipai/db";
import { sql, count, sum, gte } from "drizzle-orm";

/**
 * Admin metrics endpoint for PHASE 4E — Market Validation
 * Tracks: inscriptions, agents launched, recharges, paying users
 */
export function metricsRoutes(db: Db) {
  const router = Router();

  router.get("/admin/metrics", async (_req, res) => {
    try {
      // Total companies (inscriptions)
      const [{ totalInscriptions }] = await db
        .select({ totalInscriptions: count() })
        .from(companies);

      // Total agents launched
      const [{ totalAgents }] = await db
        .select({ totalAgents: count() })
        .from(agents);

      // Recharges count + total FCFA paid
      const rechargeStats = await db
        .select({
          totalRecharges: count(),
          totalFcfaPaid: sql<number>`coalesce(sum(case when ${creditTransactions.type} = 'credit' then ${creditTransactions.amount} else 0 end), 0)`,
        })
        .from(creditTransactions)
        .where(gte(creditTransactions.createdAt, new Date("2024-01-01")));

      // Paying users (companies with at least one recharge/payment)
      const payingUsersResult = await db
        .select({ payingUsers: sql<number>`count(distinct ${creditTransactions.companyId})` })
        .from(creditTransactions)
        .where(gte(creditTransactions.createdAt, new Date("2024-01-01")));

      // Recent signups (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [{ recentSignups }] = await db
        .select({ recentSignups: count() })
        .from(companies)
        .where(gte(companies.createdAt, sevenDaysAgo));

      res.json({
        inscriptions: Number(totalInscriptions),
        agentsLances: Number(totalAgents),
        recharges: Number(rechargeStats[0]?.totalRecharges ?? 0),
        paiementsTotal: Number(rechargeStats[0]?.totalFcfaPaid ?? 0),
        utilisateursPayants: Number(payingUsersResult[0]?.payingUsers ?? 0),
        recentSignups7j: Number(recentSignups),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: "Metrics fetch failed", detail: message });
    }
  });

  return router;
}
