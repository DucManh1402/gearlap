const express = require("express");

const adminService = require("../services/admin.service");

const Router = express.Router();

Router.post("/login", adminService.login);

module.exports = Router;
