import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    filtered = filtered.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    if (minRating > 0) {
      filtered = filtered.filter((product) => (product.rating || 0) >= minRating);
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, products, selectedCategory, selectedBrand, priceRange, minRating, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];
  const brands = ["all", ...new Set(products.map((p) => p.brand).filter(Boolean))];
  const [currentSlide, setCurrentSlide] = useState(0);

  const showCategorySections = !searchQuery && selectedCategory === "all" && selectedBrand === "all" && priceRange.min === 0 && priceRange.max === 100000 && minRating === 0;

  const menProducts = filteredProducts.filter(p => p.category === "men").slice(0, 4);
  const girlsProducts = filteredProducts.filter(p => p.category === "girls").slice(0, 4);
  const kidsProducts = filteredProducts.filter(p => p.category === "kids").slice(0, 4);
  const bestSellers = [...filteredProducts].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 4);
  const newArrivals = [...filteredProducts].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 4);

  const getPromotionalBanners = () => {
    if (products.length === 0) return [];
    
    const featuredProducts = [...products]
      .filter(p => p.image && (p.rating >= 4.5 || p.reviewCount > 100))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);

    if (featuredProducts.length === 0) {
      const topProducts = products.filter(p => p.image).slice(0, 3);
      return topProducts.map((product, index) => ({
        id: product.id,
        title: product.name,
        subtitle: product.originalPrice && product.originalPrice > product.price
          ? `Save ${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% - Now ₹${product.price.toLocaleString()}`
          : `Starting at ₹${product.price.toLocaleString()}`,
        image: product.image || product.images?.[0],
        link: `/product/${product.id}`,
        category: product.category
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
          : `₹${product.price.toLocaleString()} - ${product.category.charAt(0).toUpperCase() + product.category.slice(1)} Collection`,
        image: product.image || product.images?.[0],
        link: `/product/${product.id}`,
        category: product.category
      };
    });
  };

  const promotionalBanners = getPromotionalBanners();

  useEffect(() => {
    if (promotionalBanners.length === 0) {
      setCurrentSlide(0);
      return;
    }
    
    if (currentSlide >= promotionalBanners.length) {
      setCurrentSlide(0);
    }
  }, [promotionalBanners.length, currentSlide]);

  useEffect(() => {
    if (showCategorySections && !loading && promotionalBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % promotionalBanners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [showCategorySections, loading, promotionalBanners.length]);

  return (
    <div className="home-container">
      <Navbar onSearch={handleSearch} />

      {showCategorySections && !loading && (
        <>
          {promotionalBanners.length > 0 && (
            <div className="promotional-slider">
              <div className="slider-wrapper">
                <div 
                  className="slider-container" 
                  style={{ 
                    transform: `translateX(-${currentSlide * (100 / promotionalBanners.length)}%)`,
                    width: `${promotionalBanners.length * 100}%`
                  }}
                >
                  {promotionalBanners.map((banner) => (
                    <div 
                      key={banner.id} 
                      className="slider-slide"
                      style={{ width: `${100 / promotionalBanners.length}%` }}
                    >
                      <div className="slide-image-wrapper">
                        {banner.image ? (
                          <img src={banner.image} alt={banner.title} onError={(e) => {
                            e.target.src = "https://via.placeholder.com/1200x600/f0f0f0/999999?text=Product+Image";
                          }} />
                        ) : (
                          <div className="slide-placeholder">
                            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                              <line x1="3" y1="6" x2="21" y2="6"></line>
                              <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                          </div>
                        )}
                        <div className="slide-overlay"></div>
                      </div>
                      <div className="slide-content">
                        <h1>{banner.title}</h1>
                        <p>{banner.subtitle}</p>
                        <Link to={banner.link || `/category/${banner.category}`} className="slide-button">Shop Now</Link>
                      </div>
                    </div>
                  ))}
                </div>
                {promotionalBanners.length > 1 && (
                  <>
                    <button 
                      className="slider-nav slider-prev"
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + promotionalBanners.length) % promotionalBanners.length)}
                      aria-label="Previous slide"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6"></path>
                      </svg>
                    </button>
                    <button 
                      className="slider-nav slider-next"
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % promotionalBanners.length)}
                      aria-label="Next slide"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"></path>
                      </svg>
                    </button>
                  </>
                )}
              </div>
              {promotionalBanners.length > 1 && (
                <div className="slider-dots">
                  {promotionalBanners.map((_, index) => (
                    <button
                      key={index}
                      className={currentSlide === index ? "active" : ""}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="promotional-strip">
            <div className="strip-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Free Shipping on Orders Over ₹999</span>
            </div>
            <div className="strip-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Secure Payment</span>
            </div>
            <div className="strip-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Easy Returns</span>
            </div>
            <div className="strip-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>

          <div className="category-banners">
            <div className="category-banner" onClick={() => setSelectedCategory("men")}>
              <div className="banner-content">
                <h2>Men's Collection</h2>
                <p>Shop Now →</p>
              </div>
            </div>
            <div className="category-banner" onClick={() => setSelectedCategory("girls")}>
              <div className="banner-content">
                <h2>Women's Collection</h2>
                <p>Shop Now →</p>
              </div>
            </div>
            <div className="category-banner" onClick={() => setSelectedCategory("kids")}>
              <div className="banner-content">
                <h2>Kids Collection</h2>
                <p>Shop Now →</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="home-content">
        {showCategorySections && !loading && (
          <>
            {menProducts.length > 0 && (
              <section className="category-section">
                <div className="section-header">
                  <h2 className="section-title">Men's Fashion</h2>
                  <button className="view-all-btn" onClick={() => setSelectedCategory("men")}>
                    View All →
                  </button>
                </div>
                <div className="products-grid">
                  {menProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {girlsProducts.length > 0 && (
              <section className="category-section">
                <div className="section-header">
                  <h2 className="section-title">Women's Fashion</h2>
                  <button className="view-all-btn" onClick={() => setSelectedCategory("girls")}>
                    View All →
                  </button>
                </div>
                <div className="products-grid">
                  {girlsProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {kidsProducts.length > 0 && (
              <section className="category-section">
                <div className="section-header">
                  <h2 className="section-title">Kids Fashion</h2>
                  <button className="view-all-btn" onClick={() => setSelectedCategory("kids")}>
                    View All →
                  </button>
                </div>
                <div className="products-grid">
                  {kidsProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {bestSellers.length > 0 && (
              <section className="category-section">
                <div className="section-header">
                  <h2 className="section-title">Best Sellers</h2>
                  <Link to="/products?sort=popular" className="view-all-btn">View All →</Link>
                </div>
                <div className="products-grid">
                  {bestSellers.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {newArrivals.length > 0 && (
              <section className="category-section">
                <div className="section-header">
                  <h2 className="section-title">New Arrivals</h2>
                  <Link to="/products?filter=new" className="view-all-btn">View All →</Link>
                </div>
                <div className="products-grid">
                  {newArrivals.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {(searchQuery || !showCategorySections) && (
          <>
            <div className="filters-bar">
              <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                Filters
              </button>
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Brand</label>
              <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand.charAt(0).toUpperCase() + brand.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="filter-group">
              <label>Minimum Rating</label>
              <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars</option>
                <option value={3}>3+ Stars</option>
              </select>
            </div>
            <button className="clear-filters-btn" onClick={() => {
              setSelectedCategory("all");
              setSelectedBrand("all");
              setPriceRange({ min: 0, max: 100000 });
              setMinRating(0);
            }}>
              Clear Filters
            </button>
            </div>
            )}

            {searchQuery && (
          <div className="search-results-header">
            <h2>
              {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for "{searchQuery}"
            </h2>
            </div>
            )}

            {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="60" stroke="#8b5cf6" strokeWidth="10" fill="none" opacity="0.5" />
                <path
                  d="M150 150 L180 180"
                  stroke="#8b5cf6"
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
            </div>
            <h2>No products found</h2>
            <p>
              {searchQuery || selectedCategory !== "all" || selectedBrand !== "all"
                ? "Try adjusting your filters"
                : "No products available at the moment"}
            </p>
          </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showCategorySections && !loading && (
        <>
          <section className="testimonials-section">
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-rating">★★★★★</div>
                <p className="testimonial-text">"Great quality products and fast delivery! Highly recommended."</p>
                <p className="testimonial-author">- Sarah Johnson</p>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-rating">★★★★★</div>
                <p className="testimonial-text">"Best shopping experience! The clothes fit perfectly and look amazing."</p>
                <p className="testimonial-author">- Michael Chen</p>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-rating">★★★★★</div>
                <p className="testimonial-text">"Affordable prices with premium quality. Will definitely shop again!"</p>
                <p className="testimonial-author">- Emily Davis</p>
              </div>
            </div>
          </section>

          <section className="newsletter-section">
            <div className="newsletter-content">
              <h2>Subscribe to Our Newsletter</h2>
              <p>Get the latest fashion trends, exclusive offers, and updates delivered to your inbox.</p>
              <form className="newsletter-form-home" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }}>
                <input type="email" placeholder="Enter your email address" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}

export default Home;
