import type { ErrorHandler } from "hono";
import type { HttpStatusCode } from "@doubleyooz/wardenhttp/http-status-messages";

import { INTERNAL_SERVER_ERROR, OK } from "@doubleyooz/wardenhttp/http-status-messages";


const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;
  const statusCode = currentStatus !== OK
    ? (currentStatus as HttpStatusCode)
    : INTERNAL_SERVER_ERROR;

  const env = c.env?.NODE_ENV || process.env?.NODE_ENV;
  return c.json(
    {
      message: err.message,

      stack: env === "production"
        ? undefined
        : err.stack,
    },
    statusCode,
  );
};

export default onError;
