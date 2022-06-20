const express = require("express");

const orderService = require("../services/order.service");
const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post("/", authMiddleware.getToken, orderService.orderProduct);
Router.post("/update", orderService.updateOrderProduct);
Router.get("/", authMiddleware.authenticateToken, orderService.getAllOrder);
Router.get(
  "/user",
  authMiddleware.authenticateToken,
  orderService.getAllOrderByUser
);
Router.get(
  "/user/date",
  authMiddleware.authenticateToken,
  orderService.getAllOrderByUserDate
);
Router.get(
  "/date",
  authMiddleware.authenticateToken,
  orderService.getAllOrderDate
);
Router.get("/detail", orderService.getDetailOrder);

module.exports = Router;
