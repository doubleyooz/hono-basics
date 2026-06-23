import { eq, sql } from "drizzle-orm";

import { reactions } from "../../db/schema.js";
import type { CreateReactionRequest, KINDS } from "./reaction.schema.js";

import db from "../../db/index.js";


async function create(reaction: CreateReactionRequest) {
    const result = await db.insert(reactions).values({
        authorPubkey: reaction.authorPubkey,
        postId: reaction.postId,
        commentId: reaction.commentId,
        kind: reaction.kind,
        createdAt: new Date(),
    }).returning();

    return result[0]; // Return the first (and only) inserted report
}

async function getAll(reaction: Partial<CreateReactionRequest>) {
    if (reaction.commentId) return await getManyByCommentId(reaction.commentId);
    if (reaction.postId) return await getManyByPostId(reaction.postId);

    const result = await db.select().from(reactions);
    return result;
}


async function getOneById(id: string) {
    const result = await db.query.reactions.findFirst({
        where(fields, operators) {
            return operators.eq(fields.id, id);
        },
    });

    return result || null;
}

async function getManyByCommentId(id: string, kind: typeof KINDS) {
    const result = await db.query.reactions.findMany({
        where(fields, operators) {
            return operators.eq(fields.commentId, id);
        },
    });

    return result || null;
}

async function getManyByPostId(id: string) {
    const result = await db.query.reactions.findMany({
        where(fields, operators) {
            return operators.eq(fields.postId, id);
        },
    });

    return result || null;
}


async function update(id: string, updates: Partial<CreateReactionRequest>) {
    const result = await db
        .update(reactions)
        .set(updates)
        .where(eq(reactions.id, id))
        .returning();

    return result[0] || null;
}

async function remove(id: string) {
    const result = await db
        .delete(reactions)
        .where(eq(reactions.id, id))
        .returning();

    return result[0] || null;
}

export { create, getAll, getOneById, getManyByCommentId, getManyByPostId, remove, update };
