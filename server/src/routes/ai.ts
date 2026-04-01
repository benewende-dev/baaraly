/**
 * AI Routes — PHASE 4D
 *
 * Exposes the AI Router + LLM service as API endpoints.
 * Integrates with the credit system for cost tracking.
 */

import { Router } from "express";
import type { Db } from "@paperclipai/db";
import { routeTask, estimateCostCents, type TaskType, type TaskComplexity, type TaskPriority } from "../services/aiRouter.js";
import { generateResponse, type GenerateResponseInput } from "../services/llm.js";
import { creditService } from "../services/credits.js";
import { assertCompanyAccess } from "./authz.js";
import { logger } from "../middleware/logger.js";

const VALID_TYPES: TaskType[] = ["chat", "marketing", "code", "analysis", "automation"];
const VALID_COMPLEXITIES: TaskComplexity[] = ["low", "medium", "high"];
const VALID_PRIORITIES: TaskPriority[] = ["speed", "quality", "cost"];

export function aiRoutes(db: Db) {
  const router = Router();
  const credits = creditService(db);

  /**
   * POST /companies/:companyId/ai/generate
   *
   * Main endpoint: routes the task, checks credits, calls LLM, deducts cost.
   */
  router.post("/companies/:companyId/ai/generate", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);

    const {
      prompt,
      systemPrompt,
      taskType = "chat",
      complexity = "low",
      priority = "cost",
      maxTokens,
      temperature,
    } = req.body as {
      prompt?: string;
      systemPrompt?: string;
      taskType?: string;
      complexity?: string;
      priority?: string;
      maxTokens?: number;
      temperature?: number;
    };

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      res.status(400).json({ error: "Le champ 'prompt' est requis." });
      return;
    }

    if (!VALID_TYPES.includes(taskType as TaskType)) {
      res.status(400).json({ error: `Type invalide. Valeurs acceptées : ${VALID_TYPES.join(", ")}` });
      return;
    }
    if (!VALID_COMPLEXITIES.includes(complexity as TaskComplexity)) {
      res.status(400).json({ error: `Complexité invalide. Valeurs acceptées : ${VALID_COMPLEXITIES.join(", ")}` });
      return;
    }
    if (!VALID_PRIORITIES.includes(priority as TaskPriority)) {
      res.status(400).json({ error: `Priorité invalide. Valeurs acceptées : ${VALID_PRIORITIES.join(", ")}` });
      return;
    }

    // 1. Route the task to the optimal model
    const route = routeTask({
      type: taskType as TaskType,
      complexity: complexity as TaskComplexity,
      priority: priority as TaskPriority,
    });

    // 2. Estimate cost and check credits
    const estimatedTokens = (maxTokens ?? 1024) + Math.ceil(prompt.length / 4);
    const estimatedCost = Math.max(1, estimateCostCents(route.model, estimatedTokens, maxTokens ?? 1024));

    const balance = await credits.getBalance(companyId);
    if (balance.balance < estimatedCost) {
      res.status(402).json({
        error: "Crédits insuffisants",
        balance: balance.balance,
        needed: estimatedCost,
        model: route.model,
        tier: route.tier,
      });
      return;
    }

    // 3. Call LLM via OpenRouter
    try {
      const llmInput: GenerateResponseInput = {
        model: route.model,
        prompt: prompt.trim(),
        systemPrompt,
        maxTokens: maxTokens ?? 1024,
        temperature: temperature ?? 0.7,
      };

      const result = await generateResponse(llmInput);

      // 4. Calculate actual cost and deduct credits
      const actualCost = Math.max(1, estimateCostCents(
        result.model,
        result.usage.inputTokens,
        result.usage.outputTokens,
      ));

      const deduction = await credits.deductCredits(
        companyId,
        actualCost,
        `AI ${taskType} (${route.tier}) — ${result.model}`,
      );

      logger.info({
        companyId,
        model: result.model,
        tier: route.tier,
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        costCredits: actualCost,
        durationMs: result.durationMs,
        fallbackUsed: result.fallbackUsed,
      }, "AI generation completed");

      res.json({
        content: result.content,
        model: result.model,
        tier: route.tier,
        usage: result.usage,
        cost: actualCost,
        balanceAfter: deduction.success ? deduction.balance : balance.balance,
        durationMs: result.durationMs,
        fallbackUsed: result.fallbackUsed,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      logger.error({ companyId, error: message, model: route.model }, "AI generation failed");
      res.status(500).json({
        error: "Échec de la génération IA",
        detail: message,
        model: route.model,
        tier: route.tier,
      });
    }
  });

  /**
   * POST /companies/:companyId/ai/route
   *
   * Preview which model would be selected without calling it.
   */
  router.post("/companies/:companyId/ai/route", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);

    const { taskType = "chat", complexity = "low", priority = "cost" } = req.body as {
      taskType?: string;
      complexity?: string;
      priority?: string;
    };

    const route = routeTask({
      type: (VALID_TYPES.includes(taskType as TaskType) ? taskType : "chat") as TaskType,
      complexity: (VALID_COMPLEXITIES.includes(complexity as TaskComplexity) ? complexity : "low") as TaskComplexity,
      priority: (VALID_PRIORITIES.includes(priority as TaskPriority) ? priority : "cost") as TaskPriority,
    });

    const balance = await credits.getBalance(companyId);

    res.json({
      model: route.model,
      tier: route.tier,
      estimatedCostPer1kTokens: route.estimatedCostPer1kTokens,
      balance: balance.balance,
    });
  });

  return router;
}
