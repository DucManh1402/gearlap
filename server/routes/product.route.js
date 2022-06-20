const express = require("express");

const productService = require("../services/product.service");

const Router = express.Router();

Router.post("/", productService.createProduct);
Router.get("/", productService.getAllDetailProduct);
Router.get("/true", productService.getAllDetailProductTrue);
Router.get("/detail", productService.getDetailProduct);
Router.post("/update", productService.updateProduct);
Router.get("/delete", productService.deleteProduct);
Router.get("/best", productService.getBestProducts);
Router.get("/sort", productService.sortProducts);
Router.get("/filter", productService.filterProducts);
Router.get("/all-detail", productService.getAllDetailOneProduct);
Router.get("/all", productService.getAllProduct);
Router.get("/all-type", productService.getAllProductByType);

module.exports = Router;
