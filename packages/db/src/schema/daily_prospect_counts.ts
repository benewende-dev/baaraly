import { pgTable, uuid, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

/**
 * Tracks daily WhatsApp prospect counts per company.
 * Reset at midnight UTC.
 */
export const dailyProspectCounts = pgTable(
  "daily_prospect_counts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    /** Date in YYYY-MM-DD format (UTC) */
    date: timestamp("date", { withTimezone: true }).notNull(),
    /** Number of prospects contacted today */
    count: integer("count").notNull().default(0),
  },
  (table) => ({
    companyDateIdx: uniqueIndex("daily_prospect_counts_company_date_idx").on(table.companyId, table.date),
  }),
);
