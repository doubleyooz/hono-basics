import type { AppRouterHandler } from "../../lib/types.js";
import type { ListRoute } from "./task.route.js";

import { OK } from "../../utils/http-status-codes.js";

export const list: AppRouterHandler<ListRoute> = (c) => {
  return c.json([{
    name: "Task 1",
    done: false,
  }, {
    name: "Task 2",
    done: true,
  }], OK);
};
