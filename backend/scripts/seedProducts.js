require("dotenv").config();
const sequelize = require("../config/database");
const Product = require("../models/Product");

const products = [
  // ========== PROMOTIONAL PRODUCTS (for slider) ==========
  {
    name: "Men's Premium Leather Jacket",
    price: 4999,
    originalPrice: 7999,
    description: "Premium genuine leather jacket with quilted lining. Perfect for winter, stylish design, durable construction. Available in multiple sizes and colors.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=1200&h=800&fit=crop"
    ],
    category: "men",
    brand: "Premium Leather",
    stock: 25,
    variants: {
      size: ["S", "M", "L", "XL", "XXL"],
      color: ["Black", "Brown", "Navy", "Gray"]
    },
    rating: 4.8,
    reviewCount: 450,
    isActive: true,
    isPromotional: true
  },
  {
    name: "Women's Designer Evening Gown",
    price: 5999,
    originalPrice: 9999,
    description: "Elegant designer evening gown perfect for special occasions. Flowing fabric, elegant design, available in stunning colors. Make a statement at your next event.",
    image: "https://images.unsplash.com/photo-1566479179817-278b0b8f0e4e?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566479179817-278b0b8f0e4e?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&h=800&fit=crop"
    ],
    category: "girls",
    brand: "Elegant Couture",
    stock: 15,
    variants: {
      size: ["XS", "S", "M", "L", "XL"],
      color: ["Navy", "Black", "Red", "Burgundy", "Emerald"]
    },
    rating: 4.9,
    reviewCount: 320,
    isActive: true,
    isPromotional: true
  },
  {
    name: "Men's Smart Watch Collection",
    price: 2999,
    originalPrice: 4999,
    description: "Feature-rich smartwatch with fitness tracking, notifications, and long battery life. Water-resistant, stylish design, perfect for active lifestyle.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&h=800&fit=crop"
    ],
    category: "men",
    brand: "TechWear",
    stock: 40,
    variants: {
      color: ["Black", "Silver", "Gold", "Blue"],
      strap: ["Leather", "Metal", "Silicone"]
    },
    rating: 4.7,
    reviewCount: 680,
    isActive: true,
    isPromotional: true
  },
  {
    name: "Women's Designer Handbag",
    price: 3999,
    originalPrice: 6999,
    description: "Luxury designer handbag with premium materials. Spacious interior, multiple compartments, elegant design. Perfect for everyday use or special occasions.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&h=800&fit=crop"
    ],
    category: "girls",
    brand: "Luxury Bags",
    stock: 30,
    variants: {
      color: ["Black", "Brown", "Navy", "Beige", "Red"]
    },
    rating: 4.6,
    reviewCount: 420,
    isActive: true,
    isPromotional: true
  },
  {
    name: "Kids Premium School Bag Set",
    price: 1499,
    originalPrice: 2499,
    description: "Durable school bag set with lunch box and water bottle. Ergonomic design, multiple compartments, colorful designs. Perfect for school-going kids.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&h=800&fit=crop"
    ],
    category: "kids",
    brand: "School Essentials",
    stock: 60,
    variants: {
      color: ["Blue", "Pink", "Red", "Green", "Black"],
      size: ["Small", "Medium", "Large"]
    },
    rating: 4.5,
    reviewCount: 280,
    isActive: true,
    isPromotional: true
  },

  // ========== MEN'S PRODUCTS ==========
  {
    name: "Men's Formal Shirt",
    price: 1299,
    originalPrice: 1999,
    description: "Premium cotton formal shirt, perfect fit, wrinkle-free, suitable for office and formal occasions. Made with high-quality fabric that ensures comfort throughout the day.",
    image: "https://images.unsplash.com/photo-1594938291221-94f18dd6d3b7?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594938291221-94f18dd6d3b7?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800&h=800&fit=crop"
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
    isActive: true,
    isPromotional: false
  },
  {
    name: "Men's Denim Jeans",
    price: 1999,
    originalPrice: 2999,
    description: "Classic fit denim jeans, 100% cotton, comfortable stretch, perfect for casual wear. Durable construction, timeless style.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop"
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
    isActive: true,
    isPromotional: false
  },
  {
    name: "Men's Casual Shirt",
    price: 999,
    originalPrice: 1499,
    description: "Comfortable casual shirt, breathable fabric, relaxed fit, perfect for everyday wear. Versatile style for any occasion.",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800&h=800&fit=crop"
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
    isActive: true,
    isPromotional: false
  },
  {
    name: "Men's Sports Cap",
    price: 499,
    originalPrice: 799,
    description: "Stylish baseball cap, adjustable strap, breathable fabric, perfect for outdoor activities. UV protection, comfortable fit.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop"
    ],
    category: "men",
    brand: "Sport Cap",
    stock: 80,
    variants: {
      color: ["Black", "Navy", "Gray", "Red", "White"]
    },
    rating: 4.3,
    reviewCount: 150,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Men's Leather Boots",
    price: 3999,
    originalPrice: 5999,
    description: "Premium leather boots, durable sole, comfortable fit, perfect for formal and casual occasions. Long-lasting quality.",
    image: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop"
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
    isActive: true,
    isPromotional: false
  },
  {
    name: "Men's Chinos Pants",
    price: 1499,
    originalPrice: 2299,
    description: "Classic chinos pants, comfortable fit, wrinkle-resistant, perfect for smart casual look. Versatile and stylish.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop"
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
    isActive: true,
    isPromotional: false
  },
  {
    name: "Men's Polo T-Shirt",
    price: 799,
    originalPrice: 1299,
    description: "Classic polo t-shirt, premium cotton blend, comfortable fit, perfect for casual and semi-formal occasions.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"
    ],
    category: "men",
    brand: "Casual Wear",
    stock: 70,
    variants: {
      size: ["S", "M", "L", "XL", "XXL"],
      color: ["White", "Navy", "Black", "Gray", "Red", "Blue"]
    },
    rating: 4.4,
    reviewCount: 350,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Men's Running Shoes",
    price: 2499,
    originalPrice: 3999,
    description: "High-performance running shoes with cushioned sole, breathable mesh, perfect for jogging and workouts. Lightweight and comfortable.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop"
    ],
    category: "men",
    brand: "SportFit",
    stock: 35,
    variants: {
      size: ["7", "8", "9", "10", "11", "12"],
      color: ["Black", "White", "Blue", "Gray", "Red"]
    },
    rating: 4.6,
    reviewCount: 520,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Men's Winter Sweater",
    price: 1799,
    originalPrice: 2799,
    description: "Warm winter sweater, soft wool blend, comfortable fit, perfect for cold weather. Stylish design, cozy feel.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop"
    ],
    category: "men",
    brand: "Winter Wear",
    stock: 25,
    variants: {
      size: ["S", "M", "L", "XL", "XXL"],
      color: ["Navy", "Gray", "Black", "Brown", "Cream"]
    },
    rating: 4.5,
    reviewCount: 190,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Men's Formal Suit",
    price: 8999,
    originalPrice: 12999,
    description: "Premium formal suit with matching trousers. Perfect tailoring, premium fabric, ideal for business meetings and formal events.",
    image: "https://images.unsplash.com/photo-1594938291221-94f18dd6d3b7?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594938291221-94f18dd6d3b7?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop"
    ],
    category: "men",
    brand: "Formal Attire",
    stock: 15,
    variants: {
      size: ["S", "M", "L", "XL", "XXL"],
      color: ["Navy", "Black", "Gray", "Charcoal"]
    },
    rating: 4.8,
    reviewCount: 120,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Men's Sunglasses",
    price: 1299,
    originalPrice: 1999,
    description: "Stylish sunglasses with UV protection, polarized lenses, durable frame. Perfect for outdoor activities and fashion.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop"
    ],
    category: "men",
    brand: "EyeWear",
    stock: 50,
    variants: {
      color: ["Black", "Brown", "Blue", "Gray"],
      lens: ["Polarized", "Gradient", "Mirror"]
    },
    rating: 4.4,
    reviewCount: 240,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Men's Wallet",
    price: 899,
    originalPrice: 1499,
    description: "Genuine leather wallet with multiple card slots, coin pocket, and ID window. Slim design, premium quality.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop"
    ],
    category: "men",
    brand: "Leather Craft",
    stock: 65,
    variants: {
      color: ["Brown", "Black", "Tan", "Navy"]
    },
    rating: 4.5,
    reviewCount: 180,
    isActive: true,
    isPromotional: false
  },

  // ========== WOMEN'S/GIRLS PRODUCTS ==========
  {
    name: "Women's Floral Dress",
    price: 2499,
    originalPrice: 3999,
    description: "Beautiful floral print dress, comfortable fit, perfect for parties and casual outings. Flowing fabric, elegant design.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566479179817-278b0b8f0e4e?w=800&h=800&fit=crop"
    ],
    category: "girls",
    brand: "Fashion Dress",
    stock: 35,
    variants: {
      size: ["XS", "S", "M", "L", "XL"],
      color: ["Floral Blue", "Floral Pink", "Floral Red", "Floral Yellow"]
    },
    rating: 4.6,
    reviewCount: 420,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Women's Skinny Jeans",
    price: 1799,
    originalPrice: 2799,
    description: "Stylish skinny fit jeans, stretchable fabric, comfortable fit, perfect for casual wear. Flattering silhouette.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop"
    ],
    category: "girls",
    brand: "Denim Style",
    stock: 50,
    variants: {
      size: ["24", "26", "28", "30", "32"],
      color: ["Dark Blue", "Light Blue", "Black", "Gray"]
    },
    rating: 4.5,
    reviewCount: 380,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Women's Casual Shirt",
    price: 1199,
    originalPrice: 1899,
    description: "Comfortable casual shirt, soft fabric, relaxed fit, perfect for everyday wear. Versatile and stylish.",
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
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
    isActive: true,
    isPromotional: false
  },
  {
    name: "Women's Summer Dress",
    price: 1999,
    originalPrice: 2999,
    description: "Lightweight summer dress, breathable fabric, flowy design, perfect for hot weather. Comfortable and stylish.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566479179817-278b0b8f0e4e?w=800&h=800&fit=crop"
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
    isActive: true,
    isPromotional: false
  },
  {
    name: "Women's Fashion Cap",
    price: 599,
    originalPrice: 899,
    description: "Stylish women's cap, adjustable fit, trendy design, perfect for outdoor activities. UV protection included.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop"
    ],
    category: "girls",
    brand: "Fashion Cap",
    stock: 70,
    variants: {
      color: ["Pink", "White", "Black", "Navy", "Beige"]
    },
    rating: 4.3,
    reviewCount: 140,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Women's Ankle Boots",
    price: 3499,
    originalPrice: 4999,
    description: "Stylish ankle boots, comfortable heel, premium material, perfect for casual and semi-formal wear. Durable and fashionable.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&h=800&fit=crop"
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
    isActive: true,
    isPromotional: false
  },
  {
    name: "Women's Maxi Dress",
    price: 2799,
    originalPrice: 3999,
    description: "Elegant maxi dress, flowing design, comfortable fabric, perfect for parties and special occasions. Stunning and elegant.",
    image: "https://images.unsplash.com/photo-1566479179817-278b0b8f0e4e?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566479179817-278b0b8f0e4e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop"
    ],
    category: "girls",
    brand: "Elegant Wear",
    stock: 30,
    variants: {
      size: ["XS", "S", "M", "L", "XL"],
      color: ["Navy", "Black", "Red", "Purple", "Emerald"]
    },
    rating: 4.8,
    reviewCount: 380,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Women's High Heels",
    price: 2299,
    originalPrice: 3499,
    description: "Elegant high heels with comfortable padding, perfect for parties and formal events. Stylish design, premium quality.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop"
    ],
    category: "girls",
    brand: "Elegant Shoes",
    stock: 20,
    variants: {
      size: ["5", "6", "7", "8", "9", "10"],
      color: ["Black", "Nude", "Red", "Silver", "Gold"]
    },
    rating: 4.5,
    reviewCount: 290,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Women's Tote Bag",
    price: 1799,
    originalPrice: 2799,
    description: "Spacious tote bag with multiple compartments, perfect for work and shopping. Durable material, stylish design.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop"
    ],
    category: "girls",
    brand: "Fashion Bags",
    stock: 45,
    variants: {
      color: ["Black", "Brown", "Navy", "Beige", "Pink"]
    },
    rating: 4.4,
    reviewCount: 210,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Women's Sunglasses",
    price: 999,
    originalPrice: 1699,
    description: "Fashionable sunglasses with UV protection, trendy frames, perfect for sunny days. Stylish and protective.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop"
    ],
    category: "girls",
    brand: "EyeWear",
    stock: 55,
    variants: {
      color: ["Black", "Brown", "Tortoise", "Gold", "Silver"],
      lens: ["Polarized", "Gradient", "Mirror"]
    },
    rating: 4.3,
    reviewCount: 180,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Women's Winter Coat",
    price: 4499,
    originalPrice: 6999,
    description: "Warm winter coat with hood, perfect for cold weather. Water-resistant, insulated, stylish design.",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop"
    ],
    category: "girls",
    brand: "Winter Wear",
    stock: 18,
    variants: {
      size: ["XS", "S", "M", "L", "XL"],
      color: ["Black", "Navy", "Gray", "Red", "Beige"]
    },
    rating: 4.7,
    reviewCount: 150,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Women's Joggers",
    price: 1499,
    originalPrice: 2299,
    description: "Comfortable joggers with elastic waistband, perfect for workouts and casual wear. Soft fabric, relaxed fit.",
    image: "https://images.unsplash.com/photo-1506629905607-3c3c0a1c0b5e?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506629905607-3c3c0a1c0b5e?w=800&h=800&fit=crop"
    ],
    category: "girls",
    brand: "Active Wear",
    stock: 40,
    variants: {
      size: ["XS", "S", "M", "L", "XL"],
      color: ["Black", "Gray", "Navy", "Pink", "Purple"]
    },
    rating: 4.4,
    reviewCount: 220,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Women's Scarf Set",
    price: 699,
    originalPrice: 1199,
    description: "Luxurious scarf set with multiple colors, soft fabric, perfect for winter. Versatile and stylish accessory.",
    image: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=800&h=800&fit=crop"
    ],
    category: "girls",
    brand: "Fashion Accessories",
    stock: 75,
    variants: {
      color: ["Multicolor", "Navy", "Red", "Pink", "Gray", "Black"]
    },
    rating: 4.3,
    reviewCount: 160,
    isActive: true,
    isPromotional: false
  },

  // ========== KIDS PRODUCTS ==========
  {
    name: "Kids T-Shirt",
    price: 499,
    originalPrice: 799,
    description: "Comfortable kids t-shirt, soft cotton fabric, fun designs, perfect for daily wear. Durable and colorful.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop"
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
    isActive: true,
    isPromotional: false
  },
  {
    name: "Kids Denim Pants",
    price: 999,
    originalPrice: 1499,
    description: "Durable kids jeans, comfortable fit, stretchable fabric, perfect for active kids. Built to last through playtime.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop"
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
    isActive: true,
    isPromotional: false
  },
  {
    name: "Kids Dress",
    price: 1299,
    originalPrice: 1999,
    description: "Cute kids dress, comfortable fabric, colorful designs, perfect for parties and special occasions. Adorable and stylish.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop"
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
    isActive: true,
    isPromotional: false
  },
  {
    name: "Kids Cap",
    price: 299,
    originalPrice: 499,
    description: "Fun kids cap, adjustable strap, colorful designs, perfect for outdoor play. UV protection included.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop"
    ],
    category: "kids",
    brand: "Kids Cap",
    stock: 120,
    variants: {
      color: ["Red", "Blue", "Yellow", "Green", "Pink", "Black"]
    },
    rating: 4.3,
    reviewCount: 120,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Kids Boots",
    price: 1499,
    originalPrice: 2299,
    description: "Comfortable kids boots, durable sole, easy to wear, perfect for school and outdoor activities. Supportive and comfortable.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop"
    ],
    category: "kids",
    brand: "Kids Footwear",
    stock: 50,
    variants: {
      size: ["10", "11", "12", "13", "1", "2", "3"],
      color: ["Black", "Brown", "Blue", "Pink", "Red"]
    },
    rating: 4.5,
    reviewCount: 160,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Kids Shirt",
    price: 599,
    originalPrice: 999,
    description: "Comfortable kids shirt, soft fabric, fun prints, perfect for school and casual wear. Colorful and durable.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop"
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
    isActive: true,
    isPromotional: false
  },
  {
    name: "Kids Backpack",
    price: 799,
    originalPrice: 1299,
    description: "Colorful kids backpack with multiple compartments, perfect for school. Durable material, fun designs.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop"
    ],
    category: "kids",
    brand: "School Essentials",
    stock: 65,
    variants: {
      color: ["Blue", "Pink", "Red", "Green", "Black", "Purple"],
      size: ["Small", "Medium", "Large"]
    },
    rating: 4.5,
    reviewCount: 140,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Kids Sneakers",
    price: 1199,
    originalPrice: 1899,
    description: "Comfortable kids sneakers with cushioned sole, perfect for running and playing. Lightweight and durable.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop"
    ],
    category: "kids",
    brand: "Kids Footwear",
    stock: 55,
    variants: {
      size: ["10", "11", "12", "13", "1", "2", "3"],
      color: ["Blue", "Pink", "Red", "Black", "White", "Green"]
    },
    rating: 4.4,
    reviewCount: 130,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Kids Winter Jacket",
    price: 1999,
    originalPrice: 2999,
    description: "Warm winter jacket for kids, water-resistant, insulated, perfect for cold weather. Comfortable and protective.",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop"
    ],
    category: "kids",
    brand: "Winter Wear",
    stock: 35,
    variants: {
      size: ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y"],
      color: ["Navy", "Red", "Blue", "Pink", "Black"]
    },
    rating: 4.6,
    reviewCount: 110,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Kids Shorts",
    price: 699,
    originalPrice: 1099,
    description: "Comfortable kids shorts, perfect for summer and playtime. Soft fabric, elastic waistband, colorful designs.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop"
    ],
    category: "kids",
    brand: "Kids Wear",
    stock: 85,
    variants: {
      size: ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y"],
      color: ["Blue", "Red", "Yellow", "Green", "Pink", "Black"]
    },
    rating: 4.3,
    reviewCount: 95,
    isActive: true,
    isPromotional: false
  },
  {
    name: "Kids Sandals",
    price: 899,
    originalPrice: 1399,
    description: "Comfortable kids sandals, perfect for summer. Adjustable straps, durable sole, colorful designs.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop"
    ],
    category: "kids",
    brand: "Kids Footwear",
    stock: 70,
    variants: {
      size: ["10", "11", "12", "13", "1", "2", "3"],
      color: ["Blue", "Pink", "Red", "Black", "Green"]
    },
    rating: 4.4,
    reviewCount: 105,
    isActive: true,
    isPromotional: false
  }
];

async function seedProducts() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await Product.sync({ alter: true });
    console.log("Product model synchronized.");

    // Clear existing products (handle foreign key constraints)
    try {
      // Delete related records first if they exist
      const Wishlist = require("../models/Wishlist");
      const Order = require("../models/Order");
      const ProductRating = require("../models/ProductRating");
      
      // Delete wishlists
      try {
        await Wishlist.destroy({ where: {}, force: true });
        console.log("Cleared wishlists.");
      } catch (err) {
        console.log("No wishlists to clear or error:", err.message);
      }
      
      // Delete product ratings
      try {
        await ProductRating.destroy({ where: {}, force: true });
        console.log("Cleared product ratings.");
      } catch (err) {
        console.log("No product ratings to clear or error:", err.message);
      }
      
      // Clear existing products
      await Product.destroy({ where: {}, force: true });
      console.log("Cleared existing products.");
    } catch (error) {
      console.log("Note: Some related records may still exist. Continuing with seed...");
    }

    // Add products
    for (const productData of products) {
      const product = await Product.create(productData);
      console.log(`✓ Created product: ${productData.name}${productData.isPromotional ? ' [PROMOTIONAL]' : ''}`);
    }

    const totalProducts = await Product.count();
    const promotionalProducts = await Product.count({ where: { isPromotional: true } });
    
    console.log("\n✅ Product seeding completed!");
    console.log(`Total products: ${totalProducts}`);
    console.log(`Promotional products: ${promotionalProducts}`);
    console.log(`Regular products: ${totalProducts - promotionalProducts}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
