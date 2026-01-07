require("dotenv").config();
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const Product = require("../models/Product");

async function verifyProducts() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.\n");

    const totalProducts = await Product.count();
    const promotionalProducts = await Product.count({ where: { isPromotional: true } });
    const regularProducts = totalProducts - promotionalProducts;

    console.log("📊 Product Statistics:");
    console.log(`Total Products: ${totalProducts}`);
    console.log(`Promotional Products: ${promotionalProducts}`);
    console.log(`Regular Products: ${regularProducts}\n`);

    // Get promotional products
    const promotional = await Product.findAll({
      where: { isPromotional: true },
      attributes: ['id', 'name', 'category', 'image', 'price', 'originalPrice']
    });

    console.log("🎯 Promotional Products (for slider):");
    promotional.forEach((p, i) => {
      const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
      console.log(`${i + 1}. ${p.name} (ID: ${p.id}) - ${p.category} - ${discount}% OFF`);
    });

    // Get products by category
    const byCategory = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
      raw: true
    });

    console.log("\n📁 Products by Category:");
    for (const cat of byCategory) {
      const count = await Product.count({ where: { category: cat.category } });
      console.log(`- ${cat.category}: ${count} products`);
    }

    // Check products with variants
    const allProducts = await Product.findAll({ attributes: ['variants'] });
    const withVariants = allProducts.filter(p => p.variants && Object.keys(p.variants).length > 0).length;

    console.log(`\n✅ Products with variants: ${withVariants}`);
    console.log(`✅ Products without variants: ${totalProducts - withVariants}`);

    // Stock levels
    const lowStock = await Product.count({ where: { stock: { [Op.lt]: 20 } } });
    const mediumStock = await Product.count({ where: { stock: { [Op.between]: [20, 50] } } });
    const highStock = await Product.count({ where: { stock: { [Op.gt]: 50 } } });

    console.log(`\n📦 Stock Levels:`);
    console.log(`- Low stock (<20): ${lowStock}`);
    console.log(`- Medium stock (20-50): ${mediumStock}`);
    console.log(`- High stock (>50): ${highStock}`);

    process.exit(0);
  } catch (error) {
    console.error("Error verifying products:", error);
    process.exit(1);
  }
}

verifyProducts();

