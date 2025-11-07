ALTER TABLE "players" ALTER COLUMN "in_game_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "primary_lane" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "secondary_lane" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "current_rank" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "peak_rank" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "champion_pool" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "availability_status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "puuid" varchar(255);--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "summoner_id" varchar(255);--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "game_name" varchar(255);--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "tag_line" varchar(50);--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "region" varchar(10) DEFAULT 'BR1' NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "profile_icon_id" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "summoner_level" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_puuid_unique" UNIQUE("puuid");