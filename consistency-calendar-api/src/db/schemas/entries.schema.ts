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
import { calendars } from "./calendars.schema.js";

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