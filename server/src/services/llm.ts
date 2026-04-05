/**
 * LLM Service — PHASE 4D
 *
 * Unified LLM interface via OpenRouter.
 * Code NEVER depends on a specific provider — everything goes through OpenRouter.
 */

import { logger } from "../middleware/logger.js";
import { getFallbackModel } from "./aiRouter.js";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MAX_TOKENS_HARD_LIMIT = 4096;

// ── Simple in-memory cache (TÂCHE 7) ──────────────────────────────
const CACHE_MAX_SIZE = 128;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  result: GenerateResponseOutput;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();

function cacheKey(model: string, messages: LLMMessage[]): string {
  return `${model}::${JSON.stringify(messages)}`;
}

function getCached(key: string): GenerateResponseOutput | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return entry.result;
}

function setCache(key: string, result: GenerateResponseOutput) {
  if (responseCache.size >= CACHE_MAX_SIZE) {
    const oldest = responseCache.keys().next().value;
    if (oldest !== undefined) responseCache.delete(oldest);
  }
  responseCache.set(key, { result, expiresAt: Date.now() + CACHE_TTL_MS });
}

export interface LLMTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface LLMMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
}

export interface GenerateResponseInput {
  model: string;
  prompt: string;
  systemPrompt?: string;
  messages?: LLMMessage[];
  tools?: LLMTool[];
  maxTokens?: number;
  temperature?: number;
}

export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface GenerateResponseOutput {
  content: string;
  model: string;
  toolCalls: ToolCall[];
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  durationMs: number;
  costUsd: number | null;
  fallbackUsed: boolean;
}

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("OPENROUTER_API_KEY is not set. Add it to your environment variables.");
  }
  return key;
}

interface OpenRouterChoice {
  message?: {
    content?: string | null;
    tool_calls?: ToolCall[];
  };
}

interface OpenRouterUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
  usage?: OpenRouterUsage;
  model?: string;
}

async function callOpenRouter(
  model: string,
  messages: LLMMessage[],
  options: {
    tools?: LLMTool[];
    maxTokens?: number;
    temperature?: number;
  },
): Promise<{ response: OpenRouterResponse; durationMs: number }> {
  const apiKey = getApiKey();

  const body: Record<string, unknown> = {
    model,
    messages,
    max_tokens: options.maxTokens ?? 2048,
    temperature: options.temperature ?? 0.7,
  };

  if (options.tools && options.tools.length > 0) {
    body.tools = options.tools;
    body.tool_choice = "auto";
  }

  const startTime = Date.now();

  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.BAARALI_APP_URL ?? "https://baarali.com",
      "X-Title": "Baarali",
    },
    body: JSON.stringify(body),
  });

  const durationMs = Date.now() - startTime;

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "unknown");
    throw new Error(`OpenRouter API error ${res.status}: ${errorBody}`);
  }

  const response = (await res.json()) as OpenRouterResponse;
  return { response, durationMs };
}

/**
 * Generate a response via OpenRouter.
 * Automatically falls back to a cheaper model on error.
 */
export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  // Enforce hard token limit (TÂCHE 7)
  const safeMaxTokens = Math.min(input.maxTokens ?? 2048, MAX_TOKENS_HARD_LIMIT);

  const messages: LLMMessage[] = [];

  if (input.systemPrompt) {
    messages.push({ role: "system", content: input.systemPrompt });
  }

  if (input.messages && input.messages.length > 0) {
    messages.push(...input.messages);
  } else {
    messages.push({ role: "user", content: input.prompt });
  }

  // Check cache (TÂCHE 7)
  const key = cacheKey(input.model, messages);
  const cached = getCached(key);
  if (cached) {
    logger.info({ model: input.model, cache: "hit" }, "LLM cache hit");
    return cached;
  }

  let currentModel = input.model;
  let fallbackUsed = false;

  // Try primary model, then fallback
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { response, durationMs } = await callOpenRouter(currentModel, messages, {
        tools: input.tools,
        maxTokens: safeMaxTokens,
        temperature: input.temperature,
      });

      const choice = response.choices?.[0];
      const content = choice?.message?.content ?? "";
      const toolCalls = choice?.message?.tool_calls ?? [];
      const usage = response.usage ?? {};

      const inputTokens = usage.prompt_tokens ?? 0;
      const outputTokens = usage.completion_tokens ?? 0;
      const totalTokens = usage.total_tokens ?? inputTokens + outputTokens;

      logger.info(
        {
          model: currentModel,
          inputTokens,
          outputTokens,
          durationMs,
          fallbackUsed,
        },
        "LLM response received",
      );

      const output: GenerateResponseOutput = {
        content,
        model: response.model ?? currentModel,
        toolCalls,
        usage: { inputTokens, outputTokens, totalTokens },
        durationMs,
        costUsd: null,
        fallbackUsed,
      };

      // Store in cache (TÂCHE 7)
      if (!input.tools || input.tools.length === 0) {
        setCache(key, output);
      }

      return output;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.warn({ model: currentModel, error: message, attempt }, "LLM call failed");

      if (attempt === 0) {
        const fallback = getFallbackModel(currentModel);
        if (fallback !== currentModel) {
          logger.info({ from: currentModel, to: fallback }, "Falling back to cheaper model");
          currentModel = fallback;
          fallbackUsed = true;
          continue;
        }
      }

      throw new Error(`LLM generation failed after ${attempt + 1} attempt(s): ${message}`);
    }
  }

  // Should not reach here, but TypeScript needs it
  throw new Error("LLM generation failed: unexpected state");
}

/**
 * Simple text generation helper — no tools, no conversation history.
 */
export async function generateText(
  model: string,
  prompt: string,
  systemPrompt?: string,
): Promise<{ text: string; usage: GenerateResponseOutput["usage"]; durationMs: number; model: string }> {
  const result = await generateResponse({
    model,
    prompt,
    systemPrompt,
    maxTokens: 1024,
    temperature: 0.7,
  });
  return {
    text: result.content,
    usage: result.usage,
    durationMs: result.durationMs,
    model: result.model,
  };
}

// TÂCHE 8 — Viral Loop signature
export const BAARALI_SIGNATURE = "\n\n---\nEnvoyé avec Baarali \uD83E\uDD16";

/**
 * Append Baarali viral signature to outgoing text.
 */
export function withSignature(text: string): string {
  return text + BAARALI_SIGNATURE;
}
