import { z } from "zod";

export const BILLING_PLANS = ["trial", "pro"] as const;
export type BillingPlan = (typeof BILLING_PLANS)[number];

export const TRIAL_LIMITS = {
  dailyProspectLimit: 5,
  maxCompanies: 1,
  trialDays: 7,
} as const;

export const PRO_LIMITS = {
  dailyProspectLimit: 30,
  maxCompanies: 10,
} as const;

export const PROSPECT_COST_CENTS = 4; // ~0.04$ per conversation

export function getTrialEndDate(): Date {
  const now = new Date();
  return new Date(now.getTime() + TRIAL_LIMITS.trialDays * 24 * 60 * 60 * 1000);
}

export function getProspectCostCents(): number {
  return PROSPECT_COST_CENTS;
}
