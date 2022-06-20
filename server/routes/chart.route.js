const express = require("express");

const chartService = require("../services/chart.service");

const Router = express.Router();

Router.get("/", chartService.getChart);
Router.get("/detail", chartService.getChartDetail);

module.exports = Router;
