import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../components/ToastContainer";
import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const getDefaultVariants = (product) => {
    if (!product?.variants || Object.keys(product.variants).length === 0) {
      return null;
    }

    // Parse variants if it's a string
    let variants = product.variants;
    if (typeof variants === 'string') {
      try {
        variants = JSON.parse(variants);
      } catch (e) {
        return null;
      }
    }

    const defaultVariants = {};
    Object.entries(variants).forEach(([key, options]) => {
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

    return Object.keys(defaultVariants).length > 0 ? defaultVariants : null;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    
    // Auto-select default variants if product has variants
    const selectedVariants = getDefaultVariants(product);
    
    addToCart({
      ...product,
      selectedVariants: selectedVariants,
      quantity: 1
    }, (error) => {
      showToast(error, "error");
      setIsAdding(false);
    });
    
    // Show success message with variants if applicable
    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const variantsText = Object.entries(selectedVariants)
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
        .join(", ");
      showToast(`Added to cart (${variantsText})`, "success");
    } else {
      showToast("Added to cart", "success");
    }
    
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="product-placeholder" style={{ display: product.image ? 'none' : 'flex' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <div className="product-badge">New</div>
          <button
            className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {product.description || "Premium quality product with best price"}
          </p>
          {product.rating && (
            <div className="product-rating">
              <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
              <span className="rating-text">({product.rating.toFixed(1)})</span>
            </div>
          )}
          <div className="product-footer">
            <div className="price-section">
              <span className="product-price">₹{product.price?.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="product-original-price">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="product-discount">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
      <button
        className={`cart-button ${isAdding ? "adding" : ""}`}
        onClick={handleAddToCart}
      >
        {isAdding ? (
          <>
            <span className="check-icon">✓</span>
            Added
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}

export default ProductCard;

