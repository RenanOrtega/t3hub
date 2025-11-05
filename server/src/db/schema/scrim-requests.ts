import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { scrimSlots } from './scrim-slots';
import { teams } from './teams';

export const scrimRequests = pgTable('scrim_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  slotId: uuid('slot_id')
    .notNull()
    .references(() => scrimSlots.id, { onDelete: 'cascade' }),
  requestingTeamId: uuid('requesting_team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).notNull(),
  requestMessage: varchar('request_message', { length: 1000 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type ScrimRequest = typeof scrimRequests.$inferSelect;
export type NewScrimRequest = typeof scrimRequests.$inferInsert;
