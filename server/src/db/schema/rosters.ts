import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { players } from './players';
import { teams } from './teams';

export const rosters = pgTable('rosters', {
  id: uuid('id').primaryKey().defaultRandom(),
  playerId: uuid('player_id')
    .notNull()
    .unique()
    .references(() => players.id, { onDelete: 'cascade' }),
  teamId: uuid('team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  joinDate: timestamp('join_date').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Roster = typeof rosters.$inferSelect;
export type NewRoster = typeof rosters.$inferInsert;
