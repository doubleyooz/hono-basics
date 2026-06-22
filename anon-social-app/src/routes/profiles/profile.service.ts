import { eq, sql } from "drizzle-orm";

import { profiles } from "../../db/schema.js";
import type { CreateProfileRequest } from "./profile.schema.js";

import db from "../../db/index.js";

async function create(profile: CreateProfileRequest) {
    const result = await db.insert(profiles).values({
        bio: profile.bio,
        displayName: profile.displayName,
        postsVisibility: profile.postsVisibility,
        profileVisibility: profile.profileVisibility,
        reactsVisibility: profile.reactsVisibility,  
        createdAt: new Date(),   
    }).returning();

    return result[0]; // Return the first (and only) inserted pow
}

async function getAll() {
    const result = await db.select().from(profiles);
    return result;
}

async function getById(id: string) {
    const result = await db.query.profiles.findFirst({
        where(fields, operators) {
            return operators.eq(fields.pubkey, id);
        },
    });

    return result || null;
}

async function update(pubkey: string, updates: Partial<CreateProfileRequest>) {
    const result = await db
        .update(profiles)
        .set(updates)
        .where(eq(profiles.pubkey, pubkey))
        .returning();

    return result[0] || null;
}

async function remove(pubkey: string) {
    const result = await db
        .delete(profiles)
        .where(eq(profiles.pubkey, pubkey))
        .returning();

    return result[0] || null;
}

export { create, getAll, getById, remove, update };
