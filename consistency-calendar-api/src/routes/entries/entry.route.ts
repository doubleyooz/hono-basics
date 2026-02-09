import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import { createRoute, z } from "@hono/zod-openapi";

import { insertEntrySchema, patchEntrySchema, selectEntrySchema } from "../../db/schemas/entries.schema.js";
import { notFoundSchema } from "../../lib/constants.js";
import { createErrorSchema, IdParamsSchema, jsonContent, jsonContentRequired } from "../../utils/schema.util.js";

const tags = ["Entries"];
const path = "/entries";


export const list = createRoute({
  path,
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectEntrySchema),
      "The list of entries",
    ),
  },
});

export const create = createRoute({
  path,
  method: "post",
  request: {
    body: jsonContentRequired(
      insertEntrySchema,
      "The entry to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectEntrySchema,
      "The created entry",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertEntrySchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  path: `${path}/{id}`,
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectEntrySchema,
      "The requested entry",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Entry not found",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: `${path}/{id}`,
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchEntrySchema,
      "The entry updates",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectEntrySchema,
      "The updated entry",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Entry not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchEntrySchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: `${path}/{id}`,
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Entry deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Entry not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
