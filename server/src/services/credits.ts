import { eq } from "drizzle-orm";
import type { Db } from "@paperclipai/db";
import { companyCredits, creditTransactions } from "@paperclipai/db";

export function creditService(db: Db) {
  async function getBalance(companyId: string) {
    const rows = await db
      .select()
      .from(companyCredits)
      .where(eq(companyCredits.companyId, companyId));
    if (rows.length === 0) {
      const [created] = await db
        .insert(companyCredits)
        .values({ companyId, balance: 100, currency: "XOF" })
        .returning();
      return created!;
    }
    return rows[0]!;
  }

  async function deductCredits(companyId: string, amount: number, description: string) {
    const current = await getBalance(companyId);
    if (current.balance < amount) {
      return { success: false as const, balance: current.balance, needed: amount };
    }
    const newBalance = current.balance - amount;
    await db
      .update(companyCredits)
      .set({ balance: newBalance, updatedAt: new Date() })
      .where(eq(companyCredits.companyId, companyId));
    await db.insert(creditTransactions).values({
      companyId,
      type: "debit",
      amount: -amount,
      balanceAfter: newBalance,
      description,
    });
    return { success: true as const, balance: newBalance };
  }

  async function addCredits(companyId: string, amount: number, description: string) {
    const current = await getBalance(companyId);
    const newBalance = current.balance + amount;
    await db
      .update(companyCredits)
      .set({ balance: newBalance, updatedAt: new Date() })
      .where(eq(companyCredits.companyId, companyId));
    await db.insert(creditTransactions).values({
      companyId,
      type: "credit",
      amount,
      balanceAfter: newBalance,
      description,
    });
    return { success: true as const, balance: newBalance };
  }

  async function listTransactions(companyId: string, limit = 20) {
    return db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.companyId, companyId))
      .orderBy(creditTransactions.createdAt)
      .limit(limit);
  }

  return { getBalance, deductCredits, addCredits, listTransactions };
}
