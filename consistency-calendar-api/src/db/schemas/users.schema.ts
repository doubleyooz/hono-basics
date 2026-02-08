import { z } from "@hono/zod-openapi";
import { is, sql } from "drizzle-orm";
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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`NOW()`),
});

export const insertUserSchema = z.object({
  email: z.email(),
}).strict();

export const selectUserSchema = createSelectSchema(users).extend({
  id: z.number().int().positive(),
  email: z.email(),
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
});


export const emailQuerySchema = z.object({
  email: z.email().openapi({
    param: {
      in: "query",
      name: "email",
      example: "user@example.com",
    },
  }),
});

export type CreateUser = z.infer<typeof insertUserSchema>;