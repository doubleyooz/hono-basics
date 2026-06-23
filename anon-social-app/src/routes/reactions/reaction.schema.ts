import { z } from "@hono/zod-openapi";

export const KINDS = ['like', 'heart', 'laugh', 'fire'] as const;
export type Kind = typeof KINDS[number];

const cannotProvideBoth = (data: any) => {
  const hasProfile = data.profilePubkey != null;
  const hasPost = data.postId != null;
  return !(hasProfile && hasPost);
};

const cannotProvideBothErrorMessage = "Cannot provide both 'commentId' and 'postId'";


// Base schema without refinements
const reactionBaseSchema = z.object({
  authorPubkey: z.string(),
  commentId: z.string().nullable(),
  postId: z.string().nullable(),
  kind: z.enum(KINDS),
  visibility: z.number().int().min(0).max(2),
  createdAt: z.coerce.date(),
}).strict();

// Schema for INSERT / CREATE
export const insertReactionSchema = reactionBaseSchema
  .refine(
    (data) => !!data.commentId || !!data.postId,
    {
      message: "Either 'commentId' or 'postId' is required",
      path: ["commentId"],
    }
  )
  .refine(
    cannotProvideBoth,
    {
      message: cannotProvideBothErrorMessage,
      path: ["postId"],
    }
  );

export const patchReactionSchema = z
  .object({
    authorPubkey: z.string().optional(),
    commentId: z.string().nullable().optional(),
    postId: z.string().nullable().optional(),
    reason: z.string().min(2).max(100).optional(),
    kind: z.enum(KINDS).optional(),
    visibility: z.number().int().min(0).max(2).optional(),
  })
  .strict()
  .refine(
    cannotProvideBoth,
    {
      message: cannotProvideBothErrorMessage,
      path: ["postId"],
    }
  );



export type CreateReactionRequest = z.infer<typeof insertReactionSchema>;

export const selectReactionSchema = reactionBaseSchema
  .extend({
    id: z.string(),
  })
  .strict();
