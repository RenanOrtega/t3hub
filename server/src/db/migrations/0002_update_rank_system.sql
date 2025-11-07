-- Migration: Update Elo system to use League of Legends rank structure

-- Update players table: replace elo columns with rank columns
ALTER TABLE "players" DROP COLUMN "current_elo";
ALTER TABLE "players" DROP COLUMN "peak_elo";
ALTER TABLE "players" ADD COLUMN "current_rank" jsonb NOT NULL DEFAULT '{"tier":"FERRO","division":"IV","lp":0}';
ALTER TABLE "players" ADD COLUMN "peak_rank" jsonb NOT NULL DEFAULT '{"tier":"FERRO","division":"IV","lp":0}';

-- Update teams table: replace elo_average with average_rank
ALTER TABLE "teams" DROP COLUMN "elo_average";
ALTER TABLE "teams" ADD COLUMN "average_rank" jsonb;

-- Update scrim_slots table: replace elo requirements with rank requirements
ALTER TABLE "scrim_slots" DROP COLUMN "min_elo_required";
ALTER TABLE "scrim_slots" DROP COLUMN "max_elo_required";
ALTER TABLE "scrim_slots" ADD COLUMN "min_rank_required" jsonb NOT NULL DEFAULT '{"tier":"FERRO","division":"IV","lp":0}';
ALTER TABLE "scrim_slots" ADD COLUMN "max_rank_required" jsonb NOT NULL DEFAULT '{"tier":"DESAFIANTE","division":null,"lp":9999}';
