import { swaggerUI } from "@hono/swagger-ui";
import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types.js";

export default function createAppOpenAPI(app: AppOpenAPI) {
  app.doc("/docs", {
    openapi: "3.0.0",
    info: {
      title: "Hono OpenAPI Example",
      version: "1.0.0",
      description: "An example of using Hono with OpenAPI documentation",
    },

  });

  app.get("/docs/ui", swaggerUI({ url: "/docs" }));

  app.get("/scalar", Scalar({ url: "/doc" }));
}
