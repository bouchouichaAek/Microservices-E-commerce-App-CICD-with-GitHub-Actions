import express from "express";
import dotenv from "dotenv";
import { createChannel } from "./config/messageQueue.js";
import { receiveEmailQueue } from "./utils/handleQueues.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, async () => {
  await createChannel("emailQueue");
  await receiveEmailQueue();
  console.log(
    `Notifications service listening on port ${port}! Ready to receive Notification.`
  );
});
