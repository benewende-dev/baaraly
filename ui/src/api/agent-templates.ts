import { api } from "./client";

export interface AgentTemplate {
  id: string;
  name: string;
  slug: string;
  role: string;
  emoji: string;
  color: string;
  category: string;
  tier: number;
  description: string;
  capabilities: string;
  systemPrompt: string;
  tools: string[];
  superpowers: string[];
  price: number;
  isPremium: boolean;
  version: number;
  isActive: boolean;
  isPublic: boolean;
  sortIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgentInstance {
  id: string;
  companyId: string;
  agentId: string;
  templateId: string | null;
  templateSnapshot: Record<string, unknown>;
  customPrompt: string | null;
  isPaid: boolean;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
  template?: AgentTemplate | null;
}

export interface CreateTemplateInput {
  name: string;
  slug?: string;
  role: string;
  emoji?: string;
  color?: string;
  category?: string;
  tier?: number;
  description: string;
  systemPrompt: string;
  tools?: string[];
  superpowers?: string[];
  price?: number;
  isPremium?: boolean;
  isActive?: boolean;
  isPublic?: boolean;
  sortIndex?: number;
}

export interface UpdateTemplateInput {
  name?: string;
  slug?: string;
  role?: string;
  emoji?: string;
  color?: string;
  category?: string;
  tier?: number;
  description?: string;
  systemPrompt?: string;
  tools?: string[];
  superpowers?: string[];
  price?: number;
  isPremium?: boolean;
  isActive?: boolean;
  isPublic?: boolean;
  sortIndex?: number;
}

export const agentTemplatesApi = {
  list: () =>
    api.get<{ templates: AgentTemplate[] }>("/api/agent-templates"),

  listAdmin: () =>
    api.get<{ templates: AgentTemplate[] }>("/api/agent-templates/admin"),

  getById: (id: string) =>
    api.get<{ template: AgentTemplate }>(`/api/agent-templates/${id}`),

  create: (data: CreateTemplateInput) =>
    api.post<{ template: AgentTemplate }>("/api/agent-templates", data),

  update: (id: string, data: UpdateTemplateInput) =>
    api.put<{ template: AgentTemplate }>(`/api/agent-templates/${id}`, data),

  delete: (id: string) =>
    api.delete<{ success: boolean }>(`/api/agent-templates/${id}`),

  listInstances: (companyId: string) =>
    api.get<{ instances: AgentInstance[] }>(`/api/companies/${companyId}/agent-instances`),

  syncInstance: (companyId: string, agentId: string) =>
    api.post<{ instance: AgentInstance }>(`/api/companies/${companyId}/agent-instances/${agentId}/sync`, {}),

  hireFromTemplate: (companyId: string, templateId: string, body?: { model?: string; command?: string; budgetMonthlyCents?: number }) =>
    api.post<{ agent: unknown }>(`/api/companies/${companyId}/agent-templates/${templateId}/hire`, body ?? {}),

  hireAll: (companyId: string, body?: { model?: string; command?: string; budgetMonthlyCents?: number; templateIds?: string[] }) =>
    api.post<{ hired: Array<{ name: string; id: string }>; skipped: string[]; total: number }>(`/api/companies/${companyId}/agent-templates/hire-all`, body ?? {}),
};
