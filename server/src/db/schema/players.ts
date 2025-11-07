import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { Rank } from "@shared/types/rank";

export const players = pgTable("players", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  puuid: varchar("puuid", { length: 255 }).unique(),
  summonerId: varchar("summoner_id", { length: 255 }),
  gameName: varchar("game_name", { length: 255 }),
  tagLine: varchar("tag_line", { length: 50 }),
  region: varchar("region", { length: 10 }).notNull().default("BR1"),
  profileIconId: integer("profile_icon_id"),
  summonerLevel: integer("summoner_level"),
  verifiedAt: timestamp("verified_at"),

  primaryLane: varchar("primary_lane", { length: 50 }),
  secondaryLane: varchar("secondary_lane", { length: 50 }),
  currentElo: jsonb("current_elo").$type<Rank>(),
  peakElo: jsonb("peak_elo").$type<Rank>(),
  championPool: jsonb("champion_pool").$type<string[]>(),
  availabilityStatus: varchar("availability_status", { length: 50 }),
  discordTag: varchar("discord_tag", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
