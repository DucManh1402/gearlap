const express = require("express");

const productLoveService = require("../services/product_love.service");
const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post(
  "/",
  authMiddleware.authenticateToken,
  productLoveService.createLoveProduct
);
Router.post(
  "/update",
  authMiddleware.authenticateToken,
  productLoveService.updateLoveProduct
);
Router.get("/delete", productLoveService.deleteLoveProduct);
Router.get(
  "/",
  authMiddleware.authenticateToken,
  productLoveService.getAllProductByUser
);
Router.get(
  "/filter",
  authMiddleware.authenticateToken,
  productLoveService.filterProductByUser
);
Router.get("/detail", productLoveService.getDetailLoveProduct);

module.exports = Router;
