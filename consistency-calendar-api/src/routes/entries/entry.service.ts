import { eq, sql } from "drizzle-orm";

import type { CreateEntry } from "../../db/schemas/entries.schema.js";

import { db } from "../../db/index.js";
import { entries } from "../../db/schemas/entries.schema.js";

async function create(entry: CreateEntry) {
  console.log("Inserting entry into DB:", entry);
  const result = await db.insert(entries).values(entry).returning();

  return result[0]; // Return the first (and only) inserted calendar
}

async function getAll() {
  const result = await db.select().from(entries);
  return result ? result : [];
}

async function getById(id: number) {
  const result = await db.query.entries.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  return result || null;
}

async function update(id: number, updates: Partial<CreateEntry>) {
  const result = await db
    .update(entries)
    .set(updates)
    .where(eq(entries.id, id))
    .returning();

  return result[0] || null;
}

async function remove(id: number) {
  const result = await db
    .delete(entries)
    .where(eq(entries.id, id))
    .returning();

  return result[0] || null;
}

export { create, getAll, getById, remove, update };
