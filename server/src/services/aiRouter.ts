/**
 * AI Router — PHASE 4D
 *
 * Routes tasks to the optimal LLM model via OpenRouter,
 * balancing cost, performance, and quality.
 *
 * RULE: NEVER use a premium model for a simple task.
 */

export type TaskType = "chat" | "marketing" | "code" | "analysis" | "automation";
export type TaskComplexity = "low" | "medium" | "high";
export type TaskPriority = "speed" | "quality" | "cost";

export interface RouteTaskInput {
  type: TaskType;
  complexity: TaskComplexity;
  priority: TaskPriority;
}

export interface RouteTaskOutput {
  model: string;
  tier: "premium" | "balanced" | "economic" | "fast";
  estimatedCostPer1kTokens: number;
}

const MODELS = {
  premium: "anthropic/claude-sonnet-4-20250514",
  balanced: "openai/gpt-4.1-mini",
  economic: "openai/gpt-4.1-nano",
  fast: "meta-llama/llama-4-scout",
} as const;

const COST_PER_1K_TOKENS: Record<string, number> = {
  [MODELS.premium]: 0.015,
  [MODELS.balanced]: 0.004,
  [MODELS.economic]: 0.001,
  [MODELS.fast]: 0.0005,
};

/**
 * Route a task to the optimal model.
 *
 * Decision matrix:
 * - code + high complexity  → premium
 * - analysis + high         → premium
 * - code/analysis + medium  → balanced
 * - marketing               → balanced (always, regardless of complexity)
 * - chat + low              → economic (NEVER premium for simple chat)
 * - chat + medium           → balanced
 * - chat + high             → balanced (cap: no premium for chat)
 * - automation              → fast
 *
 * Priority overrides:
 * - "cost" downgrades one tier (premium→balanced, balanced→economic)
 * - "speed" forces fast tier for low/medium complexity
 * - "quality" upgrades one tier for medium+ complexity
 */
export function routeTask(input: RouteTaskInput): RouteTaskOutput {
  const { type, complexity, priority } = input;

  let tier = resolveTier(type, complexity);

  // Priority overrides
  if (priority === "cost") {
    tier = downgradeTier(tier);
  } else if (priority === "speed" && complexity !== "high") {
    tier = "fast";
  } else if (priority === "quality" && complexity !== "low") {
    tier = upgradeTier(tier);
  }

  // Hard rule: NEVER premium for simple tasks
  if (complexity === "low" && tier === "premium") {
    tier = "balanced";
  }

  // Hard rule: NEVER premium for chat
  if (type === "chat" && tier === "premium") {
    tier = "balanced";
  }

  const model = MODELS[tier];
  return {
    model,
    tier,
    estimatedCostPer1kTokens: COST_PER_1K_TOKENS[model] ?? 0.01,
  };
}

function resolveTier(type: TaskType, complexity: TaskComplexity): RouteTaskOutput["tier"] {
  switch (type) {
    case "code":
    case "analysis":
      if (complexity === "high") return "premium";
      if (complexity === "medium") return "balanced";
      return "economic";

    case "marketing":
      return "balanced";

    case "chat":
      if (complexity === "high") return "balanced";
      if (complexity === "medium") return "balanced";
      return "economic";

    case "automation":
      return "fast";

    default:
      return "economic";
  }
}

function downgradeTier(tier: RouteTaskOutput["tier"]): RouteTaskOutput["tier"] {
  switch (tier) {
    case "premium": return "balanced";
    case "balanced": return "economic";
    case "economic": return "fast";
    case "fast": return "fast";
  }
}

function upgradeTier(tier: RouteTaskOutput["tier"]): RouteTaskOutput["tier"] {
  switch (tier) {
    case "fast": return "economic";
    case "economic": return "balanced";
    case "balanced": return "premium";
    case "premium": return "premium";
  }
}

/**
 * Returns the fallback model (cheaper) for error recovery.
 */
export function getFallbackModel(currentModel: string): string {
  if (currentModel === MODELS.premium) return MODELS.balanced;
  if (currentModel === MODELS.balanced) return MODELS.economic;
  return MODELS.fast;
}

/**
 * Estimate cost in cents for a given token count and model.
 */
export function estimateCostCents(model: string, inputTokens: number, outputTokens: number): number {
  const rate = COST_PER_1K_TOKENS[model] ?? 0.01;
  const totalTokens = inputTokens + outputTokens;
  const costUsd = (totalTokens / 1000) * rate;
  return Math.round(costUsd * 100);
}
