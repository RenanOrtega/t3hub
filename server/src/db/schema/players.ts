import { pgTable, uuid, varchar, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  inGameName: varchar('in_game_name', { length: 255 }).notNull(),
  primaryLane: varchar('primary_lane', { length: 50 }).notNull(),
  secondaryLane: varchar('secondary_lane', { length: 50 }).notNull(),
  currentElo: integer('current_elo').notNull(),
  peakElo: integer('peak_elo').notNull(),
  championPool: jsonb('champion_pool').$type<string[]>().notNull(),
  availabilityStatus: varchar('availability_status', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
