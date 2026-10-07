ALTER TABLE "roles" RENAME COLUMN "deteled_at" TO "deleted_at";--> statement-breakpoint
ALTER TABLE "email_verification_tokens" ALTER COLUMN "uses_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "uses_at" DROP NOT NULL;