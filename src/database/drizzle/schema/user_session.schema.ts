import { users } from '@/database/drizzle/schema/users.schema';
import { varchar } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const userSession = pgTable('user_session', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  refreshToken: varchar('refresh_token', { length: 255 }).notNull(),
  expiredAt: timestamp('expired_at', { withTimezone: true }).notNull(),
  revokeAt: timestamp('revoke_at', { withTimezone: true }),
  revokeReason: varchar('revoke_reason', { length: 255 }),
  userAgent: varchar('user_agent', { length: 255 }),
  ip: varchar('ip', { length: 45 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type UserSessionSelect = typeof userSession.$inferSelect;
