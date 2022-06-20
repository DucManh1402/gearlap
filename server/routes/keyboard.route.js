const express = require("express");

const keyboardService = require("../services/keyboard.service");

const Router = express.Router();

Router.post("/", keyboardService.createKeyboard);
Router.get("/", keyboardService.getAllDetailKeyboard);
Router.get("/true", keyboardService.getAllDetailKeyboardTrue);
Router.get("/detail", keyboardService.getDetailKeyboard);
Router.post("/update", keyboardService.updateKeyboard);
Router.get("/delete", keyboardService.deleteKeyboard);

module.exports = Router;
