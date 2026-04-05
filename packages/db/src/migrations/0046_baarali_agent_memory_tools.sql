-- Baarali Phase 2 — Tables agents autonomes
-- AgentMemory : mémoire persistante court/long terme des agents
CREATE TABLE "agent_memory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" uuid NOT NULL,
	"type" text DEFAULT 'short_term' NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- AgentTool : outils disponibles par agent
CREATE TABLE "agent_tools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" uuid NOT NULL,
	"tool_name" text NOT NULL,
	"config" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agent_memory" ADD CONSTRAINT "agent_memory_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_tools" ADD CONSTRAINT "agent_tools_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agent_memory_agent_type_idx" ON "agent_memory" USING btree ("agent_id","type");--> statement-breakpoint
CREATE INDEX "agent_memory_agent_key_idx" ON "agent_memory" USING btree ("agent_id","key");--> statement-breakpoint
CREATE INDEX "agent_tools_agent_active_idx" ON "agent_tools" USING btree ("agent_id","is_active");--> statement-breakpoint
CREATE INDEX "agent_tools_agent_tool_name_idx" ON "agent_tools" USING btree ("agent_id","tool_name");
