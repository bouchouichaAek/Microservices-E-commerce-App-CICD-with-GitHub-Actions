import express from "express";
import ProductController from "../Controllers/product.controllers.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";
import upload from "../middlewares/handleFiles.js";

const product = express.Router();

product.get("/", ProductController.getAllProducts);
product.get("/:id", ProductController.getProductById);
product.get("/user/:userId", ProductController.getProductsByUserId);
product.post(
  "/",
  authentication,
  authorization,
  upload.single("pictures"),
  ProductController.createProduct
);
product.put(
  "/:id",
  authentication,
  authorization,
  ProductController.updateProduct
);
product.delete(
  "/:id",
  authentication,
  authorization,
  ProductController.deleteProduct
);

export default product;
