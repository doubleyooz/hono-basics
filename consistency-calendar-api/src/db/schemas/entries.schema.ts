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
  date: date("date", { mode: "string" }).notNull(),
  state: boxStateEnum("state").notNull(),
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
  date: z.iso.date(),           // YYYY-MM-DD
  state: z.enum(boxStateEnum.enumValues),
  updatedAt: z.iso.datetime().nullable(),
});

export type Entry = z.infer<typeof selectEntrySchema>;

export const insertEntrySchema = z.object({
  calendarId: z.number().int().positive(),
  date: z.iso.date(), 
  state: z.enum(boxStateEnum.enumValues),
}).strict();

export const patchEntrySchema = z.object({
  state: z.enum(boxStateEnum.enumValues).optional(),
});

export type CreateEntry = z.infer<typeof insertEntrySchema>;
export type UpdateEntryRequest = z.infer<typeof patchEntrySchema>;