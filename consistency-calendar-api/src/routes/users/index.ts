import { createRouter } from "../../lib/create-app.js";
import * as controllers from "./user.controller.js";
import * as routes from "./user.route.js";

const router = createRouter()
  .openapi(routes.list, controllers.list)
  .openapi(routes.create, controllers.create)
  .openapi(routes.getOne, controllers.getById)
  .openapi(routes.remove, controllers.remove);

export default router;
