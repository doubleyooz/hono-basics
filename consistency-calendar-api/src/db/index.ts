import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js';

import env from "../env.js";
import * as schema from "./schema.js"; // Adjust the path if your schema file is elsewhere

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(env.DATABASE_URL, { prepare: false })
export const db = drizzle(client, { schema });