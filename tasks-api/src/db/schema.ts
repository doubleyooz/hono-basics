import { z } from "@hono/zod-openapi";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tasks = sqliteTable("tasks", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  name: text("name")
    .notNull(),
  done: integer("done", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`).$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const selectTasksSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  done: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const insertTasksSchema = z.object({
  name: z.string().min(1).max(500),
  done: z.boolean().default(false),
}).strict();

export const patchTasksSchema = insertTasksSchema.partial();
export type CreateTaskRequest = z.infer<typeof insertTasksSchema>;
