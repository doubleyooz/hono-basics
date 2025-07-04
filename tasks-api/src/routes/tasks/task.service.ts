import { eq, sql } from "drizzle-orm";

import type { CreateTaskRequest } from "../../db/schema.js";

import db from "../../db/index.js";
import { tasks } from "../../db/schema.js";

async function create(task: CreateTaskRequest) {
  const result = await db.insert(tasks).values(task).returning();

  return result[0]; // Return the first (and only) inserted task
}

async function getAll() {
  const result = await db.select().from(tasks);

  return result;
}

async function getById(id: number) {
  const result = await db.query.tasks.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  return result || null;
}

async function update(id: number, updates: Partial<CreateTaskRequest>) {
  const result = await db
    .update(tasks)
    .set(updates)
    .where(eq(tasks.id, id))
    .returning();

  return result[0] || null;
}

async function remove(id: number) {
  const result = await db
    .delete(tasks)
    .where(eq(tasks.id, id))
    .returning();

  return result[0] || null;
}

async function toggleDone(id: number) {
  const result = await db
    .update(tasks)
    .set({ done: sql`NOT ${tasks.done}` })
    .where(eq(tasks.id, id))
    .returning();

  return result[0] || null;
}

export { create, getAll, getById, remove, toggleDone, update };
