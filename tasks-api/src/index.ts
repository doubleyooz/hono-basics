import { serve } from "@hono/node-server";
import { Hono } from "hono";

import env from "./env";
import notFound from "./middlewares/not-found.js";
import onError from "./middlewares/on-error.js";
import { pinoLogger } from "./middlewares/pino-logger.js";

const app = new Hono();

const port = env.PORT | 3000;

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.use(pinoLogger());
app.notFound(notFound);
app.onError(onError);

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
