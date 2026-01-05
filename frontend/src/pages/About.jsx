import Navbar from "../components/Navbar";
import "./About.css";

function About() {
  return (
    <div className="about-container">
      <Navbar />
      <div className="about-content">
        <div className="about-hero">
          <h1>About ShopSwift</h1>
          <p className="about-subtitle">Your trusted fashion destination for Men, Women & Kids</p>
        </div>

        <section className="about-section">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              ShopSwift was founded with a simple mission: to make quality fashion accessible to everyone. 
              We believe that everyone deserves to look and feel great, regardless of their budget.
            </p>
            <p>
              Since our inception, we've been committed to offering the latest trends in men's, women's, 
              and kids' fashion at affordable prices. Our curated collection features everything from 
              everyday essentials to statement pieces.
            </p>
          </div>
        </section>

        <section className="features-section">
          <h2>Why Choose ShopSwift?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3>Quality Products</h3>
              <p>We source only the finest materials and work with trusted manufacturers to ensure quality.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping to get your favorite items delivered to your doorstep.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3>24/7 Support</h3>
              <p>Our customer service team is always ready to help you with any questions or concerns.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Secure Shopping</h3>
              <p>Your payment information is protected with industry-standard encryption and security.</p>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-content">
            <div className="value-item">
              <h3>Customer First</h3>
              <p>Your satisfaction is our top priority. We go above and beyond to ensure you have the best shopping experience.</p>
            </div>
            <div className="value-item">
              <h3>Sustainability</h3>
              <p>We're committed to sustainable practices and ethical sourcing to protect our planet for future generations.</p>
            </div>
            <div className="value-item">
              <h3>Innovation</h3>
              <p>We continuously improve our platform and services to bring you the latest in fashion and technology.</p>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <h2>Get in Touch</h2>
          <p>Have questions or feedback? We'd love to hear from you!</p>
          <div className="contact-info">
            <div className="contact-item">
              <strong>Email:</strong> support@shopswift.com
            </div>
            <div className="contact-item">
              <strong>Phone:</strong> +1 (555) 123-4567
            </div>
            <div className="contact-item">
              <strong>Address:</strong> 123 Fashion Street, Style City, SC 12345
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;

