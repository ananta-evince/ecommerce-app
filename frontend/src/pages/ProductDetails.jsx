import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastContainer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeleton";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products/${id}`);
      let productData = res.data;
      
      if (productData && typeof productData.variants === 'string') {
        try {
          productData.variants = JSON.parse(productData.variants);
        } catch (e) {
          console.warn("Failed to parse variants JSON:", e);
          productData.variants = {};
        }
      }
      
      setProduct(productData);
      if (productData?.images && productData.images.length > 0) {
        setSelectedImage(0);
      }

      // Auto-select first option for each variant by default
      if (productData?.variants && Object.keys(productData.variants).length > 0) {
        const defaultVariants = {};
        Object.entries(productData.variants).forEach(([key, options]) => {
          const parseOptions = (opts) => {
            if (Array.isArray(opts)) {
              return opts.filter(opt => opt != null && opt !== '' && String(opt).trim() !== '');
            }
            if (typeof opts === 'string') {
              try {
                const parsed = JSON.parse(opts);
                if (Array.isArray(parsed)) {
                  return parsed.filter(opt => opt != null && opt !== '' && String(opt).trim() !== '');
                }
              } catch (e) {
                // Not JSON, continue with string parsing
              }
              const trimmed = opts.trim();
              if (!trimmed) return [];
              if (trimmed.includes(',')) {
                return trimmed.split(',').map(opt => opt.trim()).filter(opt => opt !== '');
              }
              if (trimmed.includes('|')) {
                return trimmed.split('|').map(opt => opt.trim()).filter(opt => opt !== '');
              }
              return [trimmed];
            }
            if (opts != null && typeof opts === 'object') {
              return Object.values(opts).filter(opt => opt != null && opt !== '');
            }
            return [];
          };
          
          const optionsArray = parseOptions(options);
          if (optionsArray.length > 0) {
            defaultVariants[key] = optionsArray[0];
          }
        });
        setSelectedVariant(defaultVariants);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (productCategory) => {
    try {
      const res = await API.get("/products");
      const allProducts = res.data || [];
      const related = allProducts
        .filter(p => p.id !== parseInt(id) && p.category === productCategory)
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  useEffect(() => {
    if (product && product.category) {
      fetchRelatedProducts(product.category);
    }
  }, [product, id]);

  const getVariantPrice = () => {
    if (!product) return 0;
    if (!selectedVariant || Object.keys(selectedVariant).length === 0) {
      return product.price || 0;
    }
    // If variants have price information, use it; otherwise use base price
    // You can extend this to check variant-specific pricing from product.variants
    return product.price || 0;
  };

  const getVariantOriginalPrice = () => {
    if (!product) return 0;
    // Return original price (can be extended for variant-specific original prices)
    return product.originalPrice || 0;
  };

  const getVariantStock = () => {
    if (!product) return 0;
    return product.stock || 0;
  };

  const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= 0 || !currentPrice || currentPrice <= 0) {
      return 0;
    }
    if (originalPrice <= currentPrice) {
      return 0;
    }
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const currentPrice = product ? getVariantPrice() : 0;
  const originalPrice = product ? getVariantOriginalPrice() : 0;
  const discount = calculateDiscount(originalPrice, currentPrice);
  const currentStock = product ? getVariantStock() : 0;
  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product || currentStock < quantity) {
      showToast("Insufficient stock available", "error");
      return;
    }
    setIsAdding(true);
    addToCart({ 
      ...product, 
      selectedVariants: Object.keys(selectedVariant).length > 0 ? selectedVariant : null,
      quantity,
      price: currentPrice
    }, (error) => {
      showToast(error, "error");
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleBuyNow = () => {
    if (!product || currentStock < quantity) {
      showToast("Insufficient stock available", "error");
      return;
    }
    addToCart({ 
      ...product, 
      selectedVariants: Object.keys(selectedVariant).length > 0 ? selectedVariant : null,
      quantity,
      price: currentPrice
    }, (error) => {
      showToast(error, "error");
      return;
    });
    navigate("/checkout");
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        showToast("Removed from wishlist", "success");
      } else {
        const result = await addToWishlist(product, (error) => {
          showToast(error, "error");
        });
        if (result?.success) {
          showToast("Added to wishlist", "success");
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showToast("Failed to update wishlist", "error");
    }
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="product-details-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="product-details-container">
          <div className="empty-state">
            <h2>Product not found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <Link to="/products" className="back-to-products-btn">Browse Products</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images 
    : (product.image ? [product.image] : []);

  return (
    <div className="product-details-page">
      <Navbar />
      
      <div className="product-details-container">
        <Breadcrumbs product={product} />
        
        <div className="product-details-layout">
          <ProductImageGallery 
            images={images} 
            productName={product.name}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />

          <div className="product-info-column">
            <ProductSummary 
              product={product}
              currentPrice={currentPrice}
              originalPrice={originalPrice}
              discount={discount}
              rating={product.rating}
              reviewCount={product.reviewCount}
              isWishlisted={isWishlisted}
              onWishlistToggle={handleWishlistToggle}
            />

            <ProductVariations
              variants={product.variants}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />

            <PurchaseActions
              stock={currentStock}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isAdding={isAdding}
            />

            <DeliveryPolicyInfo />
          </div>
        </div>

        <ProductDetailsTabs
          product={product}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <CustomerReviews
          productId={product.id}
          rating={product.rating}
          reviewCount={product.reviewCount}
          onRatingUpdate={fetchProduct}
        />

        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>

      <Footer />
    </div>
  );
}

function Breadcrumbs({ product }) {
  return (
    <div className="breadcrumbs">
      <Link to="/" className="breadcrumb-link">Home</Link>
      <span className="breadcrumb-separator">/</span>
      <Link to="/products" className="breadcrumb-link">Products</Link>
      {product.category && (
        <>
          <span className="breadcrumb-separator">/</span>
          <Link 
            to={`/products?category=${product.category}`} 
            className="breadcrumb-link"
          >
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
        </>
      )}
      <span className="breadcrumb-separator">/</span>
      <span className="breadcrumb-current">{product.name}</span>
    </div>
  );
}

function ProductImageGallery({ images, productName, selectedImage, onImageSelect }) {
  const imageArray = Array.isArray(images) ? images : (images ? [images] : []);
  
  if (imageArray.length === 0) {
    return (
      <div className="product-image-gallery">
        <div className="main-image-container">
          <div className="image-placeholder">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <p>No Image Available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-image-gallery">
      <div className="main-image-container">
        <img 
          src={imageArray[selectedImage] || imageArray[0]} 
          alt={`${productName} - Image ${selectedImage + 1}`}
          loading="eager"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/600x600/f0f0f0/999999?text=Image+Not+Found";
          }}
        />
      </div>
      {imageArray.length > 1 && (
        <div className="image-thumbnails">
          {imageArray.map((img, idx) => (
            <button
              key={idx}
              className={`thumbnail ${selectedImage === idx ? "active" : ""}`}
              onClick={() => onImageSelect(idx)}
              aria-label={`View image ${idx + 1}`}
            >
              <img 
                src={img} 
                alt={`${productName} thumbnail ${idx + 1}`}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100x100/f0f0f0/999999?text=Image";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductSummary({ product, currentPrice, originalPrice, discount, rating, reviewCount, isWishlisted, onWishlistToggle }) {
  return (
    <div className="product-summary">
      <div className="product-title-section">
        <h1 className="product-title">{product.name}</h1>
        <button 
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={onWishlistToggle}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className="product-rating-section">
        <div className="stars">
          {'★'.repeat(Math.floor(rating || 0))}
          {'☆'.repeat(5 - Math.floor(rating || 0))}
        </div>
        <span className="rating-value">{(rating || 0).toFixed(1)}</span>
        <span className="review-count">({reviewCount || 0} reviews)</span>
      </div>

      <div className="product-price-section">
        <span className="current-price">₹{currentPrice.toLocaleString()}</span>
        {originalPrice && originalPrice > currentPrice && discount > 0 && (
          <>
            <span className="original-price">₹{originalPrice.toLocaleString()}</span>
            <span className="discount-badge">{discount}% OFF</span>
          </>
        )}
      </div>

      {product.brand && (
        <div className="product-brand">
          <strong>Brand:</strong> {product.brand}
        </div>
      )}
    </div>
  );
}

function ProductVariations({ variants, selectedVariant, onVariantChange }) {
  if (!variants || Object.keys(variants).length === 0) {
    return null;
  }

  const parseOptions = (options) => {
    if (Array.isArray(options)) {
      return options.filter(opt => opt != null && opt !== '' && String(opt).trim() !== '');
    }
    
    if (typeof options === 'string') {
      try {
        const parsed = JSON.parse(options);
        if (Array.isArray(parsed)) {
          return parsed.filter(opt => opt != null && opt !== '' && String(opt).trim() !== '');
        }
      } catch (e) {
        // Not JSON, continue with string parsing
      }
      
      const trimmed = options.trim();
      if (!trimmed) return [];
      
      if (trimmed.includes(',')) {
        return trimmed.split(',').map(opt => opt.trim()).filter(opt => opt !== '');
      }
      
      if (trimmed.includes('|')) {
        return trimmed.split('|').map(opt => opt.trim()).filter(opt => opt !== '');
      }
      
      return [trimmed];
    }
    
    if (options != null && typeof options === 'object') {
      if (Array.isArray(Object.values(options))) {
        return Object.values(options).filter(opt => opt != null && opt !== '');
      }
    }
    
    if (options != null) {
      const str = String(options).trim();
      return str ? [str] : [];
    }
    
    return [];
  };

  // Get selected variants display
  const getSelectedVariantsDisplay = () => {
    const selected = Object.entries(selectedVariant)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      .join(', ');
    return selected;
  };

  const hasSelectedVariants = Object.keys(selectedVariant).length > 0 && 
    Object.values(selectedVariant).some(v => v);

  return (
    <div className="product-variations">
      <h3>Select Options</h3>
      {hasSelectedVariants && (
        <div className="selected-variants-info">
          <span className="selected-label">Currently Selected:</span>
          <span className="selected-values">{getSelectedVariantsDisplay()}</span>
        </div>
      )}
      {Object.entries(variants).map(([key, options]) => {
        const optionsArray = parseOptions(options);
        
        if (optionsArray.length === 0) {
          return null;
        }

        return (
          <div key={key} className="variant-group">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <div className="variant-options">
              {optionsArray.map((option) => (
                <button
                  key={option}
                  className={`variant-btn ${selectedVariant[key] === option ? "active" : ""}`}
                  onClick={() => onVariantChange({ ...selectedVariant, [key]: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PurchaseActions({ stock, quantity, onQuantityChange, onAddToCart, onBuyNow, isAdding }) {
  const isOutOfStock = stock === 0;
  const maxQuantity = Math.min(stock, 10);

  return (
    <div className="purchase-actions">
      <div className="stock-info">
        {isOutOfStock ? (
          <span className="out-of-stock">✗ Out of Stock</span>
        ) : (
          <span className="in-stock">✓ In Stock ({stock} available)</span>
        )}
      </div>

      <div className="quantity-selector">
        <label>Quantity:</label>
        <div className="quantity-controls">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity || isOutOfStock}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className={`add-to-cart-btn ${isAdding ? "adding" : ""}`}
          onClick={onAddToCart}
          disabled={isOutOfStock || isAdding}
        >
          {isAdding ? (
            <>
              <span className="check-icon">✓</span>
              Added to Cart
            </>
          ) : (
            "Add to Cart"
          )}
        </button>
        <button
          className="buy-now-btn"
          onClick={onBuyNow}
          disabled={isOutOfStock}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

function DeliveryPolicyInfo() {
  return (
    <div className="delivery-policy-info">
      <div className="policy-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 13l4 4L19 7"></path>
        </svg>
        <div>
          <strong>Free Shipping</strong>
          <p>On orders over ₹999</p>
        </div>
      </div>
      <div className="policy-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <div>
          <strong>Secure Payment</strong>
          <p>100% secure transactions</p>
        </div>
      </div>
    </div>
  );
}

function ProductDetailsTabs({ product, activeTab, onTabChange }) {
  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "shipping", label: "Shipping" }
  ];

  return (
    <div className="product-details-tabs">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tabs-content">
        {activeTab === "description" && (
          <div className="tab-panel">
            <p>{product.description || "No description available for this product."}</p>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="tab-panel">
            <div className="specifications-grid">
              {product.brand && (
                <div className="spec-item">
                  <strong>Brand:</strong>
                  <span>{product.brand}</span>
                </div>
              )}
              {product.category && (
                <div className="spec-item">
                  <strong>Category:</strong>
                  <span>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                </div>
              )}
              <div className="spec-item">
                <strong>Stock:</strong>
                <span>{product.stock || 0} units available</span>
              </div>
              {product.variants && Object.keys(product.variants).length > 0 && (
                <div className="spec-item">
                  <strong>Available Variants:</strong>
                  <span>{Object.keys(product.variants).join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="tab-panel">
            <h4>Shipping Information</h4>
            <ul>
              <li>Free shipping on orders over ₹999</li>
              <li>Standard delivery: 3-5 business days</li>
              <li>Express delivery: 1-2 business days (additional charges apply)</li>
              <li>We ship to all major cities in India</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomerReviews({ productId, rating, reviewCount, onRatingUpdate }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productId) {
      fetchReviews();
      if (user) {
        checkUserRating();
      }
    }
  }, [productId, user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/product-ratings/product/${productId}`);
      setReviews(res.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRating = async () => {
    try {
      const res = await API.get(`/product-ratings/product/${productId}`);
      const userReview = res.data.find(r => r.userId === user?.id);
      if (userReview) {
        setUserRating(userReview);
        setRatingValue(userReview.rating);
        setComment(userReview.comment || "");
      }
    } catch (error) {
      console.error("Error checking user rating:", error);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please login to submit a rating");
      return;
    }

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      setError("Please select a rating between 1 and 5 stars");
      return;
    }

    if (comment.trim() && comment.trim().length < 5) {
      setError("Comment must be at least 5 characters");
      return;
    }

    if (comment.trim() && comment.trim().length > 500) {
      setError("Comment must be less than 500 characters");
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post(`/product-ratings/product/${productId}`, {
        rating: ratingValue,
        comment: comment.trim() || null
      });

      setUserRating(res.data);
      await fetchReviews();
      if (onRatingUpdate) {
        onRatingUpdate();
      }
      setShowRatingForm(false);
      setError("");
      setComment("");
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError(error.response?.data?.error || "Failed to submit rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="customer-reviews">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="rating-number">{(rating || 0).toFixed(1)}</span>
            <div className="stars">
              {'★'.repeat(Math.floor(rating || 0))}
              {'☆'.repeat(5 - Math.floor(rating || 0))}
            </div>
            <span className="total-reviews">({reviewCount || 0} reviews)</span>
          </div>
        </div>
      </div>

      {user && !userRating && !showRatingForm && (
        <button
          className="add-review-btn"
          onClick={() => setShowRatingForm(true)}
        >
          Write a Review
        </button>
      )}

      {user && showRatingForm && (
        <div className="rating-form-container">
          <h3>{userRating ? "Update Your Review" : "Write a Review"}</h3>
          <form onSubmit={handleSubmitRating} className="rating-form">
            <div className="form-group">
              <label>Your Rating *</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`rating-star ${ratingValue >= star ? "active" : ""}`}
                    onClick={() => setRatingValue(star)}
                    disabled={submitting}
                  >
                    ★
                  </button>
                ))}
                <span className="rating-value">{ratingValue} out of 5</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Your Review (Optional)</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows="4"
                disabled={submitting}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="submit" className="submit-rating-btn" disabled={submitting}>
                {submitting ? "Submitting..." : userRating ? "Update Review" : "Submit Review"}
              </button>
              {userRating && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowRatingForm(false);
                    setError("");
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {user && userRating && !showRatingForm && (
        <div className="user-review-card">
          <div className="user-review-header">
            <strong>Your Review</strong>
            <button
              className="edit-review-btn"
              onClick={() => setShowRatingForm(true)}
            >
              Edit
            </button>
          </div>
          <div className="review-rating">
            {'★'.repeat(userRating.rating)}{'☆'.repeat(5 - userRating.rating)}
          </div>
          {userRating.comment && (
            <p className="review-comment">{userRating.comment}</p>
          )}
        </div>
      )}

      <div className="reviews-list">
        {loading ? (
          <div className="loading">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">No reviews yet. Be the first to review this product!</div>
        ) : (
          reviews
            .filter(review => !user || review.userId !== user?.id)
            .map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>{review.User?.name || "Anonymous"}</strong>
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <span className="review-date">{formatDate(review.createdAt)}</span>
                </div>
                {review.comment && (
                  <p className="review-comment">{review.comment}</p>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}

function RelatedProducts({ products }) {
  return (
    <div className="related-products">
      <h2>Related Products</h2>
      <div className="related-products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductDetails;
