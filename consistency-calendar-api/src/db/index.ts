import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js';

import env from "../env.js";

import * as calendars from './schemas/calendars.schema.js';
import * as entries from './schemas/entries.schema.js';
import * as users from './schemas/users.schema.js';

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(env.DATABASE_URL, { prepare: false })
export const db = drizzle(client, { schema: {... calendars, ...entries, ...users} });