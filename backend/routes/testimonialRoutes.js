const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");

router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
      limit: 10
    });
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { rating, text, author, role } = req.body;
    
    if (!rating || !text || !author) {
      return res.status(400).json({ error: "Rating, text, and author are required" });
    }

    const testimonial = await Testimonial.create({
      rating,
      text,
      author,
      role: role || "Verified Customer"
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});

module.exports = router;

