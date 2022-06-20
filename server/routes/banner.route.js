const express = require("express");

const bannerService = require("../services/banner.service");

const Router = express.Router();

Router.post("/", bannerService.createBanner);
Router.get("/", bannerService.getAllBanner);
Router.post("/update", bannerService.updateBanner);
Router.get("/detail", bannerService.getDetailBanner);
Router.get("/true", bannerService.getAllBannersStatusTrue);
Router.get("/delete", bannerService.deleteBanner);

module.exports = Router;
