import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import { createRoute, z } from "@hono/zod-openapi";

import { insertCalendarSchema, patchCalendarSchema, selectCalendarSchema } from "../../db/schema.js";
import { notFoundSchema } from "../../lib/constants.js";
import { createErrorSchema, IdParamsSchema, jsonContent, jsonContentRequired } from "../../utils/schema.util.js";

const tags = ["Calendars"];

export const list = createRoute({
  path: "/calendars",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectCalendarSchema),
      "The list of calendars",
    ),
  },
});

export const create = createRoute({
  path: "/calendars",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertCalendarSchema,
      "The calendar to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectCalendarSchema,
      "The created calendar",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertCalendarSchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  path: "/calendars/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectCalendarSchema,
      "The requested calendar",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Calendar not found",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: "/calendars/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchCalendarSchema,
      "The calendar updates",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectCalendarSchema,
      "The updated calendar",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Calendar not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchCalendarSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/calendars/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Calendar deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Calendar not found",
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
