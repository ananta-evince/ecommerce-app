import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeleton";
import Slider from "../components/Slider";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [promotionalProducts, setPromotionalProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    fetchProducts();
    fetchPromotionalProducts();
  }, []);

  // Scroll to top after loading completes to handle any late-loading content
  useEffect(() => {
    if (!loading) {
      // Small delay to ensure DOM is fully rendered
      const scrollTimer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
      
      return () => {
        clearTimeout(scrollTimer);
      };
    }
  }, [loading]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotionalProducts = async () => {
    try {
      const res = await API.get("/products?promotional=true");
      setPromotionalProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching promotional products:", error);
    }
  };

  const handleSearch = (query) => {
    // Search handled by Navbar
  };

  const getCategories = () => {
    const categoryMap = new Map();
    const defaultImages = {
      men: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&h=400&fit=crop&auto=format",
      girls: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop&auto=format",
      women: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop&auto=format",
      kids: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop&auto=format",
      all: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format"
    };

    if (products.length > 0) {
      products.forEach((product) => {
        if (product.category && product.category.trim() !== "") {
          const categoryId = product.category.toLowerCase();
          if (!categoryMap.has(categoryId)) {
            const categoryImage = product.image || product.images?.[0] || defaultImages[categoryId] || defaultImages.all;
            const categoryName = product.category.charAt(0).toUpperCase() + product.category.slice(1);
            categoryMap.set(categoryId, {
              id: categoryId,
              name: categoryName,
              image: categoryImage,
              link: `/products?category=${categoryId}`
            });
          }
        }
      });
    }

    const categories = Array.from(categoryMap.values());
    categories.sort((a, b) => a.name.localeCompare(b.name));

    if (categories.length === 0) {
      return [
        { id: "all", name: "All Products", image: defaultImages.all, link: "/products" },
        { id: "men", name: "Men", image: defaultImages.men, link: "/products?category=men" },
        { id: "girls", name: "Women", image: defaultImages.girls, link: "/products?category=girls" },
        { id: "kids", name: "Kids", image: defaultImages.kids, link: "/products?category=kids" }
      ];
    }

    return [
      { id: "all", name: "All Products", image: defaultImages.all, link: "/products" },
      ...categories
    ];
  };

  const categories = getCategories();

  const getHeroBanners = () => {
    if (products.length === 0) return [];
    
    const featuredProducts = [...products]
      .filter(p => p.image && (p.rating >= 4.5 || p.reviewCount > 100))
      .sort((a, b) => (b.rating || 0) * (b.reviewCount || 0) - (a.rating || 0) * (a.reviewCount || 0))
      .slice(0, 3);

    if (featuredProducts.length === 0) {
      const topProducts = products.filter(p => p.image).slice(0, 3);
      return topProducts.map((product) => ({
        id: product.id,
        title: product.name,
        subtitle: product.originalPrice && product.originalPrice > product.price
          ? `Save ${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% - Now ₹${product.price.toLocaleString()}`
          : `Starting at ₹${product.price.toLocaleString()}`,
        image: product.image || product.images?.[0],
        link: `/product/${product.id}`
      }));
    }

    return featuredProducts.map((product) => {
      const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
      
      return {
        id: product.id,
        title: product.name,
        subtitle: discount > 0
          ? `${discount}% Off - Now ₹${product.price.toLocaleString()}`
          : `₹${product.price.toLocaleString()} - ${product.category?.charAt(0).toUpperCase() + product.category?.slice(1)} Collection`,
        image: product.image || product.images?.[0],
        link: `/product/${product.id}`
      };
    });
  };

  const heroBanners = getHeroBanners();

  const featuredProducts = [...products]
    .filter(p => p.rating >= 4.0 && p.reviewCount > 20)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8);

  const bestSellers = [...products]
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    .slice(0, 8);

  const newArrivals = [...products]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 8);

  const getPromotionalProducts = () => {
    if (promotionalProducts.length > 0) {
      return promotionalProducts;
    }
    
    if (products.length === 0) return [];
    
    const productsWithDiscount = products.filter(p => 
      p.originalPrice && p.originalPrice > p.price
    );
    
    if (productsWithDiscount.length === 0) {
      return [];
    }
    
    const sortedByDiscount = productsWithDiscount.sort((a, b) => {
      const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
      const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
      return discountB - discountA;
    });
    
    return sortedByDiscount.slice(0, 5);
  };

  const promotionalProductsList = getPromotionalProducts();

  return (
    <div className="home-container">
      <Navbar onSearch={handleSearch} />

      {loading ? (
        <div className="home-skeleton">
          <div className="skeleton-hero"></div>
          <div className="skeleton-categories"></div>
          <ProductGridSkeleton count={8} />
        </div>
      ) : (
        <>
          <HeroBanner banners={heroBanners} />
          
          <CategoryGrid categories={categories} />
          
          <FeaturedProducts products={featuredProducts} loading={loading} />
          
          <PromotionalSlider products={promotionalProductsList} />
          
          <BestSellers products={bestSellers} loading={loading} />
          
          <NewArrivals products={newArrivals} loading={loading} />
          
          <CustomerTestimonials />
          
          <NewsletterSubscription />
        </>
      )}

      <Footer />
    </div>
  );
}

function HeroBanner({ banners }) {
  if (banners.length === 0) return null;

  const slides = banners.map((banner) => ({
    id: banner.id,
    content: (
      <div className="hero-slide">
        <div className="hero-slide-image-wrapper">
          {banner.image ? (
            <img 
              src={banner.image}
              alt={banner.title}
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/1200x600/f0f0f0/999999?text=Product+Image";
              }} 
            />
          ) : (
            <div className="hero-slide-placeholder">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          )}
          <div className="hero-slide-overlay"></div>
        </div>
        <div className="hero-slide-content">
          <h1>{banner.title}</h1>
          <p>{banner.subtitle}</p>
          <Link to={banner.link || "/products"} className="hero-slide-button">Shop Now</Link>
        </div>
      </div>
    )
  }));

  return (
    <section className="hero-banner">
        <Slider
          slides={slides}
          autoplay={true}
          autoplayDelay={5000}
          showNavigation={true}
          showPagination={false}
          className="hero-slider"
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 0 },
            768: { slidesPerView: 1, spaceBetween: 0 },
            1024: { slidesPerView: 1, spaceBetween: 0 }
          }}
        />
    </section>
  );
}

function CategoryGrid({ categories }) {
  return (
    <section className="category-grid-section">
      <div className="container">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.id} to={category.link} className="category-card">
              <div className="category-image">
                <img 
                  src={category.image} 
                  alt={category.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300/f0f0f0/999999?text=Category";
                  }}
                />
              </div>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts({ products, loading }) {
  if (loading) return <ProductGridSkeleton count={8} />;
  if (products.length === 0) return null;

  return (
    <section className="featured-products-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products?filter=featured" className="view-all-link">View All →</Link>
        </div>
        <div className="products-grid">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromotionalSlider({ products }) {
  if (!products || products.length === 0) return null;

  const slides = products.map((product) => {
    const discount = product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    return {
      id: product.id,
      content: (
        <div className="promotional-slide">
          <div className="promotional-banner">
            <div className="promotional-content">
              <p className="special-offer-label">Special Offer</p>
              <h2>
                {discount > 0 
                  ? `Get ${discount}% OFF`
                  : "Special Offer"
                }
              </h2>
              {discount > 0 && (
                <p className="promotional-subtitle">
                  Limited time offer
                </p>
              )}
              <Link to={`/product/${product.id}`} className="promotional-button">Shop Now</Link>
            </div>
            <div className="promotional-image-section">
              <div className="promotional-image">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/600x400/f0f0f0/999999?text=Product";
                    }}
                  />
                ) : (
                  <div className="promotional-placeholder">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                  </div>
                )}
              </div>
              <div className="promotional-product-details">
                <h3 className="promotional-product-name">{product.name}</h3>
                <p className="promotional-price">
                  {product.originalPrice && product.originalPrice > product.price ? (
                    <>
                      <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                      <span className="current-price">₹{product.price.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="current-price">₹{product.price.toLocaleString()}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    };
  });

  return (
    <section className="promotional-banner-section">
      <div className="container">
        <Slider
          slides={slides}
          autoplay={true}
          autoplayDelay={5000}
          showNavigation={true}
          showPagination={false}
          className="promotional-slider"
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 0 },
            768: { slidesPerView: 1, spaceBetween: 0 },
            1024: { slidesPerView: 1, spaceBetween: 0 }
          }}
        />
      </div>
    </section>
  );
}

function BestSellers({ products, loading }) {
  if (loading) return <ProductGridSkeleton count={8} />;
  if (products.length === 0) return null;

  return (
    <section className="best-sellers-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Best Sellers</h2>
          <Link to="/products?sort=popular" className="view-all-link">View All →</Link>
        </div>
        <div className="products-grid">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewArrivals({ products, loading }) {
  if (loading) return <ProductGridSkeleton count={8} />;
  if (products.length === 0) return null;

  return (
    <section className="new-arrivals-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <Link to="/products?filter=new" className="view-all-link">View All →</Link>
        </div>
        <div className="products-grid">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomerTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await API.get("/testimonials");
      setTestimonials(res.data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshTestimonials = () => {
    fetchTestimonials();
  };

  if (loading) {
    return (
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="testimonial-card" style={{ opacity: 0.5 }}>
                <div className="testimonial-rating">★★★★★</div>
                <p className="testimonial-text">Loading...</p>
                <div className="testimonial-author">
                  <strong>Loading...</strong>
                  <span>Loading...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonials-grid">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-rating">
                {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.author}</strong>
                <span>{testimonial.role || "Verified Customer"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialForm() {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      setAuthor(user.name || user.email || "");
    }
  }, [user, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Please enter your testimonial");
      return;
    }

    if (!author.trim()) {
      setError("Please enter your name");
      return;
    }

    if (text.length < 10) {
      setError("Testimonial must be at least 10 characters");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/testimonials", {
        rating,
        text: text.trim(),
        author: author.trim(),
        role: "Verified Customer"
      });
      setSubmitted(true);
      setText("");
      setRating(5);
      setTimeout(() => {
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setError(error.response?.data?.error || "Failed to submit testimonial. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="testimonial-form-section">
      <div className="container">
        <h2 className="section-title">Share Your Experience</h2>
        <div className="testimonial-form-container">
          <form onSubmit={handleSubmit} className="testimonial-form">
            <div className="form-group">
              <label htmlFor="author">Your Name *</label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setAuthor(value);
                }}
                placeholder="Enter your name"
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label>Your Rating *</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`rating-star ${rating >= star ? "active" : ""}`}
                    onClick={() => setRating(star)}
                    disabled={submitting}
                  >
                    ★
                  </button>
                ))}
                <span className="rating-value">{rating} out of 5</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="text">Your Testimonial *</label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tell us about your experience..."
                rows="4"
                required
                disabled={submitting}
                minLength={10}
              />
              <span className="char-count">{text.length} characters (minimum 10)</span>
            </div>

            {error && <div className="error-message">{error}</div>}
            {submitted && <div className="success-message">Thank you! Your testimonial has been submitted.</div>}

            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Testimonial"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!email.trim()) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }

    if (!validateEmail(email.trim())) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post("/newsletter/subscribe", { email: email.trim() });
      
      setMessage(res.data.message || "Thank you for subscribing!");
      setMessageType("success");
      setEmail("");
      
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      const errorMessage = error.response?.data?.error || "Failed to subscribe. Please try again later.";
      setMessage(errorMessage);
      setMessageType("error");
      
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-content">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest fashion trends, exclusive offers, and updates delivered to your inbox.</p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required 
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {message && (
            <div className={`newsletter-message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;
