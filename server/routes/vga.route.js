const express = require("express");

const vgaService = require("../services/vga.service");

const Router = express.Router();

Router.post("/", vgaService.createVGA);
Router.get("/", vgaService.getAllDetailVGA);
Router.get("/true", vgaService.getAllDetailVGATrue);
Router.get("/detail", vgaService.getDetailVGA);
Router.post("/update", vgaService.updateVGA);
Router.get("/delete", vgaService.deleteVGA);

module.exports = Router;
