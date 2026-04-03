CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"price_fcfa" integer DEFAULT 0 NOT NULL,
	"duration_days" integer,
	"max_agents" integer DEFAULT 1 NOT NULL,
	"credits_included" integer DEFAULT 0 NOT NULL,
	"features" text[] DEFAULT '{}' NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"color" text DEFAULT '#0071E3' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "plans_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "company_credits" ADD COLUMN "total_purchased" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "company_credits" ADD COLUMN "total_used" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD COLUMN "agent_id" uuid;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD COLUMN "price_fcfa" integer;--> statement-breakpoint
CREATE INDEX "plans_name_idx" ON "plans" USING btree ("name");--> statement-breakpoint
CREATE INDEX "plans_order_idx" ON "plans" USING btree ("order");--> statement-breakpoint
CREATE INDEX "plans_public_idx" ON "plans" USING btree ("is_public");