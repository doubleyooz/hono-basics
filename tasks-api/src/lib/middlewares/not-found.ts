import type { NotFoundHandler } from "hono";

import { NOT_FOUND } from "@doubleyooz/wardenhttp";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "@doubleyooz/wardenhttp";

const notFound: NotFoundHandler = (c) => {
  return c.json({
    message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
  }, NOT_FOUND);
};

export default notFound;
