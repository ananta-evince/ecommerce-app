const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { authenticateToken, adminOnly } = require("../middleware/authMiddleware");

router.get("/stats", authenticateToken, adminOnly, async (req, res) => {
  try {
    const [userCount, productCount, orderCount, orders] = await Promise.all([
      User.count(),
      Product.count(),
      Order.count(),
      Order.findAll({
        attributes: ["totalAmount", "orderStatus", "createdAt", "paymentStatus"],
        order: [["createdAt", "DESC"]],
      }),
    ]);

    const totalRevenue = orders
      .filter(o => o.paymentStatus === "completed")
      .reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0);

    const statusCounts = {};
    orders.forEach(o => {
      statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1;
    });

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    last30Days.setHours(0, 0, 0, 0);
    const revenueByDay = {};
    const ordersByDay = {};
    for (let i = 0; i <= 30; i++) {
      const d = new Date(last30Days);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      revenueByDay[key] = 0;
      ordersByDay[key] = 0;
    }
    orders
      .filter(o => new Date(o.createdAt) >= last30Days && o.paymentStatus === "completed")
      .forEach(o => {
        const d = new Date(o.createdAt).toISOString().slice(0, 10);
        if (revenueByDay[d] !== undefined) revenueByDay[d] += parseFloat(o.totalAmount || 0);
      });
    orders
      .filter(o => new Date(o.createdAt) >= last30Days)
      .forEach(o => {
        const d = new Date(o.createdAt).toISOString().slice(0, 10);
        if (ordersByDay[d] !== undefined) ordersByDay[d] += 1;
      });
    const revenueChart = Object.entries(revenueByDay)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, amount]) => ({ date, amount }));
    const ordersChart = Object.entries(ordersByDay)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));

    res.json({
      userCount,
      productCount,
      orderCount,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      orderStatusCounts: statusCounts,
      revenueChart,
      ordersChart,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Error fetching stats" });
  }
});

router.get("/orders", authenticateToken, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const where = {};
    if (status && status !== "all") where.orderStatus = status;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;
    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: limitNum,
      offset,
    });
    const userIds = [...new Set(orders.map(o => o.userId))];
    const users = userIds.length
      ? await User.findAll({ where: { id: userIds }, attributes: ["id", "name", "email"] })
      : [];
    const userMap = Object.fromEntries(users.map(u => [u.id, u]));
    const ordersWithUser = orders.map(o => ({
      ...o.toJSON(),
      User: userMap[o.userId] || null,
    }));
    res.json({
      orders: ordersWithUser,
      total: count,
      page: pageNum,
      totalPages: Math.ceil(count / limitNum) || 1,
    });
  } catch (error) {
    console.error("Admin orders error:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

router.put("/orders/:id/status", authenticateToken, adminOnly, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const updates = {};
    if (orderStatus) updates.orderStatus = orderStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    await order.update(updates);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error updating order" });
  }
});

router.get("/products", authenticateToken, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, brand, status } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;
    const where = {};
    if (search && String(search).trim()) {
      where[Op.or] = [
        { name: { [Op.like]: `%${String(search).trim()}%` } },
        { description: { [Op.like]: `%${String(search).trim()}%` } },
      ];
    }
    if (category && String(category).trim()) where.category = String(category).trim();
    if (brand && String(brand).trim()) where.brand = String(brand).trim();
    if (status === "active") where.isActive = true;
    if (status === "inactive") where.isActive = false;
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: limitNum,
      offset,
    });
    res.json({
      products,
      total: count,
      page: pageNum,
      totalPages: Math.ceil(count / limitNum) || 1,
    });
  } catch (error) {
    console.error("Admin products error:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

router.get("/users", authenticateToken, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;
    const { count, rows: users } = await User.findAndCountAll({
      attributes: ["id", "name", "email", "role", "createdAt"],
      order: [["id", "DESC"]],
      limit: limitNum,
      offset,
    });
    res.json({
      users,
      total: count,
      page: pageNum,
      totalPages: Math.ceil(count / limitNum) || 1,
    });
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
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.update({ role });
    res.json({
      message: "User role updated successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating user role" });
  }
});

router.delete("/users/:id", authenticateToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ error: "Cannot delete admin user" });
    }
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

module.exports = router;
