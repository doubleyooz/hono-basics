import type { Schema } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";

import type { AppBindings, AppOpenAPI } from "./types.js";

import { pinoLogger } from "../middlewares/pino-logger.js";
import configureOpenAPI from "./config-open-api.js";
import defaultHook from "./middlewares/default-hook.js";
import notFound from "./middlewares/not-found.js";
import onError from "./middlewares/on-error.js";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

export default function createApp() {
  const app = createRouter();

  app.use(pinoLogger());
  app.notFound(notFound);
  app.onError(onError);

  configureOpenAPI(app);

  return app;
}

export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  return createApp().route("/", router);
}
