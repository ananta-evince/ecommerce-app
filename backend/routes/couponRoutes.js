const express = require("express");
const Coupon = require("../models/Coupon");
const Order = require("../models/Order");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/validate", authenticateToken, async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({
      where: {
        code: code.toUpperCase().trim(),
        isActive: true,
      },
    });

    if (!coupon) {
      return res.status(404).json({ error: "Invalid coupon code" });
    }

    const now = new Date();
    if (new Date(coupon.validFrom) > now) {
      return res.status(400).json({ error: "Coupon is not yet valid" });
    }

    if (new Date(coupon.validUntil) < now) {
      return res.status(400).json({ error: "Coupon has expired" });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: "Coupon usage limit reached" });
    }

    if (subtotal && subtotal < coupon.minPurchaseAmount) {
      return res.status(400).json({
        error: `Minimum purchase amount of ₹${coupon.minPurchaseAmount} required`,
      });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (subtotal || 0) * (coupon.discountValue / 100);
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
      if (discount > (subtotal || 0)) {
        discount = subtotal || 0;
      }
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscountAmount: coupon.maxDiscountAmount,
      },
      discount: Math.round(discount * 100) / 100,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ error: "Error validating coupon" });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
    });
    res.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ error: "Error fetching coupons" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      usageLimit,
      validFrom,
      validUntil,
      applicableTo,
    } = req.body;

    if (!code || !discountValue || !validUntil) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      description,
      discountType: discountType || "percentage",
      discountValue,
      minPurchaseAmount: minPurchaseAmount || 0,
      maxDiscountAmount,
      usageLimit,
      validFrom: validFrom || new Date(),
      validUntil,
      applicableTo: applicableTo || "all",
      isActive: true,
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.error("Error creating coupon:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Coupon code already exists" });
    }
    res.status(500).json({ error: "Error creating coupon" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    const updateData = { ...req.body };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase().trim();
    }

    await coupon.update(updateData);
    res.json(coupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ error: "Error updating coupon" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    await coupon.update({ isActive: false });
    res.json({ message: "Coupon deactivated successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ error: "Error deleting coupon" });
  }
});

router.post("/:code/use", authenticateToken, async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      where: { code: req.params.code.toUpperCase() },
    });

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    await coupon.update({ usedCount: coupon.usedCount + 1 });
    res.json({ message: "Coupon usage recorded" });
  } catch (error) {
    console.error("Error recording coupon usage:", error);
    res.status(500).json({ error: "Error recording coupon usage" });
  }
});

module.exports = router;

