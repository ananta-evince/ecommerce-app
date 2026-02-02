const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const sequelize = require("./config/database");

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/addresses", require("./routes/addressRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/product-ratings", require("./routes/productRatingRoutes"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));

sequelize
  .sync({ alter: true })
  .then(() => console.log("MySQL Connected via phpMyAdmin"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
