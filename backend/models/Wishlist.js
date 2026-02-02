const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./Product");

const Wishlist = sequelize.define("Wishlist", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "products",
      key: "id",
    },
  },
}, {
  tableName: "wishlists",
});

Wishlist.belongsTo(Product, { foreignKey: "productId", as: "Product" });

module.exports = Wishlist;
