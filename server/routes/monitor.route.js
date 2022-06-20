const express = require("express");

const monitorService = require("../services/monitor.service");

const Router = express.Router();

Router.post("/", monitorService.createMonitor);
Router.get("/", monitorService.getAllDetailMonitor);
Router.get("/true", monitorService.getAllDetailMonitorTrue);
Router.get("/detail", monitorService.getDetailMonitor);
Router.post("/update", monitorService.updateMonitor);
Router.get("/delete", monitorService.deleteMonitor);

module.exports = Router;
