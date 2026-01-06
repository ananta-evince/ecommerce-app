const express = require("express");
const Contact = require("../models/Contact");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'new'
    });

    res.status(201).json({ 
      success: true, 
      message: "Thank you for contacting us. We'll get back to you soon!",
      contactId: contact.id
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ 
        error: "Validation error", 
        details: error.errors.map(e => e.message).join(", ")
      });
    }
    res.status(500).json({ error: "Failed to process contact form. Please try again later." });
  }
});

module.exports = router;

