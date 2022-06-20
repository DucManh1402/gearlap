const express = require("express");

const userService = require("../services/user.service");
const authMiddleware = require("../middlewares/auth");
const userMiddleware = require("../middlewares/user");

const Router = express.Router();

Router.post("/sign-up", userService.signUp);
Router.post(
  "/sync-gg",
  authMiddleware.authenticateToken,
  authMiddleware.verifyGG,
  userService.postSyncGoogle
);
Router.post(
  "/sync-fb",
  authMiddleware.authenticateToken,
  authMiddleware.verifyFB,
  userService.postSyncFacebook
);
Router.post(
  "/unsync",
  authMiddleware.authenticateToken,
  userService.postUnsyncFacebookAndGoogle
);
Router.get(
  "/verified-email/*",
  userMiddleware.verifiedEmail,
  userService.postVerifiedAccount
);
Router.post(
  "/update",
  authMiddleware.authenticateToken,
  userService.updateUser
);
Router.post(
  "/update-password",
  authMiddleware.authenticateToken,
  userService.updatePassword
);
Router.get("/me", authMiddleware.authenticateToken, userService.getMe);

module.exports = Router;
