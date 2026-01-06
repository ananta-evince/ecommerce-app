const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    let subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    let tax = subtotal * 0.18;
    let shipping = subtotal > 1000 ? 0 : 50;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        where: {
          code: couponCode.toUpperCase().trim(),
          isActive: true,
        },
      });

      if (coupon) {
        const now = new Date();
        const isValid = 
          new Date(coupon.validFrom) <= now &&
          new Date(coupon.validUntil) >= now &&
          (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
          subtotal >= coupon.minPurchaseAmount;

        if (isValid) {
          if (coupon.discountType === "percentage") {
            discount = subtotal * (coupon.discountValue / 100);
            if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
              discount = coupon.maxDiscountAmount;
            }
          } else {
            discount = coupon.discountValue;
            if (discount > subtotal) {
              discount = subtotal;
            }
          }
          discount = Math.round(discount * 100) / 100;

          await coupon.update({ usedCount: coupon.usedCount + 1 });
        }
      }
    }

    const totalAmount = subtotal + tax + shipping - discount;

    const order = await Order.create({
      userId: req.user.id,
      items,
      subtotal,
      tax,
      shipping,
      discount,
      totalAmount,
      couponCode,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      orderStatus: "pending",
    });

    for (const item of items) {
      const product = await Product.findByPk(item.id);
      if (product) {
        await product.update({ stock: product.stock - item.quantity });
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error fetching order" });
  }
});

router.put("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.orderStatus === "shipped" || order.orderStatus === "delivered") {
      return res.status(400).json({ error: "Cannot cancel shipped/delivered order" });
    }
    await order.update({ orderStatus: "cancelled" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error cancelling order" });
  }
});

module.exports = router;

