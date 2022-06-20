const express = require("express");

const ssdService = require("../services/ssd.service");

const Router = express.Router();

Router.post("/", ssdService.createSSD);
Router.get("/", ssdService.getAllDetailSSD);
Router.get("/true", ssdService.getAllDetailSSDTrue);
Router.get("/detail", ssdService.getDetailSSD);
Router.post("/update", ssdService.updateSSD);
Router.get("/delete", ssdService.deleteSSD);

module.exports = Router;
