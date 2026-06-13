import { z } from "@hono/zod-openapi";

export const insertPostSchema = z.object({
  authorPubkey: z.string().min(1).max(500),
  content: z.string().min(1).max(1000),
  visibility: z.number().int().positive().default(2),

}).strict();

export const patchPostSchema = insertPostSchema.partial();
export type CreatePostRequest = z.infer<typeof insertPostSchema>;

export const selectPostSchema = z.object({
  id: z.string(),    
  authorPubkey: z.string().min(1).max(500),
  content: z.string().min(1).max(1000),
  visibility: z.number().int().positive().default(2),
  reactionCount: z.number().int().positive().default(0),
  commentCount: z.number().int().positive().default(0),
  createdAt: z.coerce.date(),
});
