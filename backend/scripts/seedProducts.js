require("dotenv").config();
const sequelize = require("../config/database");
const Product = require("../models/Product");

const products = [
  // Men's Products
  {
    name: "Men's Formal Shirt",
    price: 1299,
    originalPrice: 1999,
    description: "Premium cotton formal shirt, perfect fit, wrinkle-free, suitable for office and formal occasions.",
    image: "https://images.unsplash.com/photo-1594938291221-94f18dd6d3b7?w=500",
    images: [
      "https://images.unsplash.com/photo-1594938291221-94f18dd6d3b7?w=500",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500"
    ],
    category: "men",
    brand: "Fashion Brand",
    stock: 50,
    variants: {
      size: ["S", "M", "L", "XL", "XXL"],
      color: ["White", "Light Blue", "Navy Blue", "Gray"]
    },
    rating: 4.5,
    reviewCount: 320,
    isActive: true
  },
  {
    name: "Men's Denim Pants",
    price: 1999,
    originalPrice: 2999,
    description: "Classic fit denim jeans, 100% cotton, comfortable stretch, perfect for casual wear.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"
    ],
    category: "men",
    brand: "Denim Co",
    stock: 45,
    variants: {
      size: ["28", "30", "32", "34", "36", "38"],
      color: ["Dark Blue", "Light Blue", "Black"]
    },
    rating: 4.6,
    reviewCount: 450,
    isActive: true
  },
  {
    name: "Men's Casual Shirt",
    price: 999,
    originalPrice: 1499,
    description: "Comfortable casual shirt, breathable fabric, relaxed fit, perfect for everyday wear.",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500"
    ],
    category: "men",
    brand: "Casual Wear",
    stock: 60,
    variants: {
      size: ["S", "M", "L", "XL", "XXL"],
      color: ["White", "Black", "Navy", "Gray", "Red"]
    },
    rating: 4.4,
    reviewCount: 280,
    isActive: true
  },
  {
    name: "Men's Cap",
    price: 499,
    originalPrice: 799,
    description: "Stylish baseball cap, adjustable strap, breathable fabric, perfect for outdoor activities.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500"
    ],
    category: "men",
    brand: "Sport Cap",
    stock: 80,
    variants: {
      color: ["Black", "Navy", "Gray", "Red", "White"]
    },
    rating: 4.3,
    reviewCount: 150,
    isActive: true
  },
  {
    name: "Men's Leather Boots",
    price: 3999,
    originalPrice: 5999,
    description: "Premium leather boots, durable sole, comfortable fit, perfect for formal and casual occasions.",
    image: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=500",
    images: [
      "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=500"
    ],
    category: "men",
    brand: "Leather Craft",
    stock: 30,
    variants: {
      size: ["7", "8", "9", "10", "11", "12"],
      color: ["Brown", "Black", "Tan"]
    },
    rating: 4.7,
    reviewCount: 180,
    isActive: true
  },
  {
    name: "Men's Chinos Pants",
    price: 1499,
    originalPrice: 2299,
    description: "Classic chinos pants, comfortable fit, wrinkle-resistant, perfect for smart casual look.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500"
    ],
    category: "men",
    brand: "Smart Wear",
    stock: 40,
    variants: {
      size: ["28", "30", "32", "34", "36"],
      color: ["Khaki", "Navy", "Gray", "Beige"]
    },
    rating: 4.5,
    reviewCount: 220,
    isActive: true
  },

  // Women's/Girls Products
  {
    name: "Women's Floral Dress",
    price: 2499,
    originalPrice: 3999,
    description: "Beautiful floral print dress, comfortable fit, perfect for parties and casual outings.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"
    ],
    category: "girls",
    brand: "Fashion Dress",
    stock: 35,
    variants: {
      size: ["XS", "S", "M", "L", "XL"],
      color: ["Floral Blue", "Floral Pink", "Floral Red"]
    },
    rating: 4.6,
    reviewCount: 420,
    isActive: true
  },
  {
    name: "Women's Skinny Jeans",
    price: 1799,
    originalPrice: 2799,
    description: "Stylish skinny fit jeans, stretchable fabric, comfortable fit, perfect for casual wear.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"
    ],
    category: "girls",
    brand: "Denim Style",
    stock: 50,
    variants: {
      size: ["24", "26", "28", "30", "32"],
      color: ["Dark Blue", "Light Blue", "Black"]
    },
    rating: 4.5,
    reviewCount: 380,
    isActive: true
  },
  {
    name: "Women's Casual Shirt",
    price: 1199,
    originalPrice: 1899,
    description: "Comfortable casual shirt, soft fabric, relaxed fit, perfect for everyday wear.",
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500",
    images: [
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500"
    ],
    category: "girls",
    brand: "Casual Chic",
    stock: 55,
    variants: {
      size: ["XS", "S", "M", "L", "XL"],
      color: ["White", "Pink", "Blue", "Gray", "Black"]
    },
    rating: 4.4,
    reviewCount: 290,
    isActive: true
  },
  {
    name: "Women's Summer Dress",
    price: 1999,
    originalPrice: 2999,
    description: "Lightweight summer dress, breathable fabric, flowy design, perfect for hot weather.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"
    ],
    category: "girls",
    brand: "Summer Style",
    stock: 42,
    variants: {
      size: ["XS", "S", "M", "L", "XL"],
      color: ["Yellow", "Pink", "Blue", "White", "Green"]
    },
    rating: 4.7,
    reviewCount: 510,
    isActive: true
  },
  {
    name: "Women's Cap",
    price: 599,
    originalPrice: 899,
    description: "Stylish women's cap, adjustable fit, trendy design, perfect for outdoor activities.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500"
    ],
    category: "girls",
    brand: "Fashion Cap",
    stock: 70,
    variants: {
      color: ["Pink", "White", "Black", "Navy", "Beige"]
    },
    rating: 4.3,
    reviewCount: 140,
    isActive: true
  },
  {
    name: "Women's Ankle Boots",
    price: 3499,
    originalPrice: 4999,
    description: "Stylish ankle boots, comfortable heel, premium material, perfect for casual and semi-formal wear.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500"
    ],
    category: "girls",
    brand: "Boot Style",
    stock: 28,
    variants: {
      size: ["5", "6", "7", "8", "9", "10"],
      color: ["Black", "Brown", "Tan", "Gray"]
    },
    rating: 4.6,
    reviewCount: 250,
    isActive: true
  },
  {
    name: "Women's Maxi Dress",
    price: 2799,
    originalPrice: 3999,
    description: "Elegant maxi dress, flowing design, comfortable fabric, perfect for parties and special occasions.",
    image: "https://images.unsplash.com/photo-1566479179817-278b0b8f0e4e?w=500",
    images: [
      "https://images.unsplash.com/photo-1566479179817-278b0b8f0e4e?w=500"
    ],
    category: "girls",
    brand: "Elegant Wear",
    stock: 30,
    variants: {
      size: ["XS", "S", "M", "L", "XL"],
      color: ["Navy", "Black", "Red", "Purple"]
    },
    rating: 4.8,
    reviewCount: 380,
    isActive: true
  },

  // Kids Products
  {
    name: "Kids T-Shirt",
    price: 499,
    originalPrice: 799,
    description: "Comfortable kids t-shirt, soft cotton fabric, fun designs, perfect for daily wear.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500"
    ],
    category: "kids",
    brand: "Kids Wear",
    stock: 100,
    variants: {
      size: ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y"],
      color: ["Blue", "Red", "Yellow", "Green", "Pink", "White"]
    },
    rating: 4.5,
    reviewCount: 180,
    isActive: true
  },
  {
    name: "Kids Denim Pants",
    price: 999,
    originalPrice: 1499,
    description: "Durable kids jeans, comfortable fit, stretchable fabric, perfect for active kids.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500"
    ],
    category: "kids",
    brand: "Kids Denim",
    stock: 80,
    variants: {
      size: ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y"],
      color: ["Dark Blue", "Light Blue", "Black"]
    },
    rating: 4.4,
    reviewCount: 150,
    isActive: true
  },
  {
    name: "Kids Dress",
    price: 1299,
    originalPrice: 1999,
    description: "Cute kids dress, comfortable fabric, colorful designs, perfect for parties and special occasions.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500"
    ],
    category: "kids",
    brand: "Kids Fashion",
    stock: 60,
    variants: {
      size: ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y"],
      color: ["Pink", "Blue", "Yellow", "Red", "Purple"]
    },
    rating: 4.6,
    reviewCount: 200,
    isActive: true
  },
  {
    name: "Kids Cap",
    price: 299,
    originalPrice: 499,
    description: "Fun kids cap, adjustable strap, colorful designs, perfect for outdoor play.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500"
    ],
    category: "kids",
    brand: "Kids Cap",
    stock: 120,
    variants: {
      color: ["Red", "Blue", "Yellow", "Green", "Pink", "Black"]
    },
    rating: 4.3,
    reviewCount: 120,
    isActive: true
  },
  {
    name: "Kids Boots",
    price: 1499,
    originalPrice: 2299,
    description: "Comfortable kids boots, durable sole, easy to wear, perfect for school and outdoor activities.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    ],
    category: "kids",
    brand: "Kids Footwear",
    stock: 50,
    variants: {
      size: ["10", "11", "12", "13", "1", "2", "3"],
      color: ["Black", "Brown", "Blue", "Pink"]
    },
    rating: 4.5,
    reviewCount: 160,
    isActive: true
  },
  {
    name: "Kids Shirt",
    price: 599,
    originalPrice: 999,
    description: "Comfortable kids shirt, soft fabric, fun prints, perfect for school and casual wear.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500"
    ],
    category: "kids",
    brand: "Kids Shirt",
    stock: 90,
    variants: {
      size: ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y"],
      color: ["White", "Blue", "Red", "Yellow", "Green"]
    },
    rating: 4.4,
    reviewCount: 170,
    isActive: true
  }
];

async function seedProducts() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await Product.sync({ alter: true });
    console.log("Product model synchronized.");

    // Clear existing products (optional - comment out if you want to keep existing)
    await Product.destroy({ where: {} });
    console.log("Cleared existing products.");

    // Add products
    for (const productData of products) {
      const product = await Product.create(productData);
      console.log(`✓ Created product: ${productData.name}`);
    }

    console.log("\n✅ Product seeding completed!");
    console.log(`Total products in database: ${await Product.count()}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
