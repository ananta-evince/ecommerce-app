const express = require("express");
const Address = require("../models/Address");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.user.id },
      order: [["isDefault", "DESC"]],
    });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching addresses" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    if (req.body.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId: req.user.id } }
      );
    }
    const address = await Address.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ error: "Error creating address" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const address = await Address.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    if (req.body.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId: req.user.id } }
      );
    }
    await address.update(req.body);
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: "Error updating address" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Address.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (deleted) {
      res.json({ message: "Address deleted" });
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting address" });
  }
});

module.exports = router;

