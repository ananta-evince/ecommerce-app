require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const sequelize = require("../config/database");
const User = require("../models/User");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@shopswift.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      if (existing.role === "admin") {
        console.log("Admin user already exists:", ADMIN_EMAIL);
        process.exit(0);
        return;
      }
      await existing.update({ role: "admin" });
      console.log("Updated existing user to admin:", ADMIN_EMAIL);
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      });
      console.log("Admin user created:", ADMIN_EMAIL);
    }
    console.log("Login: email =", ADMIN_EMAIL, "| password =", ADMIN_PASSWORD);
    process.exit(0);
  } catch (err) {
    console.error("Seed admin error:", err);
    process.exit(1);
  }
}

seedAdmin();
