const express = require("express");
const NewsletterSubscriber = require("../models/NewsletterSubscriber");
const { authenticateToken, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    const [subscriber, created] = await NewsletterSubscriber.findOrCreate({
      where: { email: email.toLowerCase().trim() },
      defaults: {
        email: email.toLowerCase().trim(),
        isActive: true
      }
    });

    if (!created && subscriber.isActive) {
      return res.status(200).json({ 
        message: "You are already subscribed to our newsletter!",
        alreadySubscribed: true
      });
    }

    if (!created && !subscriber.isActive) {
      await subscriber.update({ isActive: true, subscribedAt: new Date() });
      return res.status(200).json({ 
        message: "Welcome back! You have been resubscribed to our newsletter.",
        resubscribed: true
      });
    }

    res.status(201).json({ 
      message: "Thank you for subscribing to our newsletter!",
      subscriber: {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt
      }
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(200).json({ 
        message: "You are already subscribed to our newsletter!",
        alreadySubscribed: true
      });
    }
    res.status(500).json({ error: "Failed to subscribe. Please try again later." });
  }
});

router.post("/unsubscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const subscriber = await NewsletterSubscriber.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    if (!subscriber) {
      return res.status(404).json({ error: "Email not found in our subscription list" });
    }

    if (!subscriber.isActive) {
      return res.status(200).json({ message: "You are already unsubscribed." });
    }

    await subscriber.update({ isActive: false });

    res.status(200).json({ message: "You have been unsubscribed from our newsletter." });
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    res.status(500).json({ error: "Failed to unsubscribe. Please try again later." });
  }
});

router.get("/subscribers", authenticateToken, adminOnly, async (req, res) => {
  try {
    const { active, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (active !== undefined) {
      where.isActive = active === "true";
    }

    const { count, rows } = await NewsletterSubscriber.findAndCountAll({
      where,
      order: [["subscribedAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      subscribers: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
});

router.get("/stats", authenticateToken, adminOnly, async (req, res) => {
  try {
    const total = await NewsletterSubscriber.count();
    const active = await NewsletterSubscriber.count({ where: { isActive: true } });
    const inactive = total - active;

    res.json({
      total,
      active,
      inactive
    });
  } catch (error) {
    console.error("Error fetching newsletter stats:", error);
    res.status(500).json({ error: "Failed to fetch newsletter stats" });
  }
});

module.exports = router;

