import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";

import type { AppRouterHandler } from "../../lib/types.js";
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute, MarkAsDoneRoute } from "./pow.route.js";

import * as service from "./pow.service.js";

const create: AppRouterHandler<CreateRoute> = async (c) => {
  const body = await c.req.json();
  console.log("Creating pow with body:", body);
  const result = await service.create(body);
  return c.json(result, HttpStatusCodes.CREATED);
};

const list: AppRouterHandler<ListRoute> = async (c) => {
  const result = await service.getAll();
  return c.json(result, HttpStatusCodes.OK);
};

const getById: AppRouterHandler<GetOneRoute> = async (c) => {

  const result = await service.getById(c.req.param("id"));

  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(result, HttpStatusCodes.OK);
};

const update: AppRouterHandler<PatchRoute> = async (c) => {
  const body = await c.req.json();
  const result = await service.update(c.req.param("id"), body);

  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(result, HttpStatusCodes.OK);
};

const remove: AppRouterHandler<RemoveRoute> = async (c) => {
  const result = await service.remove(c.req.param("id"));

  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: "Task deleted successfully" }, HttpStatusCodes.OK);
};

const markAsUsed: AppRouterHandler<MarkAsDoneRoute> = async (c) => {
  const id = Number.parseInt(c.req.param("id"));

  const result = await service.markAsUsed(c.req.param("id"));

  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(result, HttpStatusCodes.OK);
};

export { create, getById, list, remove, markAsUsed, update };
