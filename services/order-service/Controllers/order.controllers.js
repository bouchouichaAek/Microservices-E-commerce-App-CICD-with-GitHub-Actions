import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";

import axios from "axios";
import dotenv from "dotenv";

import customResourceResponse from "../utils/constant.js";

dotenv.config();

class OrderController {
  /**
   * @desc Get all orders with pagination and filtering
   * @route GET /api/orders
   * @access Public
   */
  static async getAllOrders(req, res) {
    const page = parseInt(req.query.page) || 1; // رقم الصفحة
    const limit = parseInt(req.query.limit) || 10; // عدد العناصر في الصفحة
    const offset = (page - 1) * limit;

    try {
      const orders = await Order.findAndCountAll({
        include: [OrderItem],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const totalPages = Math.ceil(orders.count / limit);

      res.status(200).json({
        ...customResourceResponse.success,
        pagination: {
          totalItems: orders.count,
          totalPages,
          currentPage: page,
        },
        orders: orders.rows,
      });
    } catch (error) {
      res.status(500).json(customResourceResponse.serverError);
    }
  }
  /**
   * @desc get one order by id
   * @route GET /api/orders/id
   * @access Public
   */

  static async getOrderById(req, res) {
    const orderId = req.params.id;

    try {
      const order = await Order.findByPk(orderId, {
        include: [OrderItem],
      });

      if (!order) {
        return res.status(404).json(customResourceResponse.recordNotFound);
      }

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      res.status(500).json(customResourceResponse.serverError);
    }
  }

  static async getOrderItemsByOrderId(req, res) {
    const { id } = req.params;

    try {
      const items = await OrderItem.findAll({
        where: { orderId: id },
      });

      if (!items || items.length === 0) {
        return res
          .status(404)
          .json({ message: "No order items found for this order." });
      }

      res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching order items:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * @desc Create a new order
   * @route POST /api/orders
   * @access Public
   */

  static async createOrder(req, res) {
    const { userId, status, totalAmount, items, shippingAddress } = req.body;

    const response = await axios.post(
      `http://${process.env.PAYMENT_SERVICE}/create-payment`,
      {
        amount: totalAmount,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CHARGILY_API_SECRET}`,
        },
      }
    );

    try {
      // إنشاء الطلب
      const order = await Order.create({
        userId,
        status,
        totalAmount,
        shippingAddress,
        paymentLink: response.data.data.checkout_url,
        paymentId: response.data.data.id,
      });

      // جلب الأسعار من خدمة المنتجات
      const orderItems = await Promise.all(
        items.map(async (item) => {
          // نداء إلى خدمة المنتجات لجلب السعر
          const response = await axios.get(
            `http://${process.env.PRODUCT_SERVICE}/${item.productId}`
          );
          const product = response.data;

          return {
            orderId: order.id,
            productId: item.productId,
            productName: product.product.product_name, // استخدام الاسم من الخدمة
            quantity: item.quantity,
            price: product.product.product_price, // استخدام السعر من الخدمة
          };
        })
      );

      // حفظ العناصر
      await OrderItem.bulkCreate(orderItems);

      res.status(201).json({ ...customResourceResponse.success, data: order });
    } catch (error) {
      console.error("Create Order Error:", error);
      res
        .status(500)
        .json({ message: "Error creating order", error: error.message });
    }
  }

  /**
   * @desc Update order by ID
   * @route PUT /api/orders/:id
   * @access Public
   */
  static async updateOrder(req, res) {
    const orderId = req.params.id;
    const { status, totalAmount } = req.body;

    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json(customResourceResponse.recordNotFound);
      }

      order.status = status || order.status;
      order.totalAmount = totalAmount || order.totalAmount;

      await order.save();

      res.status(200).json({ ...customResourceResponse.success, data: order });
    } catch (error) {
      console.error("Update Order Error:", error);
      res.status(500).json(customResourceResponse.serverError);
    }
  }

  static async updatePaymentStatusOrder(req, res) {
    const id = req.params.paymentId;

    const { status, totalAmount, paymentStatus } = req.body;

    try {
      const order = await Order.findOne({
        where: { paymentId: id },
      });

      if (!order) {
        return res.status(404).json(customResourceResponse.recordNotFound);
      }

      order.status = status || order.status;
      order.totalAmount = totalAmount || order.totalAmount;
      order.paymentStatus = paymentStatus || order.paymentStatus;

      await order.save();

      res.status(200).json({ ...customResourceResponse.success, data: order });
    } catch (error) {
      console.error("Update Order Error:", error);
      res.status(500).json(customResourceResponse.serverError);
    }
  }

  /**
   * @desc Delete order by ID
   * @route DELETE /api/orders/:id
   * @access Public
   */
  static async deleteOrder(req, res) {
    try {
      const orderId = req.params.id;

      // تحقق من وجود الطلب
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json(customResourceResponse.recordNotFound);
      }

      // حذف عناصر الطلب أولاً
      await OrderItem.destroy({ where: { orderId } });

      // ثم حذف الطلب نفسه
      await Order.destroy({ where: { id: orderId } });

      res.status(200).json(customResourceResponse.success);
    } catch (error) {
      console.error("Delete Order Error:", error);
      res.status(500).json(customResourceResponse.serverError);
    }
  }
}

export default OrderController;
