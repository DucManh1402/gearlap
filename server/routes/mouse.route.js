const express = require("express");

const mouseService = require("../services/mouse.service");

const Router = express.Router();

Router.post("/", mouseService.createMouse);
Router.get("/", mouseService.getAllDetailMouse);
Router.get("/true", mouseService.getAllDetailMouseTrue);
Router.get("/detail", mouseService.getDetailMouse);
Router.post("/update", mouseService.updateMouse);
Router.get("/delete", mouseService.deleteMouse);

module.exports = Router;
