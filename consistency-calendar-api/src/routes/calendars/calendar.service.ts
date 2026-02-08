import { eq, sql } from "drizzle-orm";

import type { CreateCalendar } from "../../db/schemas/calendars.schema.js";

import { db } from "../../db/index.js";
import { calendars } from "../../db/schemas/calendars.schema.js";

async function create(calendar: CreateCalendar) {
  console.log("Inserting calendar into DB:", calendar);
  const result = await db.insert(calendars).values(calendar).returning();

  return result[0]; // Return the first (and only) inserted calendar
}

async function getAll() {
  const result = await db.select().from(calendars);
  return result;
}

async function getById(id: number) {
  const result = await db.query.calendars.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  return result || null;
}

async function update(id: number, updates: Partial<CreateCalendar>) {
  const result = await db
    .update(calendars)
    .set(updates)
    .where(eq(calendars.id, id))
    .returning();

  return result[0] || null;
}

async function remove(id: number) {
  const result = await db
    .delete(calendars)
    .where(eq(calendars.id, id))
    .returning();

  return result[0] || null;
}

export { create, getAll, getById, remove, update };
