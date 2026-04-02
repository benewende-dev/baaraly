CREATE TABLE IF NOT EXISTS "company_credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'XOF' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "company_credits" ADD CONSTRAINT "company_credits_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "company_credits_company_idx" ON "company_credits" USING btree ("company_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"type" text NOT NULL,
	"amount" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"description" text,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credit_transactions_company_created_idx" ON "credit_transactions" USING btree ("company_id", "created_at");
