import { Router } from "express";
import type { Db } from "@paperclipai/db";
import { ProspectService } from "../services/prospects.js";
import { z } from "zod";

export function createProspectRoutes(db: Db): Router {
  const router = Router();
  const svc = new ProspectService(db);

  router.post(
    "/companies/:companyId/prospect-events",
    async (req, res) => {
      const companyId = req.params.companyId as string;
      const result = await svc.recordProspect(companyId);
      res.json(result);
    },
  );

  router.get(
    "/companies/:companyId/prospect-status",
    async (req, res) => {
      const companyId = req.params.companyId as string;
      const status = await svc.getStatus(companyId);
      if (!status) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(status);
    },
  );

  return router;
}
