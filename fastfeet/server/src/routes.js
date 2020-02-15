import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";
import SessionController from "./app/controllers/session.controller";
import RecipientController from "./app/controllers/admin.handler";
import CourierController from "./app/controllers/courier.controller";
import FileController from "./app/controllers/file.controller";
import authMiddleware from "./app/middlewares/auth";
import OrderController from "./app/controllers/order.controller";
import OrderByCourierActions from "./app/controllers/order.courier";
const routes = new Router();
const upload = multer(multerConfig);

routes.post("/sessions", SessionController.session);

// orders by delivery personal --- no authentication
routes.get("/orders/:id", OrderByCourierActions.index);
routes.put("/deliveryOrders/:id", OrderByCourierActions.pickup);
routes.put("/finished/:id", OrderByCourierActions.dropoff);

routes.use(authMiddleware);
routes.post("/files", upload.single("file"), FileController.store);
routes.post("/couriers", CourierController.store);
routes.put("/couriers/:id", CourierController.update);
routes.delete("/couriers/:id", CourierController.delete);
routes.get("/couriers", CourierController.index);

routes.post("/recipient", RecipientController.store);
routes.put("/update/:id", RecipientController.update);

// ORDERS HANDLED BY ADMIN
routes.get("/orders", OrderController.index);
routes.post("/orders", OrderController.store);
routes.delete("/orders/:id", OrderController.delete);

export default routes;
