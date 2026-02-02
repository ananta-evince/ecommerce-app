const { Sequelize } = require("sequelize");

const dbName = process.env.DB_NAME || "ecommerce_db";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD ?? "";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = parseInt(process.env.DB_PORT, 10) || 3306;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? false : false,
  dialectOptions: process.env.DB_SSL === "true" ? { ssl: { require: true } } : {},
  pool: { max: 5, min: 0, acquire: 10000, idle: 10000 },
});

module.exports = sequelize;
