const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  authenticateToken,
  adminOnly,
} = require("../middleware/authMiddleware");

router.get("/users", authenticateToken, adminOnly, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "createdAt"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.put("/users/:id/role", authenticateToken, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["customer", "admin"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.update({ role });
    res.json({
      message: "User role updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating user role" });
  }
});

router.delete("/users/:id", authenticateToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "admin") {
      return res
        .status(400)
        .json({ error: "Cannot delete admin user" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

module.exports = router;
