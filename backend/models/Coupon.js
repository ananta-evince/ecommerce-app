const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Coupon = sequelize.define("Coupon", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isUppercase: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  discountType: {
    type: DataTypes.ENUM("percentage", "fixed"),
    allowNull: false,
    defaultValue: "percentage",
  },
  discountValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  minPurchaseAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  maxDiscountAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  applicableTo: {
    type: DataTypes.ENUM("all", "new_users", "existing_users"),
    defaultValue: "all",
  },
}, {
  tableName: "coupons",
});

module.exports = Coupon;

