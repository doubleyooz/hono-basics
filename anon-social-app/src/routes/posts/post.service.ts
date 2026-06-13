import { eq, sql } from "drizzle-orm";

import { posts } from "../../db/schema.js";
import type { CreatePostRequest } from "./post.schema.js";

import db from "../../db/index.js";

async function create(post: CreatePostRequest) {
    const result = await db.insert(posts).values({
       authorPubkey: post.authorPubkey,
       content: post.content,
       visibility: post.visibility,
       createdAt: new Date(),   
    }).returning();

    return result[0]; // Return the first (and only) inserted pow
}

async function getAll() {
    const result = await db.select().from(posts);
    return result;
}

async function getById(id: string) {
    const result = await db.query.posts.findFirst({
        where(fields, operators) {
            return operators.eq(fields.id, id);
        },
    });

    return result || null;
}

async function update(id: string, updates: Partial<CreatePostRequest>) {
    const result = await db
        .update(posts)
        .set(updates)
        .where(eq(posts.id, id))
        .returning();

    return result[0] || null;
}

async function remove(id: string) {
    const result = await db
        .delete(posts)
        .where(eq(posts.id, id))
        .returning();

    return result[0] || null;
}

export { create, getAll, getById, remove, update };
