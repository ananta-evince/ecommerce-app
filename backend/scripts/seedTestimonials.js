require("dotenv").config();
const sequelize = require("../config/database");
const Testimonial = require("../models/Testimonial");

const testimonials = [
  {
    rating: 5,
    text: "Great quality products and fast delivery! Highly recommended.",
    author: "Sarah Johnson",
    role: "Verified Customer"
  },
  {
    rating: 5,
    text: "Best shopping experience! The clothes fit perfectly and look amazing.",
    author: "Michael Chen",
    role: "Verified Customer"
  },
  {
    rating: 5,
    text: "Affordable prices with premium quality. Will definitely shop again!",
    author: "Emily Davis",
    role: "Verified Customer"
  },
  {
    rating: 5,
    text: "Excellent customer service and quick response time. Love the product quality!",
    author: "Rajesh Kumar",
    role: "Verified Customer"
  },
  {
    rating: 4,
    text: "Good value for money. The products are as described and delivery was on time.",
    author: "Priya Sharma",
    role: "Verified Customer"
  },
  {
    rating: 5,
    text: "Amazing collection! Found exactly what I was looking for. Will be a regular customer.",
    author: "David Wilson",
    role: "Verified Customer"
  }
];

async function seedTestimonials() {
  try {
    await sequelize.sync({ alter: true });
    
    for (const testimonial of testimonials) {
      await Testimonial.findOrCreate({
        where: { 
          text: testimonial.text,
          author: testimonial.author
        },
        defaults: testimonial
      });
    }
    
    console.log("Testimonials seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding testimonials:", error);
    process.exit(1);
  }
}

seedTestimonials();

