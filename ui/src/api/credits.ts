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

export interface CheckoutResponse {
  paymentId: string;
  status: string;
  provider: string;
  amount: number;
  currency: string;
  message: string;
}

export interface PaymentStatus {
  id: string;
  companyId: string;
  planId: string;
  provider: string;
  amount: number;
  currency: string;
  credits: number;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  providerRef: string | null;
  createdAt: string;
  completedAt: string | null;
}

export const creditsApi = {
  getBalance: (companyId: string) =>
    api.get<CreditBalance>(`/companies/${companyId}/credits`),

  getTransactions: (companyId: string) =>
    api.get<CreditTransaction[]>(`/companies/${companyId}/credits/transactions`),

  /** Create a checkout payment intent */
  checkout: (companyId: string, data: {
    planId: string;
    provider: string;
    amount: number;
    currency: string;
    credits: number;
    phoneNumber?: string;
    cardLast4?: string;
  }) => api.post<CheckoutResponse>(`/companies/${companyId}/checkout`, data),

  /** Confirm a payment (dev mode — in production this is done by webhook) */
  confirmPayment: (companyId: string, paymentId: string) =>
    api.post<{ status: string; balance: number }>(`/companies/${companyId}/checkout/${paymentId}/confirm`, {}),

  /** Poll payment status */
  getPaymentStatus: (companyId: string, paymentId: string) =>
    api.get<PaymentStatus>(`/companies/${companyId}/checkout/${paymentId}`),

  /** Deduct credits */
  deduct: (companyId: string, data: { amount: number; description: string }) =>
    api.post<{ success: boolean; balance: number }>(`/companies/${companyId}/credits/deduct`, data),
};
