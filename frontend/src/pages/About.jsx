import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <Navbar />
      
      <div className="about-container">
        <PageHeader />
        
        <CompanyOverview />
        
        <MissionVision />
        
        <WhyChooseUs />
        
        <OurProcess />
        
        <TrustCredibility />
        
        <PrimaryCTA />
      </div>

      <Footer />
    </div>
  );
}

function PageHeader() {
  return (
    <div className="page-header">
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">About Us</span>
      </div>
      <div className="header-content">
        <h1>About ShopSwift</h1>
      </div>
    </div>
  );
}

function CompanyOverview() {
  return (
    <section className="company-overview">
      <div className="container">
        <div className="overview-content">
          <div className="overview-text">
            <h2>Company Overview</h2>
            <p>
              ShopSwift was founded with a simple mission: to make quality fashion accessible to everyone. 
              We believe that everyone deserves to look and feel great, regardless of their budget.
            </p>
            <p>
              Since our inception, we've been committed to offering the latest trends in men's, women's, 
              and kids' fashion at affordable prices. Our curated collection features everything from 
              everyday essentials to statement pieces that help you express your unique style.
            </p>
            <p>
              With a focus on quality, affordability, and customer satisfaction, ShopSwift has grown to 
              become a trusted name in online fashion retail. We work directly with manufacturers to bring 
              you the best prices without compromising on quality.
            </p>
          </div>
          <div className="overview-stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5K+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Brands</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Cities Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionVision() {
  return (
    <section className="mission-vision">
      <div className="container">
        <div className="mission-vision-grid">
          <div className="mission-card">
            <div className="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3>Our Mission</h3>
            <p>
              To democratize fashion by making high-quality, trendy clothing accessible to everyone. 
              We strive to provide exceptional value, outstanding customer service, and a seamless 
              shopping experience that empowers our customers to express their unique style.
            </p>
          </div>
          <div className="vision-card">
            <div className="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <h3>Our Vision</h3>
            <p>
              To become India's most trusted and loved fashion e-commerce platform, known for 
              quality, affordability, and innovation. We envision a future where everyone can 
              access the latest fashion trends and build a wardrobe they love without breaking the bank.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const features = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      ),
      title: "Quality Products",
      description: "We source only the finest materials and work with trusted manufacturers to ensure every product meets our high quality standards."
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 13l4 4L19 7"></path>
        </svg>
      ),
      title: "Free Shipping",
      description: "Enjoy free shipping on orders over ₹999. Fast and reliable delivery to your doorstep across India."
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      ),
      title: "24/7 Support",
      description: "Our dedicated customer service team is available round the clock to assist you with any questions or concerns."
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      title: "Secure Payment",
      description: "Your payment information is protected with industry-standard encryption and security measures."
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      ),
      title: "Best Prices",
      description: "We work directly with manufacturers to offer you the best prices without compromising on quality."
    }
  ];

  return (
    <section className="why-choose-us">
      <div className="container">
        <div className="section-header">
          <h2>Why Choose Us</h2>
          <p className="section-subtitle">Discover what makes ShopSwift your perfect fashion partner</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OurProcess() {
  const steps = [
    {
      number: "01",
      title: "Browse & Discover",
      description: "Explore our extensive collection of fashion items for men, women, and kids. Use filters to find exactly what you're looking for."
    },
    {
      number: "02",
      title: "Select & Customize",
      description: "Choose your favorite items, select sizes and colors, and add them to your cart. Review your selections before checkout."
    },
    {
      number: "03",
      title: "Secure Checkout",
      description: "Complete your purchase with our secure payment gateway. We accept all major payment methods for your convenience."
    },
    {
      number: "04",
      title: "Fast Delivery",
      description: "We process and ship your order quickly. Track your package in real-time and receive it at your doorstep."
    }
  ];

  return (
    <section className="our-process">
      <div className="container">
        <div className="section-header">
          <h2>Our Process</h2>
          <p className="section-subtitle">How we make your shopping experience seamless</p>
        </div>
        <div className="process-steps">
          {steps.map((step, index) => (
            <div key={index} className="process-step">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustCredibility() {
  const trustFactors = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      title: "Verified Seller",
      description: "Certified and verified e-commerce platform"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4"></path>
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
          <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3z"></path>
          <path d="M12 3c0 1-1 3-3 3S6 4 6 3s1-3 3-3 3 2 3 3z"></path>
        </svg>
      ),
      title: "Quality Assured",
      description: "100% quality checked products"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      ),
      title: "Customer First",
      description: "10,000+ satisfied customers"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      ),
      title: "Best Prices",
      description: "Direct manufacturer partnerships"
    }
  ];

  return (
    <section className="trust-credibility">
      <div className="container">
        <div className="section-header">
          <h2>Trust & Credibility</h2>
          <p className="section-subtitle">Why thousands of customers trust ShopSwift</p>
        </div>
        <div className="trust-grid">
          {trustFactors.map((factor, index) => (
            <div key={index} className="trust-item">
              <div className="trust-icon">{factor.icon}</div>
              <h3>{factor.title}</h3>
              <p>{factor.description}</p>
            </div>
          ))}
        </div>
        <div className="trust-badges">
          <div className="badge-item">
            <div className="badge-icon">✓</div>
            <span>SSL Secured</span>
          </div>
          <div className="badge-item">
            <div className="badge-icon">✓</div>
            <span>Verified Business</span>
          </div>
          <div className="badge-item">
            <div className="badge-icon">✓</div>
            <span>GST Registered</span>
          </div>
          <div className="badge-item">
            <div className="badge-icon">✓</div>
            <span>Secure Payments</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrimaryCTA() {
  return (
    <section className="primary-cta">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Start Shopping?</h2>
          <p>Discover our amazing collection of fashion products for men, women, and kids</p>
          <div className="cta-buttons">
            <Link to="/products" className="cta-button primary">Shop Now</Link>
            <Link to="/contact" className="cta-button secondary">Contact Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
