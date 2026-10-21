import {
  boolean,
  index,
  inet,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import {
  Gender,
  type Gender as GenderType,
  UserStatus,
  type UserStatus as UserStatusType,
} from '../../../shared/constants/user.constants.js';
import { roles } from './roles.schema.js';
import { relations } from 'drizzle-orm';
import { date } from 'drizzle-orm/pg-core';

export const userStatusEnum = pgEnum(
  'user_status',
  Object.values(UserStatus) as [UserStatusType, ...UserStatusType[]],
);

export const userGenderEnum = pgEnum(
  'user_gender',
  Object.values(Gender) as [GenderType, ...GenderType[]],
);

export const users = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    dateOfBirth: date('date_of_birth', { mode: 'string' }),
    gender: userGenderEnum('gender').notNull().default(Gender.OTHER),
    email: varchar({ length: 255 }).notNull(),
    backupEmail: varchar('backup_email', { length: 255 }),
    backupEmailVerifiedAt: timestamp('backup_email_verified_at', {
      withTimezone: true,
    }),
    password: varchar({ length: 255 }).notNull(),
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id),
    status: userStatusEnum('status').notNull().default(UserStatus.PENDING),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    phone: varchar({ length: 30 }),
    mfaEnabled: boolean('mfa_enabled').notNull().default(false),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    lastLoginIp: inet('last_login_ip'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('users_email_unique').on(table.email),
    index('users_role_id_idx').on(table.roleId),
    index('users_status_idx').on(table.status),
  ],
);

export const userRelations = relations(users, ({ one }) => ({
  role: one(roles, { fields: [users.roleId], references: [roles.id] }),
}));

export type UserInsert = typeof users.$inferInsert;
