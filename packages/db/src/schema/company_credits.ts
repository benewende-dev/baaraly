import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export const companyCredits = pgTable(
  "company_credits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    balance: integer("balance").notNull().default(0),
    totalPurchased: integer("total_purchased").notNull().default(0),
    totalUsed: integer("total_used").notNull().default(0),
    currency: text("currency").notNull().default("XOF"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index("company_credits_company_idx").on(table.companyId),
  }),
);

export const creditTransactions = pgTable(
  "credit_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    type: text("type").notNull(),
    amount: integer("amount").notNull(),
    balanceAfter: integer("balance_after").notNull(),
    description: text("description"),
    agentId: uuid("agent_id"),
    priceFcfa: integer("price_fcfa"),
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyCreatedIdx: index("credit_transactions_company_created_idx").on(table.companyId, table.createdAt),
  }),
);
