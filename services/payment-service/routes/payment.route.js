import express from "express";
import PaymentController from "../Controllers/payment.controllers.js";

const payment = express.Router();

payment.post("/create-payment", PaymentController.createPayment);
payment.post("/webhook-payment", PaymentController.webhookPayment);

export default payment;
