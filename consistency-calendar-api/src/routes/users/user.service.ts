import { eq, sql } from "drizzle-orm";

import type { CreateUser } from "../../db/schemas/users.schema.js";

import { db } from "../../db/index.js";
import { users } from "../../db/schemas/users.schema.js";

async function create(user: CreateUser) {
  console.log("Inserting user into DB:", user);
  const result = await db.insert(users).values(user).returning();

  return result[0]; // Return the first (and only) inserted user
}

async function getAll(email?: string) {
  if (email) {
    const user = await getByEmail(email);
    return user ? [user] : [];
  }
  const result = await db.select().from(users);
  return result;
}

async function getById(id: number) {
  const result = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  return result || null;
}

async function getByEmail(email: string) {
  const result = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, email);
    },
  });

  return result || null;
}

async function update(id: number, updates: Partial<CreateUser>) {
  const result = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();

  return result[0] || null;
}

async function remove(id: number) {
  const result = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning();

  return result[0] || null;
}

export { create, getAll, getById, getByEmail,remove, update };
