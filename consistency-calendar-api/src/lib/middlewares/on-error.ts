import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { INTERNAL_SERVER_ERROR, OK } from "@doubleyooz/wardenhttp/http-status-codes";

const onError: ErrorHandler = (err, c) => {

  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;

  let statusCode: ContentfulStatusCode = currentStatus !== OK
    ? (currentStatus as ContentfulStatusCode)
    : INTERNAL_SERVER_ERROR


  const isProduction = c.env?.NODE_ENV === "production" || process.env?.NODE_ENV === "production";

  return c.json(
    {
      message: err.message,
      stack: isProduction ? undefined : err.stack,
    },
    statusCode,
  );
};

export default onError;
