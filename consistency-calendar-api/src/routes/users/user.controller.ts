import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";

import type { AppRouterHandler } from "../../lib/types.js";
import type { CreateRoute, GetOneRoute, ListRoute, RemoveRoute } from "./user.route.js";

import * as service from "./user.service.js";

const create: AppRouterHandler<CreateRoute> = async (c) => {
  const body = await c.req.json();
  console.log("Creating user with body:", body);
  const result = await service.create(body);
  return c.json(result, HttpStatusCodes.CREATED);
};

const list: AppRouterHandler<ListRoute> = async (c) => {
  const email = c.req.query("email");

  const result = await service.getAll(email);
  return c.json(result, HttpStatusCodes.OK);
};

const getById: AppRouterHandler<GetOneRoute> = async (c) => {
  const id = Number.parseInt(c.req.param("id"));

  const result = await service.getById(id);

  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(result, HttpStatusCodes.OK);
};


const remove: AppRouterHandler<RemoveRoute> = async (c) => {
  const id = Number.parseInt(c.req.param("id"));

  if (Number.isNaN(id)) {
    return c.json({ message: "Invalid User ID" }, HttpStatusCodes.BAD_REQUEST);
  }

  const result = await service.remove(id);

  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: "User deleted successfully" }, HttpStatusCodes.OK);
};

export { create, getById, list, remove };
