CREATE TABLE IF NOT EXISTS "daily_prospect_counts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "billing_plan" text DEFAULT 'trial' NOT NULL;
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "trial_ends_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "daily_prospect_limit" integer DEFAULT 5 NOT NULL;
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "max_companies" integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "daily_prospect_counts" ADD CONSTRAINT "daily_prospect_counts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "daily_prospect_counts_company_date_idx" ON "daily_prospect_counts" USING btree ("company_id","date");
