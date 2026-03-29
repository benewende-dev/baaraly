import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { agents } from "./agents.js";

// Mémoire persistante des agents — court terme ou long terme
export const agentMemory = pgTable(
  "agent_memory",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    agentId: uuid("agent_id").notNull().references(() => agents.id, { onDelete: "cascade" }),
    type: text("type").notNull().default("short_term"), // short_term | long_term
    key: text("key").notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    agentTypeIdx: index("agent_memory_agent_type_idx").on(table.agentId, table.type),
    agentKeyIdx: index("agent_memory_agent_key_idx").on(table.agentId, table.key),
  }),
);
