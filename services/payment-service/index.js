import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import payment from "./routes/payment.route.js";
import { createChannel } from "./config/messageQueue.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.json());
app.use("/", payment);

app.listen(port, async () => {
  createChannel("emailQueue");
  console.log(`Payment service listening on port ${port}! `);
});
