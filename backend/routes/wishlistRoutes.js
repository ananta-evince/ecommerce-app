const express = require("express");
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: "Product" }],
    });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: "Error fetching wishlist" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const existing = await Wishlist.findOne({
      where: { userId: req.user.id, productId },
    });
    if (existing) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }
    const wishlistItem = await Wishlist.create({
      userId: req.user.id,
      productId,
    });
    res.json(wishlistItem);
  } catch (error) {
    res.status(500).json({ error: "Error adding to wishlist" });
  }
});

router.delete("/:productId", authenticateToken, async (req, res) => {
  try {
    const deleted = await Wishlist.destroy({
      where: { userId: req.user.id, productId: req.params.productId },
    });
    if (deleted) {
      res.json({ message: "Removed from wishlist" });
    } else {
      res.status(404).json({ error: "Item not found in wishlist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error removing from wishlist" });
  }
});

module.exports = router;

