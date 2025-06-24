import type { CreateTaskRequest } from "../../db/schema.js";

import db from "../../db/index.js";

async function create(task: CreateTaskRequest) {
  const result = await db.insert(task).values(task).returning();

  return {
    result,
  };
}

export { create };
