import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  username: text('username').notNull().unique(),

  password: text('password').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const bookingStatusEnum = pgEnum('booking_status', [
  'booked',
  'completed',
  'cancelled',
]);

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),

  carName: text('car_name').notNull(),

  days: integer('days').notNull(),

  rentPerDay: integer('rent_per_day').notNull(),

  status: bookingStatusEnum('status').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
});
