import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import { createRoute, z } from "@hono/zod-openapi";

import { insertProfileSchema, patchProfileSchema, selectProfileSchema } from "./profile.schema.js";
import { notFoundSchema, PROFILES } from "../../lib/constants.js";
import { createErrorSchema, IdParamsSchema, jsonContent, jsonContentRequired } from "../../utils/schema.util.js";

const profiles = [PROFILES];
const mainPath = `/${PROFILES.toLowerCase()}`;

export const list = createRoute({
  path: mainPath,
  method: "get",
  profiles,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectProfileSchema),
      "The list of profiles",
    ),
  },
});

export const getOne = createRoute({
  path: `${mainPath}/{id}`,
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  profiles,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectProfileSchema,
      "The requested profile",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Profile not found",
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
      patchProfileSchema,
      "The profile updates",
    ),
  },
  profiles,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectProfileSchema,
      "The updated profile",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Profile not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchProfileSchema)
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
  profiles,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Profile deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Profile not found",
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
      insertProfileSchema,
      "The profile to create",
    ),
  },
  profiles,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectProfileSchema,
      "The created profile",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertProfileSchema),
      "The validation error(s)",
    ),
  },
});


export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
