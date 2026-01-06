require("dotenv").config();
const sequelize = require("../config/database");
const Coupon = require("../models/Coupon");

const coupons = [
  {
    code: "WELCOME10",
    description: "Welcome discount - 10% off on your first order",
    discountType: "percentage",
    discountValue: 10,
    minPurchaseAmount: 500,
    maxDiscountAmount: 500,
    usageLimit: 1000,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    applicableTo: "new_users",
    isActive: true,
  },
  {
    code: "SAVE10",
    description: "Save 10% on orders above ₹1000",
    discountType: "percentage",
    discountValue: 10,
    minPurchaseAmount: 1000,
    maxDiscountAmount: 1000,
    usageLimit: 500,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
    applicableTo: "all",
    isActive: true,
  },
  {
    code: "FLAT500",
    description: "Flat ₹500 off on orders above ₹2000",
    discountType: "fixed",
    discountValue: 500,
    minPurchaseAmount: 2000,
    usageLimit: 200,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months from now
    applicableTo: "all",
    isActive: true,
  },
  {
    code: "SUMMER20",
    description: "Summer sale - 20% off",
    discountType: "percentage",
    discountValue: 20,
    minPurchaseAmount: 1500,
    maxDiscountAmount: 2000,
    usageLimit: 300,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 2 months from now
    applicableTo: "all",
    isActive: true,
  },
];

async function seedCoupons() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await sequelize.sync({ alter: true });
    console.log("Database synced.");

    for (const couponData of coupons) {
      const [coupon, created] = await Coupon.findOrCreate({
        where: { code: couponData.code },
        defaults: couponData,
      });

      if (created) {
        console.log(`✓ Created coupon: ${coupon.code}`);
      } else {
        console.log(`- Coupon already exists: ${coupon.code}`);
      }
    }

    console.log("\nCoupon seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding coupons:", error);
    process.exit(1);
  }
}

seedCoupons();

