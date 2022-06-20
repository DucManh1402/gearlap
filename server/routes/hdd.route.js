const express = require("express");

const hddService = require("../services/hdd.service");

const Router = express.Router();

Router.post("/", hddService.createHDD);
Router.get("/", hddService.getAllDetailHDD);
Router.get("/true", hddService.getAllDetailHDDTrue);
Router.get("/detail", hddService.getDetailHDD);
Router.post("/update", hddService.updateHDD);
Router.get("/delete", hddService.deleteHDD);

module.exports = Router;
