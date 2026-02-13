// import dependencies
import express from "express";
import {
  setOrder,
  getOrders,
  getOrderById,
  getOrderByKey,
  updOrder,
  delOrder,
} from "../controllers/OrderController.js";

// router init
const orderRouter = express.Router();

// set the routes
orderRouter.get("/api/orders", getOrders);
orderRouter.get("/api/orders/id/:id", getOrderById);
orderRouter.get("/api/orders/key/:key", getOrderByKey);
orderRouter.post("/api/orders", setOrder);
orderRouter.patch("/api/orders/id/:id", updOrder);
orderRouter.delete("/api/orders/id/:id", delOrder);

export default orderRouter;
