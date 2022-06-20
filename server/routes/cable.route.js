const express = require("express");

const cableService = require("../services/cable.service");

const Router = express.Router();

Router.post("/", cableService.createCable);
Router.get("/", cableService.getAllDetailCable);
Router.get("/true", cableService.getAllDetailCableTrue);
Router.get("/detail", cableService.getDetailCable);
Router.post("/update", cableService.updateCable);
Router.get("/delete", cableService.deleteCable);

module.exports = Router;
