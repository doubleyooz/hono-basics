import { eq, sql } from "drizzle-orm";

import { reports } from "../../db/schema.js";
import type { CreateReportRequest } from "./report.schema.js";

import db from "../../db/index.js";

async function create(report: CreateReportRequest) {
    const result = await db.insert(reports).values({
        profilePubkey: report.profilePubkey,
        postId: report.postId,
        reason: report.reason,
        authorPubkey: report.authorPubkey,
        createdAt: new Date(),   
    }).returning();

    return result[0]; // Return the first (and only) inserted report
}

async function getAll() {
    const result = await db.select().from(reports);
    return result;
}

async function getById(id: string) {
    const result = await db.query.reports.findFirst({
        where(fields, operators) {
            return operators.eq(fields.id, id);
        },
    });

    return result || null;
}

async function update(id: string, updates: Partial<CreateReportRequest>) {
    const result = await db
        .update(reports)
        .set(updates)
        .where(eq(reports.id, id))
        .returning();

    return result[0] || null;
}

async function remove(id: string) {
    const result = await db
        .delete(reports)
        .where(eq(reports.id, id))
        .returning();

    return result[0] || null;
}

export { create, getAll, getById, remove, update };
