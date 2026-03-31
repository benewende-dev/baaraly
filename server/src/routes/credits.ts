import { Router } from "express";
import type { Db } from "@paperclipai/db";
import { creditService } from "../services/credits.js";
import { assertCompanyAccess } from "./authz.js";

export function creditRoutes(db: Db) {
  const router = Router();
  const svc = creditService(db);

  router.get("/companies/:companyId/credits", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);
    const balance = await svc.getBalance(companyId);
    res.json(balance);
  });

  router.get("/companies/:companyId/credits/transactions", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);
    const transactions = await svc.listTransactions(companyId);
    res.json(transactions);
  });

  router.post("/companies/:companyId/credits/recharge", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);
    const { packId, credits, fcfa, paymentMethod } = req.body as {
      packId: string;
      credits: number;
      fcfa: number;
      paymentMethod: string;
    };
    if (!packId || !credits || !fcfa || !paymentMethod) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const result = await svc.addCredits(
      companyId,
      credits,
      `Recharge ${packId}: ${fcfa} FCFA via ${paymentMethod}`,
    );
    res.json(result);
  });

  router.post("/companies/:companyId/credits/deduct", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);
    const { amount, description } = req.body as { amount: number; description: string };
    if (!amount || !description) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const result = await svc.deductCredits(companyId, amount, description);
    if (!result.success) {
      res.status(402).json({ error: "Insufficient credits", balance: result.balance, needed: result.needed });
      return;
    }
    res.json(result);
  });

  return router;
}
