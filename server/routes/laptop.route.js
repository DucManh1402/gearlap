const express = require("express");

const laptopService = require("../services/laptop.service");

const Router = express.Router();

Router.post("/", laptopService.createLaptop);
Router.get("/", laptopService.getAllDetailLaptopTrue);
Router.get("/true", laptopService.getAllDetailLaptopTrue);
Router.get("/detail", laptopService.getDetailLaptop);
Router.post("/update", laptopService.updateLaptop);
Router.get("/delete", laptopService.deleteLaptop);

module.exports = Router;
