import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import { createRoute, z } from "@hono/zod-openapi";

import { insertPostSchema, patchPostSchema, selectPostSchema } from "./post.schema.js";
import { notFoundSchema, POSTS } from "../../lib/constants.js";
import { createErrorSchema, IdParamsSchema, jsonContent, jsonContentRequired } from "../../utils/schema.util.js";

const posts = [POSTS];
const mainPath = `/${POSTS.toLowerCase()}`;

export const list = createRoute({
  path: mainPath,
  method: "get",
  posts,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectPostSchema),
      "The list of posts",
    ),
  },
});

export const getOne = createRoute({
  path: `${mainPath}/{id}`,
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  posts,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPostSchema,
      "The requested post",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Post not found",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: `${mainPath}/{id}`,
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchPostSchema,
      "The post updates",
    ),
  },
  posts,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPostSchema,
      "The updated post",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Post not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchPostSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: `${mainPath}/{id}`,
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  posts,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Post deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Post not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const create = createRoute({
  path: mainPath,
  method: "post",
  request: {
    body: jsonContentRequired(
      insertPostSchema,
      "The post to create",
    ),
  },
  posts,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectPostSchema,
      "The created post",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertPostSchema),
      "The validation error(s)",
    ),
  },
});


export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
