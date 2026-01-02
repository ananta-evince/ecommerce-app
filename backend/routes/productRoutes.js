const express = require("express");
const { Op } = require("sequelize");
const Product = require("../models/Product");
const {
  authenticateToken,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, minRating, search } = req.query;
    const where = { isActive: true };

    if (category && category !== "all") where.category = category;
    if (brand && brand !== "all") where.brand = brand;
    if (minPrice) where.price = { ...where.price, [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
    if (minRating) where.rating = { [Op.gte]: parseFloat(minRating) };
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const products = await Product.findAll({ where });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
});

router.post(
  "/",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Error creating product" });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      await product.update(req.body);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Error updating product" });
    }
  }
);

router.delete(
  "/:id",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      await product.destroy();
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting product" });
    }
  }
);

module.exports = router;
