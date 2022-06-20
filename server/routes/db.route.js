const express = require("express");

const dbService = require("../services/db.service");

const Router = express.Router();

Router.get("/", dbService.interactionDB);

module.exports = Router;
