import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "processed",
        "shipped",
        "delivered",
        "cancelled"
      ),
      defaultValue: "pending",
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.STRING(255),
    },
    paymentLink: {
      type: DataTypes.STRING(255),
    },
  },
  {
    timestamps: true,
  }
);

export default Order;
