import { pgTable, uuid, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { Rank } from "@shared/types/rank";

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  teamName: varchar("team_name", { length: 255 }).notNull(),
  averageRank: jsonb("average_rank").$type<Rank>(),
  rosterStatus: varchar("roster_status", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
