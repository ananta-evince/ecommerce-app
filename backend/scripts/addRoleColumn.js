const sequelize = require("../config/database");
const { QueryTypes } = require("sequelize");

async function addRoleColumn() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'Users' 
      AND COLUMN_NAME = 'role'
    `);

    if (results.length === 0) {
      await sequelize.query(`
        ALTER TABLE Users 
        ADD COLUMN role ENUM('customer', 'admin') 
        NOT NULL DEFAULT 'customer'
      `);
      console.log("Role column added successfully!");
    } else {
      console.log("Role column already exists.");
    }

    await sequelize.close();
  } catch (error) {
    console.error("Error adding role column:", error);
    process.exit(1);
  }
}

addRoleColumn();

