import { pgTable, uuid, text, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { agents } from "./agents.js";

// Outils disponibles pour chaque agent
export const agentTools = pgTable(
  "agent_tools",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    agentId: uuid("agent_id").notNull().references(() => agents.id, { onDelete: "cascade" }),
    toolName: text("tool_name").notNull(),
    config: jsonb("config").$type<Record<string, unknown>>(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    agentActiveIdx: index("agent_tools_agent_active_idx").on(table.agentId, table.isActive),
    agentToolNameIdx: index("agent_tools_agent_tool_name_idx").on(table.agentId, table.toolName),
  }),
);
