import { api } from "./client";

export interface CreditBalance {
  id: string;
  companyId: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  companyId: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string | null;
  createdAt: string;
}

export interface RechargeResult {
  success: boolean;
  balance: number;
}

export const creditsApi = {
  getBalance: (companyId: string) =>
    api.get<CreditBalance>(`/companies/${companyId}/credits`),
  getTransactions: (companyId: string) =>
    api.get<CreditTransaction[]>(`/companies/${companyId}/credits/transactions`),
  recharge: (companyId: string, data: { packId: string; credits: number; fcfa: number; paymentMethod: string }) =>
    api.post<RechargeResult>(`/companies/${companyId}/credits/recharge`, data),
  deduct: (companyId: string, data: { amount: number; description: string }) =>
    api.post<RechargeResult>(`/companies/${companyId}/credits/deduct`, data),
};
