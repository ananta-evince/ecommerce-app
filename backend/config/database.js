const { Sequelize } = require("sequelize");

function env(key, fallback) {
  const v = process.env[key];
  return (v != null && String(v).trim()) ? String(v).trim() : fallback;
}

const dbName = env("DB_NAME", "ecommerce_db");
const dbUser = env("DB_USER", "root");
const dbPassword = process.env.DB_PASSWORD != null ? String(process.env.DB_PASSWORD) : "";
const dbHost = env("DB_HOST", "localhost");
const dbPort = parseInt(process.env.DB_PORT, 10) || 3306;

const dialectOptions = {};
if (env("DB_SSL", "") === "true") {
  dialectOptions.ssl = { require: true, rejectUnauthorized: false };
}
dialectOptions.connectTimeout = 60000;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false,
  dialectOptions,
  pool: { max: 5, min: 0, acquire: 60000, idle: 10000 },
});

module.exports = sequelize;
