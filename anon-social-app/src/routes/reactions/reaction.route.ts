import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import { createRoute, z } from "@hono/zod-openapi";

import { insertReactionSchema, patchReactionSchema, selectReactionSchema } from "./reaction.schema.js";
import { notFoundSchema, REPORTS } from "../../lib/constants.js";
import { createErrorSchema, IdParamsSchema, jsonContent, jsonContentRequired } from "../../utils/schema.util.js";

const reports = [REPORTS];
const mainPath = `/${REPORTS.toLowerCase()}`;

export const list = createRoute({
  path: mainPath,
  method: "get",
  reports,
  request: {
    query: selectReactionSchema

  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectReactionSchema),
      "The list of reports",
    ),
  },
});

export const getOne = createRoute({
  path: `${mainPath}/{id}`,
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  reports,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectReactionSchema,
      "The requested reaction",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Reaction not found",
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
      patchReactionSchema,
      "The reaction updates",
    ),
  },
  reports,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectReactionSchema,
      "The updated reaction",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Reaction not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchReactionSchema)
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
  reports,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Reaction deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Reaction not found",
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
      insertReactionSchema,
      "The reaction to create",
    ),
  },
  reports,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectReactionSchema,
      "The created reaction",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertReactionSchema),
      "The validation error(s)",
    ),
  },
});


export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
