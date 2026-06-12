import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import { createRoute, z } from "@hono/zod-openapi";

import { insertPowSchema, patchPowSchema, selectPowSchema } from "./pow.schema.js";
import { notFoundSchema } from "../../lib/constants.js";
import { createErrorSchema, IdParamsSchema, jsonContent, jsonContentRequired } from "../../utils/schema.util.js";
import { POWS } from "../../lib/constants.js";

const pows = [POWS];
const mainPath = `/${POWS}`;

export const list = createRoute({
  path: mainPath,
  method: "get",
  pows,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectPowSchema),
      "The list of pows",
    ),
  },
});

export const create = createRoute({
  path: mainPath,
  method: "post",
  request: {
    body: jsonContentRequired(
      insertPowSchema,
      "The pow to create",
    ),
  },
  pows,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectPowSchema,
      "The created pow",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertPowSchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  path: `${mainPath}/{id}`,
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  pows,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPowSchema,
      "The requested pow",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Pow not found",
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
      patchPowSchema,
      "The pow updates",
    ),
  },
  pows,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPowSchema,
      "The updated pow",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Pow not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchPowSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const markAsUsed = createRoute({
  path: `${mainPath}/{id}/mark-as-used`,
  method: "patch",
  request: {
    params: IdParamsSchema,
  },
  pows,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPowSchema,
      "The updated pow with used status",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Pow not found",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const remove = createRoute({
  path: `${mainPath}/{id}`,
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  pows,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Pow deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Pow not found",
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
export type MarkAsUsedRoute = typeof markAsUsed;
