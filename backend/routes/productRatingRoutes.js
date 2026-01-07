const express = require("express");
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const ProductRating = require("../models/ProductRating");
const Product = require("../models/Product");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

ProductRating.belongsTo(User, { foreignKey: "userId", as: "User" });
ProductRating.belongsTo(Product, { foreignKey: "productId", as: "Product" });

async function updateProductRating(productId) {
  const ratings = await ProductRating.findAll({
    where: { productId },
    attributes: [
      [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
      [sequelize.fn("COUNT", sequelize.col("id")), "count"]
    ],
    raw: true
  });

  const avgRating = parseFloat(ratings[0]?.avgRating || 0);
  const reviewCount = parseInt(ratings[0]?.count || 0);

  await Product.update(
    { rating: avgRating, reviewCount },
    { where: { id: productId } }
  );

  return { rating: avgRating, reviewCount };
}

router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const ratings = await ProductRating.findAll({
      where: { productId },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "email"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(ratings);
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    res.status(500).json({ error: "Failed to fetch product ratings" });
  }
});

router.post("/product/:productId", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingRating = await ProductRating.findOne({
      where: { productId, userId }
    });

    let productRating;
    if (existingRating) {
      await existingRating.update({ rating, comment });
      productRating = existingRating;
    } else {
      productRating = await ProductRating.create({
        rating,
        comment: comment || null,
        userId,
        productId
      });
    }

    const updatedStats = await updateProductRating(productId);

    res.status(201).json({
      ...productRating.toJSON(),
      product: {
        rating: updatedStats.rating,
        reviewCount: updatedStats.reviewCount
      }
    });
  } catch (error) {
    console.error("Error creating product rating:", error);
    res.status(500).json({ error: "Failed to create product rating" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const rating = await ProductRating.findByPk(req.params.id);
    if (!rating) {
      return res.status(404).json({ error: "Rating not found" });
    }

    if (rating.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const productId = rating.productId;
    await rating.destroy();
    await updateProductRating(productId);

    res.json({ message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error deleting product rating:", error);
    res.status(500).json({ error: "Failed to delete product rating" });
  }
});

module.exports = router;

