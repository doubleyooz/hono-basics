import { z } from "@hono/zod-openapi";

export const insertPowSchema = z.object({
  challengeId: z.string().min(1).max(500),
  fuel: z.number().int().positive().default(0),
  revoked: z.boolean().default(false),

}).strict();

export const patchPowSchema = insertPowSchema.partial();
export type CreatePowRequest = z.infer<typeof insertPowSchema>;

export const selectPowSchema = z.object({
  challengeId: z.string().min(1).max(500),
  fuel: z.number().int().positive().default(0),
  revoked: z.boolean().default(false),
});
