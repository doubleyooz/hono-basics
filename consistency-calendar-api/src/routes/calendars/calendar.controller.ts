import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";

import type { AppRouterHandler } from "../../lib/types.js";
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./calendar.route.js";

import * as service from "./calendar.service.js";


import pino from "pino";

const logger = pino();

const create: AppRouterHandler<CreateRoute> = async (c) => {
  const body = await c.req.json();
  logger.info("Creating calendar with body:", body);
  const result = await service.create(body);
  return c.json(result, HttpStatusCodes.CREATED);
};

const list: AppRouterHandler<ListRoute> = async (c) => {
  const result = await service.getAll();
  logger.info(`Listing all calendars: ${result}`);
  return c.json(result, HttpStatusCodes.OK);
};

const getById: AppRouterHandler<GetOneRoute> = async (c) => {
  const id = Number.parseInt(c.req.param("id"));
  logger.info(`Getting calendar with ID: ${id}`);
  const result = await service.getById(id);

  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(result, HttpStatusCodes.OK);
};

const update: AppRouterHandler<PatchRoute> = async (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const body = await c.req.json();
  const result = await service.update(id, body);

  logger.info(`Updating calendar with ID: ${id} with body:`, body);
  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(result, HttpStatusCodes.OK);
};

const remove: AppRouterHandler<RemoveRoute> = async (c) => {
  const id = Number.parseInt(c.req.param("id"));

  if (Number.isNaN(id)) {
    return c.json({ message: "Invalid Calendar ID" }, HttpStatusCodes.BAD_REQUEST);
  }
  logger.info(`Removing calendar with ID: ${id}`);
  const result = await service.remove(id);

  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: "Calendar deleted successfully" }, HttpStatusCodes.OK);
};

export { create, getById, list, remove, update };
