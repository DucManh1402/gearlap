const express = require("express");

const feedbackService = require("../services/feedback.service");
const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post(
  "/",
  authMiddleware.authenticateToken,
  feedbackService.createFeedback
);
Router.get("/", feedbackService.getAllFeedback);
Router.get(
  "/user",
  authMiddleware.authenticateToken,
  feedbackService.getAllUserFeedbackOneProduct
);
Router.post(
  "/update",
  authMiddleware.authenticateToken,
  feedbackService.updateFeedback
);
Router.get("/star", feedbackService.getFeedbackStarProduct);

module.exports = Router;
