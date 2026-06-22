import { z } from "@hono/zod-openapi";

export const insertProfileSchema = z.object({
  displayName: z.string().min(2).max(100),
  bio: z.string().max(200).optional(),
  profileVisibility: z.number().int().positive().default(0),
  postsVisibility: z.number().int().positive().default(0),
  reactsVisibility: z.number().int().positive().default(0),

}).strict();

export const patchProfileSchema = insertProfileSchema.partial();
export type CreateProfileRequest = z.infer<typeof insertProfileSchema>;

export const selectProfileSchema = z.object({
  id: z.string(),
  pubkey: z.string(),    
  displayName: z.string().nullable(),
  bio: z.string().min(1).max(1000).nullable(),
  profileVisibility: z.number().int().positive().default(0),
  postsVisibility: z.number().int().positive().default(0),
  reactsVisibility: z.number().int().positive().default(0),
  createdAt: z.coerce.date(),
});
