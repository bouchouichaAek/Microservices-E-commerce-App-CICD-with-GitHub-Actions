import express from "express";

import OrderController from "../Controllers/order.controllers.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

const order = express.Router();

order.get("/", authentication, authorization, OrderController.getAllOrders);
order.get("/:id", authentication, authorization, OrderController.getOrderById);
order.get(
  "/items/:id",
  authentication,
  authorization,
  OrderController.getOrderItemsByOrderId
);
order.post("/", OrderController.createOrder);
order.put("/:id", authentication, authorization, OrderController.updateOrder);
order.patch(
  "/:paymentId",
  authentication,
  authorization,
  OrderController.updatePaymentStatusOrder
);
order.delete(
  "/:id",
  authentication,
  authorization,
  OrderController.deleteOrder
);

export default order;
