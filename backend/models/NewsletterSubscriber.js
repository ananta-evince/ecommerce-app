const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NewsletterSubscriber = sequelize.define("NewsletterSubscriber", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  subscribedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = NewsletterSubscriber;

