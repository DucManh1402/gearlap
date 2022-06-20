const express = require("express");

const paymentService = require("../services/payment.service");

const Router = express.Router();

Router.post("/momo", paymentService.createPayment);
Router.post("/momo/transaction", paymentService.getTransaction);
Router.post("/ship/fee", paymentService.calcShipmentFee);
Router.get("/momo/query", paymentService.checkTransaction);

module.exports = Router;
