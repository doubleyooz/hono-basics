import { defineConfig } from "drizzle-kit";

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import env from "./src/env";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
});
