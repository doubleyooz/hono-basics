import { eq, sql } from "drizzle-orm";

import { powNonces } from "../../db/schema.js";
import type { CreatePowRequest } from "./pow.schema.js";

import env from "../../env.js";
import db from "../../db/index.js";

async function create(pow: CreatePowRequest) {
    const result = await db.insert(powNonces).values({
        challengeId: pow.challengeId,
        expiresAt: new Date(Date.now() + env.POW_WINDOW),
        fuel: pow.fuel
       
    }).returning();

    return result[0]; // Return the first (and only) inserted pow
}

async function getAll() {
    const result = await db.select().from(powNonces);
    return result;
}

async function getById(challengeId: string) {
    const result = await db.query.powNonces.findFirst({
        where(fields, operators) {
            return operators.eq(fields.challengeId, challengeId);
        },
    });

    return result || null;
}

async function update(challengeId: string, updates: Partial<CreatePowRequest>) {
    const result = await db
        .update(powNonces)
        .set(updates)
        .where(eq(powNonces.challengeId, challengeId))
        .returning();

    return result[0] || null;
}

async function remove(challengeId: string) {
    const result = await db
        .delete(powNonces)
        .where(eq(powNonces.challengeId, challengeId))
        .returning();

    return result[0] || null;
}

async function revokePowNonce(challengeId: string) {
    const result = await db
        .update(powNonces)
        .set({ revoked: true })
        .where(eq(powNonces.challengeId, challengeId))
        .returning();

    return result[0] || null;
}

export { create, getAll, getById, remove, revokePowNonce, update };
