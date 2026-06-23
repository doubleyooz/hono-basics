import { z } from "@hono/zod-openapi";

const cannotProvideBoth: (data) => boolean = (data: CreateReportRequest) => {
  const hasProfile = data.profilePubkey != null;
  const hasPost = data.postId != null;
  return !(hasProfile && hasPost);
};

const cannotProvideBothErrorMessage = "Cannot provide both 'profilePubkey' and 'postId'";

// Base schema without refinements
const reportBaseSchema = z.object({
  authorPubkey: z.string(),
  profilePubkey: z.string().nullable(),
  postId: z.string().nullable(),
  reason: z.string().min(2).max(100),
  createdAt: z.coerce.date(),
}).strict();

// Schema for INSERT / CREATE
export const insertReportSchema = reportBaseSchema
  .refine(
    (data) => !!data.profilePubkey || !!data.postId,
    {
      message: "Either 'profilePubkey' or 'postId' is required",
      path: ["profilePubkey"],
    }
  )
  .refine(
    cannotProvideBoth,
    {
      message: cannotProvideBothErrorMessage,
      path: ["postId"],
    }
  );

export const patchReportSchema = z
  .object({
    authorPubkey: z.string().optional(),
    profilePubkey: z.string().nullable().optional(),
    postId: z.string().nullable().optional(),
    reason: z.string().min(2).max(100).optional(),
    createdAt: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    cannotProvideBoth,
    {
      message: cannotProvideBothErrorMessage,
      path: ["postId"],
    }
  );



export type CreateReportRequest = z.infer<typeof insertReportSchema>;

export const selectReportSchema = reportBaseSchema
  .extend({
    id: z.string(),
  })
  .strict();
