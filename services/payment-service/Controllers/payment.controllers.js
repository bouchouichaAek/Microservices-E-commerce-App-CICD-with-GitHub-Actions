import dotenv from "dotenv";
import customResourceResponse from "../utils/constant.js";
import crypto from "crypto";
import { sendEmailQueue } from "../utils/handleQueues.js";
dotenv.config();

class PaymentController {
  static async createPayment(req, res) {
    const { amount } = req.body;
    const option = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHARGILY_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: `{"amount":${amount},"currency":"dzd","success_url":"https://my-app.com/payments/success"}`,
    };

    try {
      const response = await fetch(process.env.CHECKOUT_URL, option);
      const data = await response.json();
      res.status(200).json({ ...customResourceResponse.success, data: data });
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async webhookPayment(req, res) {
    // Extracting the 'signature' header from the HTTP request
    const signature = req.get("signature");

    // Getting the raw payload from the request body
    // const payload = JSON.stringify(req.body);
    const payload = req.rawBody;

    // If there is no signature, ignore the request
    if (!signature) {
      return res.sendStatus(400);
    }

    // Calculate the signature
    const computedSignature = crypto
      .createHmac("sha256", process.env.CHARGILY_API_SECRET)
      .update(payload)
      .digest("hex");

    // If the calculated signature doesn't match the received signature, ignore the request
    if (computedSignature !== signature) {
      return res.sendStatus(403);
    }

    // If the signatures match, proceed to decode the JSON payload
    const event = req.body;
    console.log(event);

    // Switch based on the event type
    switch (event.type) {
      case "checkout.paid":
        const checkout = event.data;
        var updateData = {
          paymentStatus: "completed",
        };

        // Here you can update the order status in your database
        var response = await fetch(
          `http://${process.env.ORDER_SERVICE}/${checkout.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              // "x-auth-token": "your-auth-token", // إن كنت تستخدم JWT
            },
            body: JSON.stringify(updateData),
          }
        );

        var data = await response.json();

        const payloadPaid = data ? JSON.stringify(data) : "{}";

        await sendEmailQueue(payloadPaid);

        // Handle the successful payment.
        break;

      case "checkout.failed":
        const failedCheckout = event.data;
        var updateData = {
          paymentStatus: "failed",
        };

        // Here you can update the order status in your database
        var response = await fetch(
          `http://${process.env.ORDER_SERVICE}/${failedCheckout.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              // "x-auth-token": "your-auth-token", // إن كنت تستخدم JWT
            },
            body: JSON.stringify(updateData),
          }
        );
        var data = await response.json();

        const payloadFailed = data ? JSON.stringify(data) : "{}";

        await sendEmail(payloadFailed);

        // Handle the failed payment.
        break;
    }

    // Respond with a 200 OK status code to let us know that you've received the webhook
    res.sendStatus(200);
  }
}

export default PaymentController;
