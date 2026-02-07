import { swaggerUI } from "@hono/swagger-ui";
import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types.ts";

export default function createAppOpenAPI(app: AppOpenAPI) {
  const DOCS = "/docs";

  app.doc(DOCS, {
    openapi: "3.0.0",
    info: {
      title: "Hono OpenAPI Example",
      version: "1.0.0",
      description: "An example of using Hono with OpenAPI documentation",
    },

  });

  app.get(`${DOCS}/ui`, swaggerUI({ url: DOCS }));

  app.get(`${DOCS}/scalar`, Scalar({ url: DOCS }));
}
