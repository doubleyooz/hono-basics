import { OK } from "@doubleyooz/wardenhttp/http-status-codes";
import { createRoute, z } from "@hono/zod-openapi";

import { createRouter } from "../lib/create-app.js";

const router = createRouter()
  .openapi(createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      [OK]: {
        description: "Calendar API index",
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
    return c.json({ message: "Calendar API" }, OK);
  });
export default router;
