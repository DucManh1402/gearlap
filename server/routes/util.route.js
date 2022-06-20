const express = require("express");

const utilService = require("../services/util.service");

const Router = express.Router();

Router.get("/port", utilService.getCommunicationPort);
Router.get("/ssd", utilService.getCommunicationSSD);
Router.get("/operator", utilService.getOperatorSystem);
Router.get("/webcam", utilService.getWebcam);
Router.get("/wifi", utilService.getWifi);
Router.get("/brand", utilService.getBrand);

module.exports = Router;
