const express = require("express");

const padService = require("../services/pad.service");

const Router = express.Router();

Router.post("/", padService.createPad);
Router.get("/", padService.getAllDetailPad);
Router.get("/true", padService.getAllDetailPadTrue);
Router.get("/detail", padService.getDetailPad);
Router.post("/update", padService.updatePad);
Router.get("/delete", padService.deletePad);

module.exports = Router;
