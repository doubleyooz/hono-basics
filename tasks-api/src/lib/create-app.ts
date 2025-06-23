import { OpenAPIHono } from "@hono/zod-openapi";

import type { AppBindings } from "./types.js";

import notFound from "../middlewares/not-found.js";
import onError from "../middlewares/on-error.js";
import { pinoLogger } from "../middlewares/pino-logger.js";
import configureOpenAPI from "./config-open-api.js";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false });
}

export default function createApp() {
  const app = createRouter();

  app.use(pinoLogger());
  app.notFound(notFound);
  app.onError(onError);

  configureOpenAPI(app);

  return app;
}
