ALTER TABLE "players" RENAME COLUMN "current_elo" TO "current_rank";--> statement-breakpoint
ALTER TABLE "players" RENAME COLUMN "peak_elo" TO "peak_rank";--> statement-breakpoint
ALTER TABLE "scrim_slots" RENAME COLUMN "min_elo_required" TO "min_rank_required";--> statement-breakpoint
ALTER TABLE "scrim_slots" RENAME COLUMN "max_elo_required" TO "max_rank_required";--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "average_rank" jsonb;--> statement-breakpoint
ALTER TABLE "teams" DROP COLUMN IF EXISTS "elo_average";