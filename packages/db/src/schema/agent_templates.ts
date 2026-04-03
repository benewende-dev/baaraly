import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export const agentTemplates = pgTable(
  "agent_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    role: text("role").notNull(),
    emoji: text("emoji").notNull(),
    color: text("color").notNull(),
    category: text("category").notNull(),
    tier: integer("tier").notNull().default(1),
    description: text("description").notNull(),
    capabilities: text("capabilities").notNull().default(""),
    systemPrompt: text("system_prompt").notNull(),
    tools: jsonb("tools").$type<string[]>().notNull().default([]),
    superpowers: jsonb("superpowers").$type<string[]>().notNull().default([]),
    price: integer("price").notNull().default(0),
    isPremium: boolean("is_premium").notNull().default(false),
    version: integer("version").notNull().default(1),
    isActive: boolean("is_active").notNull().default(true),
    isPublic: boolean("is_public").notNull().default(true),
    sortIndex: integer("sort_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    categoryIdx: index("agent_templates_category_idx").on(table.category),
    tierIdx: index("agent_templates_tier_idx").on(table.tier),
    activeIdx: index("agent_templates_active_idx").on(table.isActive),
  }),
);
