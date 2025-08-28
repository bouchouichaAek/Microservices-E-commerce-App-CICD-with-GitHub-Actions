import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },
    product_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false,
    },
    product_description: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
    },
    product_price: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
    },
    product_picture: {
      type: DataTypes.STRING, // URL or file path
      allowNull: true,
    },
    add_by_user: {
      type: DataTypes.INTEGER(10), // هذا هو الربط فقط
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Product.belongsTo should be defined outside the model block

export default Product;
