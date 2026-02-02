const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductRating = sequelize.define("ProductRating", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id"
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "products",
      key: "id"
    }
  }
}, {
  tableName: "productratings",
});

module.exports = ProductRating;
