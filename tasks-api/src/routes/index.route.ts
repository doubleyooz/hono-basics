import { createRoute, z } from "@hono/zod-openapi";

import { createRouter } from "../lib/create-app.js";

const router = createRouter()
  .openapi(createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "Tasks API index",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),

          },
        },
      },
    },
  }), (c) => {
    return c.json({ message: "Tasks API" });
  });
export default router;
