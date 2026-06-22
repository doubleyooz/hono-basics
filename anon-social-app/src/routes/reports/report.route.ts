import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import { createRoute, z } from "@hono/zod-openapi";

import { insertReportSchema, patchReportSchema, selectReportSchema } from "./report.schema.js";
import { notFoundSchema, REPORTS } from "../../lib/constants.js";
import { createErrorSchema, IdParamsSchema, jsonContent, jsonContentRequired } from "../../utils/schema.util.js";

const reports = [REPORTS];
const mainPath = `/${REPORTS.toLowerCase()}`;

export const list = createRoute({
  path: mainPath,
  method: "get",
  reports,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectReportSchema),
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
      selectReportSchema,
      "The requested report",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Report not found",
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
      patchReportSchema,
      "The report updates",
    ),
  },
  reports,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectReportSchema,
      "The updated report",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Report not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchReportSchema)
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
      description: "Report deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Report not found",
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
      insertReportSchema,
      "The report to create",
    ),
  },
  reports,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectReportSchema,
      "The created report",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertReportSchema),
      "The validation error(s)",
    ),
  },
});


export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
