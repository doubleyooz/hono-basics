import { createRouter } from "../../lib/create-app.js";
import * as controllers from "./calendar.controller.js";
import * as routes from "./calendar.route.js";

const router = createRouter()
  .openapi(routes.list, controllers.list)
  .openapi(routes.create, controllers.create)
  .openapi(routes.getOne, controllers.getById)
  .openapi(routes.patch, controllers.update)
  .openapi(routes.remove, controllers.remove);

export default router;
