import { pgTable, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const plans = pgTable(
  "plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    displayName: text("display_name").notNull(),
    priceFcfa: integer("price_fcfa").notNull().default(0),
    durationDays: integer("duration_days"),
    maxAgents: integer("max_agents").notNull().default(1),
    creditsIncluded: integer("credits_included").notNull().default(0),
    features: text("features").array().notNull().default([]),
    isPublic: boolean("is_public").notNull().default(true),
    isPopular: boolean("is_popular").notNull().default(false),
    color: text("color").notNull().default("#0071E3"),
    order: integer("order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    nameIdx: index("plans_name_idx").on(table.name),
    orderIdx: index("plans_order_idx").on(table.order),
    publicIdx: index("plans_public_idx").on(table.isPublic),
  }),
);
