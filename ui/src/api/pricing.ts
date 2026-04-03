import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

export interface Plan {
  id: string;
  name: string;
  displayName: string;
  priceFcfa: number;
  durationDays: number | null;
  maxAgents: number;
  creditsIncluded: number;
  features: string[];
  isPublic: boolean;
  isPopular: boolean;
  color: string;
  order: number;
}

export interface CreditBalance {
  id: string;
  companyId: string;
  balance: number;
  totalPurchased: number;
  totalUsed: number;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  companyId: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string | null;
  agentId: string | null;
  priceFcfa: number | null;
  createdAt: string;
}

export const plansApi = {
  list: () => api.get<{ plans: Plan[] }>("/api/plans"),
  listAll: () => api.get<{ plans: Plan[] }>("/api/plans/all"),
};

export const creditsApi = {
  get: (companyId: string) =>
    api.get<{ credits: CreditBalance; transactions: CreditTransaction[] }>(`/api/companies/${companyId}/credits`),
  add: (companyId: string, pack: "1000" | "5000" | "15000") =>
    api.post<{ credits: CreditBalance; pack: { credits: number; priceFcfa: number } }>(`/api/companies/${companyId}/credits/add`, { pack }),
  deduct: (companyId: string, amount: number, description: string, agentId?: string) =>
    api.post<{ credits: CreditBalance }>(`/api/companies/${companyId}/credits/deduct`, { amount, description, agentId }),
};

export const CREDIT_PACKS = [
  { id: "1000" as const, credits: 1000, priceFcfa: 2500, badge: "Pour commencer", popular: false },
  { id: "5000" as const, credits: 5000, priceFcfa: 10000, badge: "⭐ Populaire", popular: true },
  { id: "15000" as const, credits: 15000, priceFcfa: 25000, badge: "Meilleure valeur", popular: false },
];
