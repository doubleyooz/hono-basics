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
import { users } from "./users.schema.js";

export const calendars = pgTable("calendars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),                    // e.g. "Exercise", "Deep Work", "No Sugar"
  description: text("description"),
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

export const selectCalendarSchema = createSelectSchema(calendars).extend({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});


export const insertCalendarSchema = z.object({
  userId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
}).strict();

export const patchCalendarSchema = insertCalendarSchema
  .omit({ userId: true })
  .partial();


export type Calendar = z.infer<typeof selectCalendarSchema>;
export type CreateCalendar = z.infer<typeof insertCalendarSchema>;
export type UpdateCalendar = z.infer<typeof patchCalendarSchema>;
