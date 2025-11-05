import { pgTable, uuid, timestamp, integer, varchar } from 'drizzle-orm/pg-core';
import { teams } from './teams';

export const scrimSlots = pgTable('scrim_slots', {
  id: uuid('id').primaryKey().defaultRandom(),
  hostTeamId: uuid('host_team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  dateTimeStart: timestamp('date_time_start').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  minEloRequired: integer('min_elo_required').notNull(),
  maxEloRequired: integer('max_elo_required').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type ScrimSlot = typeof scrimSlots.$inferSelect;
export type NewScrimSlot = typeof scrimSlots.$inferInsert;
