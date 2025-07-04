import { createRouter } from "../../lib/create-app.js";
import * as controllers from "./task.controller.js";
import * as routes from "./task.route.js";

const router = createRouter()
  .openapi(routes.list, controllers.list)
  .openapi(routes.create, controllers.create)
  .openapi(routes.getOne, controllers.getById)
  .openapi(routes.patch, controllers.update)
  .openapi(routes.remove, controllers.remove)
  .openapi(routes.toggleDone, controllers.toggleDone);

export default router;
