import { serve } from "@hono/node-server";

import env from "./env.js";
import createApp from "./lib/create-app.js";
import indexRoutes from "./routes/index.route.js";
import powRoutes from "./routes/pows/pow.index.js";
import postRoutes from "./routes/posts/post.index.js"
import profileRoutes from "./routes/profiles/profile.index.js";
import reactionRoutes from "./routes/reactions/reaction.index.js";
import reportRoutes from "./routes/reports/report.index.js";

const app = createApp();
const port = env.PORT | 3000;

const routes = [
  indexRoutes,
  postRoutes,
  powRoutes,
  profileRoutes,
  reactionRoutes,
  reportRoutes,
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
