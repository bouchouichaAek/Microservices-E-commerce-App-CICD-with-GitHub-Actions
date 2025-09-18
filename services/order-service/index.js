import sequelize from "./config/database.js";
import express from "express";

import dotenv from "dotenv";
import Order from "./models/order.model.js";
import OrderItem from "./models/orderItem.model.js";
import order from "./routes/order.route.js";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/", order);

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  await Order.sync();
  await OrderItem.sync();

  console.log(
    "The table for the Order model was just (re)created! Successfully"
  );

  console.log(`Order service listening on port ${port}!`);
});
