import { pgTable, uuid, text, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { agents } from "./agents.js";
import { agentTemplates } from "./agent_templates.js";

export const agentInstances = pgTable(
  "agent_instances",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    agentId: uuid("agent_id").notNull().references(() => agents.id),
    templateId: uuid("template_id").references(() => agentTemplates.id),
    templateSnapshot: jsonb("template_snapshot").$type<Record<string, unknown>>().notNull(),
    customPrompt: text("custom_prompt"),
    isPaid: boolean("is_paid").notNull().default(false),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index("agent_instances_company_idx").on(table.companyId),
    agentIdx: index("agent_instances_agent_idx").on(table.agentId),
    templateIdx: index("agent_instances_template_idx").on(table.templateId),
  }),
);
