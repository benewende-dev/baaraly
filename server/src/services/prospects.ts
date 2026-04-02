import { and, eq, gte, lte } from "drizzle-orm";
import type { Db } from "@paperclipai/db";
import { dailyProspectCounts } from "@paperclipai/db/schema/daily_prospect_counts";
import { companies } from "@paperclipai/db/schema/companies";

export interface ProspectResult {
  allowed: boolean;
  reason?: string;
  currentCount: number;
  limit: number;
  remaining: number;
  message?: string;
}

export interface ProspectStatus {
  billingPlan: string;
  dailyLimit: number;
  currentCount: number;
  remaining: number;
  trial: {
    active: boolean;
    daysRemaining: number;
    endsAt: string | null;
  };
  maxCompanies: number;
}

export class ProspectService {
  constructor(private db: Db) {}

  private getDayBounds(date: Date) {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);
    return { start, end };
  }

  async recordProspect(companyId: string): Promise<ProspectResult> {
    const company = await this.db.query.companies.findFirst({
      where: eq(companies.id, companyId),
    });

    if (!company) {
      return { allowed: false, currentCount: 0, limit: 0, remaining: 0, reason: "not_found", message: "Company not found" };
    }

    const now = new Date();
    const { start, end } = this.getDayBounds(now);

    const [todayRecord] = await this.db
      .select()
      .from(dailyProspectCounts)
      .where(
        and(
          eq(dailyProspectCounts.companyId, companyId),
          gte(dailyProspectCounts.date, start),
          lte(dailyProspectCounts.date, end),
        ),
      );

    const currentCount = todayRecord?.count ?? 0;
    const limit = company.dailyProspectLimit ?? 5;

    // Check trial expiry
    if (company.billingPlan === "trial" && company.trialEndsAt) {
      if (now > company.trialEndsAt) {
        return {
          allowed: false,
          reason: "trial_expired",
          currentCount,
          limit,
          remaining: 0,
          message: "Trial period has ended. Please upgrade to continue.",
        };
      }
    }

    if (currentCount >= limit) {
      return {
        allowed: false,
        reason: "daily_limit_reached",
        currentCount,
        limit,
        remaining: 0,
        message: `Daily prospect limit reached (${currentCount}/${limit}). Try again tomorrow.`,
      };
    }

    // Increment count
    if (todayRecord) {
      await this.db
        .update(dailyProspectCounts)
        .set({ count: currentCount + 1 })
        .where(eq(dailyProspectCounts.id, todayRecord.id));
    } else {
      await this.db.insert(dailyProspectCounts).values({
        companyId,
        date: now,
        count: 1,
      });
    }

    const newCount = currentCount + 1;
    return {
      allowed: true,
      currentCount: newCount,
      limit,
      remaining: limit - newCount,
    };
  }

  async getStatus(companyId: string): Promise<ProspectStatus | null> {
    const company = await this.db.query.companies.findFirst({
      where: eq(companies.id, companyId),
    });

    if (!company) return null;

    const now = new Date();
    const { start, end } = this.getDayBounds(now);

    const [todayRecord] = await this.db
      .select()
      .from(dailyProspectCounts)
      .where(
        and(
          eq(dailyProspectCounts.companyId, companyId),
          gte(dailyProspectCounts.date, start),
          lte(dailyProspectCounts.date, end),
        ),
      );

    const currentCount = todayRecord?.count ?? 0;
    const limit = company.dailyProspectLimit ?? 5;

    let trialStatus: ProspectStatus["trial"] = { active: false, daysRemaining: 0, endsAt: null };

    if (company.billingPlan === "trial" && company.trialEndsAt) {
      const endsAt = new Date(company.trialEndsAt);
      const daysRemaining = Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
      trialStatus = {
        active: now < endsAt,
        daysRemaining,
        endsAt: company.trialEndsAt.toISOString(),
      };
    }

    return {
      billingPlan: company.billingPlan,
      dailyLimit: limit,
      currentCount,
      remaining: Math.max(0, limit - currentCount),
      trial: trialStatus,
      maxCompanies: company.maxCompanies ?? 1,
    };
  }
}
