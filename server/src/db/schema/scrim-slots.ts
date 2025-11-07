import {
  pgTable,
  uuid,
  timestamp,
  integer,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { teams } from "./teams";
import { Rank } from "@shared/types/rank";

export const scrimSlots = pgTable("scrim_slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  hostTeamId: uuid("host_team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  dateTimeStart: timestamp("date_time_start").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  minRankRequired: jsonb("min_rank_required").$type<Rank>().notNull(),
  maxRankRequired: jsonb("max_rank_required").$type<Rank>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ScrimSlot = typeof scrimSlots.$inferSelect;
export type NewScrimSlot = typeof scrimSlots.$inferInsert;
