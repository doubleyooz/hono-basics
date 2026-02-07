import { z } from "@hono/zod-openapi";
import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  integer,
  text,
  date,
  timestamp,
  uniqueIndex,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// You can use enum or just text — enum gives DB-level validation
export const boxStateEnum = pgEnum("box_state", [
  "very easy",
  "easy",
  "medium",
  "hard",
  "very hard",
  "defeated",
  "none",
]);

// ── Users Table ─────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`NOW()`),
});

// ── Calendars Table (one user can have many) ───────────────────────────────
export const calendars = pgTable("calendars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),                    // e.g. "Exercise", "Deep Work", "No Sugar"
  description: text("description"),                // optional
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`NOW()`),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .default(sql`NOW()`)
    .$onUpdate(() => sql`NOW()`),
}, (t) => [
  uniqueIndex("calendars_user_name_idx").on(t.userId, t.name),
]);

// ── Entries Table (daily states per calendar) ───────────────────────────────
export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  calendarId: integer("calendar_id")
    .notNull()
    .references(() => calendars.id, { onDelete: "cascade" }),
  date: date("date", { mode: "date" }).notNull(),
  state: text("state").notNull(),                   // or boxStateEnum("state").notNull()
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .default(sql`NOW()`)
    .$onUpdate(() => sql`NOW()`),
}, (t) => [
  uniqueIndex("entries_calendar_date_idx").on(t.calendarId, t.date),
]);

// ── Zod Schemas ─────────────────────────────────────────────────────────────

// === Calendars ===

export const selectCalendarSchema = createSelectSchema(calendars).extend({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const insertCalendarSchema = z.object({
  userId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional().default(true),
}).strict();

export const patchCalendarSchema = insertCalendarSchema
  .omit({ userId: true })
  .partial();

export type Calendar = z.infer<typeof selectCalendarSchema>;
export type CreateCalendar = z.infer<typeof insertCalendarSchema>;
export type UpdateCalendar = z.infer<typeof patchCalendarSchema>;

// === Entries ===

export const selectEntrySchema = createSelectSchema(entries).extend({
  id: z.number().int().positive(),
  calendarId: z.number().int().positive(),
  date: z.string(),           // YYYY-MM-DD
  state: z.enum([
    "very easy",
    "easy",
    "medium",
    "hard",
    "very hard",
    "defeated",
    "none",
  ] as const),
  updatedAt: z.string().datetime().nullable(),
});

export type Entry = z.infer<typeof selectEntrySchema>;

export const insertEntrySchema = z.object({
  calendarId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD"),
  state: z.enum([
    "very easy",
    "easy",
    "medium",
    "hard",
    "very hard",
    "defeated",
    "none",
  ] as const),
}).strict();

export const patchEntrySchema = z.object({
  state: z.enum([
    "very easy",
    "easy",
    "medium",
    "hard",
    "very hard",
    "defeated",
    "none",
  ] as const).optional(),
});

export type CreateEntry = z.infer<typeof insertEntrySchema>;
export type UpdateEntryRequest = z.infer<typeof patchEntrySchema>;