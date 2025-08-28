import customResourceResponse from "../utils/constant.js";
import Product from "../models/product.model.js";

class ProductController {
  /**
   * @desc Get all products with pagination and filtering
   * @route GET /api/products
   * @access Public
   */

  static async getAllProducts(req, res) {
    const page = parseInt(req.query.page) || 1; // Page number
    const limit = parseInt(req.query.limit) || 10; // Number of items per page
    const offset = (page - 1) * limit;

    const { search, category } = req.query;
    let where = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (category) {
      where.category = category;
    }

    try {
      const products = await Product.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const totalPages = Math.ceil(products.count / limit);

      res.status(200).json({
        ...customResourceResponse.success,
        pagination: {
          totalItems: products.count,
          totalPages,
          currentPage: page,
        },
        products: products.rows,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json(customResourceResponse.serverError);
    }
  }

  /**
   * @desc Get product by ID
   * @route GET /api/products/:id
   * @access Public
   */

  static async getProductById(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json(customResourceResponse.recordNotFound);
      }

      res.status(200).json({
        ...customResourceResponse.success,
        product,
      });
    } catch (error) {
      res.status(500).json(customResourceResponse.serverError);
    }
  }

  /**
   * @desc Get product by User ID
   * @route GET /api/products/user/:userId
   * @access Private
   */

  static async getProductsByUserId(req, res) {
    const userId = req.params.userId;

    try {
      const products = await Product.findAll({
        where: { add_by_user: userId },
      });

      if (products.length === 0) {
        return res.status(404).json(customResourceResponse.recordNotFound);
      }
      res.status(200).json({
        ...customResourceResponse.success,
        products,
      });
    } catch (error) {
      res.status(500).json(customResourceResponse.serverError);
    }
  }

  /**
   * @desc Create a new product
   * @route POST /api/products
   * @access Private
   */

  static async createProduct(req, res) {
    const { product_name, product_description, product_price, add_by_user } =
      req.body;
    const product_picture = req.file ? req.file.filename : null;
    if (
      !product_name ||
      !product_description ||
      !product_price ||
      !add_by_user
    ) {
      return res.status(400).json({
        ...customResourceResponse.validationError,
        message: "All fields are required",
      });
    }
    try {
      const newProduct = await Product.create({
        product_name,
        product_description,
        product_price,
        product_picture,
        add_by_user,
      });

      res.status(201).json({
        ...customResourceResponse.success,
        data: newProduct,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json(customResourceResponse.serverError);
    }
  }

  /**
   * @desc Update product
   * @route PUT /api/products
   * @access Private
   */

  static async updateProduct(req, res) {
    const { id } = req.params;

    const { product_name, product_description, product_price } = req.body;

    if (!product_name || !product_description || !product_price) {
      return res.status(400).json({
        ...customResourceResponse.validationError,
        message: "All fields are required",
      });
    }

    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json(customResourceResponse.recordNotFound);
      }

      product.product_name = product_name;
      product.product_description = product_description;
      product.product_price = product_price;

      await product.save();

      res.status(200).json({
        ...customResourceResponse.success,
        data: product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(customResourceResponse.serverError);
    }
  }

  /**
   * @desc Delete product
   * @route DELETE /api/products/:id
   * @access Private
   */

  static async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json(customResourceResponse.recordNotFound);
      }

      await product.destroy();
      res.status(200).json(customResourceResponse.success);
    } catch (error) {
      console.log(error);
      res.status(500).json(customResourceResponse.serverError);
    }
  }
}

export default ProductController;
