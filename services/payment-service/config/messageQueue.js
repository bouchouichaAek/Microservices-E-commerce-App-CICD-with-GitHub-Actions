import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

async function connectToRabbitMQ() {
  try {
    const connection = await amqplib.connect({
      protocol: process.env.RABBITMQ_PROTOCOL,
      hostname: process.env.RABBITMQ_HOST,
      port: process.env.RABBITMQ_PORT,
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD,
    });
    console.log("✅ Connected to RabbitMQ");
    return connection;
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function createChannel(queueName) {
  try {
    const connection = await connectToRabbitMQ();
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, {
      durable: true,
    });
    return channel;
  } catch (error) {
    console.error("❌ Error while creating channel:", error);
  }
}

export { connectToRabbitMQ, createChannel };
