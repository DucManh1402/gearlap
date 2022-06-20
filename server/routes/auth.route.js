const express = require("express");

const authService = require("../services/auth.service");
const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post("/login", authService.login);
Router.post("/login-gg", authMiddleware.verifyGG, authService.loginGG);
Router.post("/login-fb", authMiddleware.verifyFB, authService.loginFB);
Router.get("/logout", authService.logout);

module.exports = Router;
