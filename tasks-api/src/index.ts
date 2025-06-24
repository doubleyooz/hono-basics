import { serve } from "@hono/node-server";

import env from "./env.js";
import createApp from "./lib/create-app.js";
import indexRoutes from "./routes/index.route.js";
import tasksRoutes from "./routes/tasks/task.index.js";

const app = createApp();
const port = env.PORT | 3000;

const routes = [
  indexRoutes,
  tasksRoutes,
];

routes.forEach((route) => {
  app.route("/", route);
});

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
