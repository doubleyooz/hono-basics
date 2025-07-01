import * as HttpStatusCodes from "@doubleyooz/wardenhttp/http-status-codes";
import * as HttpStatusMessages from "@doubleyooz/wardenhttp/http-status-messages";

import type { AppRouterHandler } from "../../lib/types.js";
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute, ToggleDoneRoute } from "./task.route.js";

import * as taskService from "./task.service.js";

const create: AppRouterHandler<CreateRoute> = async (c) => {
  const body = await c.req.json();
  console.log("Creating task with body:", body);
  const result = await taskService.create(body);
  return c.json(result, HttpStatusCodes.CREATED);
};

const list: AppRouterHandler<ListRoute> = async (c) => {
  const result = await taskService.getAll();
  return c.json(result, HttpStatusCodes.OK);
};

const getById: AppRouterHandler<GetOneRoute> = async (c) => {
  const id = Number.parseInt(c.req.param("id"));

  const result = await taskService.getById(id);

  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(result, HttpStatusCodes.OK);
};

const update: AppRouterHandler<PatchRoute> = async (c) => {
  const id = Number.parseInt(c.req.param("id"));

  const body = await c.req.json();
  const result = await taskService.update(id, body);

  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(result, HttpStatusCodes.OK);
};

const remove: AppRouterHandler<RemoveRoute> = async (c) => {
  const id = Number.parseInt(c.req.param("id"));

  if (Number.isNaN(id)) {
    return c.json({ message: "Invalid task ID" }, HttpStatusCodes.BAD_REQUEST);
  }

  const result = await taskService.remove(id);

  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: "Task deleted successfully" }, HttpStatusCodes.OK);
};

const toggleDone: AppRouterHandler<ToggleDoneRoute> = async (c) => {
  const id = Number.parseInt(c.req.param("id"));

  const result = await taskService.toggleDone(id);

  if (!result) {
    return c.json({ message: HttpStatusMessages.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(result, HttpStatusCodes.OK);
};

export { create, getById, list, remove, toggleDone, update };
