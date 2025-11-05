import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  teamName: varchar('team_name', { length: 255 }).notNull(),
  eloAverage: integer('elo_average').notNull().default(0),
  rosterStatus: varchar('roster_status', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
