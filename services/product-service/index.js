import sequelize from "./config/database.js";
import express from "express";

import dotenv from "dotenv";

import product from "./routes/product.route.js";
import Product from "./models/product.model.js"; // Assuming you have a Product model defined

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/", product);

app.use("/uploads/products", express.static("uploads/products"));

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  await Product.sync();
  console.log(
    "The table for the Product model was just (re)created! Successfully"
  );

  console.log(`Product service listening on port ${port}!`);
});
