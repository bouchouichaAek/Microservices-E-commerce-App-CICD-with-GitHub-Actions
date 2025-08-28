import { createChannel } from "../config/messageQueue.js";
async function sendEmailQueue(payload) {
  const channelName = "emailQueue";
  try {
    const channel = await createChannel(channelName);

    channel.sendToQueue(channelName, Buffer.from(payload));
    console.log(" [x] Sent ");
  } catch (error) {
    console.error("❌ Error while sending to queue:", error);
  }
}

export { sendEmailQueue };
