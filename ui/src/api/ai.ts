import { api } from "./client";

export interface AIRouteResult {
  model: string;
  tier: "premium" | "balanced" | "economic" | "fast";
  estimatedCostPer1kTokens: number;
  balance: number;
}

export interface AIGenerateInput {
  prompt: string;
  systemPrompt?: string;
  taskType?: "chat" | "marketing" | "code" | "analysis" | "automation";
  complexity?: "low" | "medium" | "high";
  priority?: "speed" | "quality" | "cost";
  maxTokens?: number;
  temperature?: number;
}

export interface AIGenerateResult {
  content: string;
  model: string;
  tier: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  cost: number;
  balanceAfter: number;
  durationMs: number;
  fallbackUsed: boolean;
}

export const aiApi = {
  route: (companyId: string, data: { taskType?: string; complexity?: string; priority?: string }) =>
    api.post<AIRouteResult>(`/companies/${companyId}/ai/route`, data),

  generate: (companyId: string, data: AIGenerateInput) =>
    api.post<AIGenerateResult>(`/companies/${companyId}/ai/generate`, data),
};
