import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
      if (res.data.images && res.data.images.length > 0) {
        setSelectedImage(0);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock < quantity) {
      alert("Insufficient stock available");
      return;
    }
    setIsAdding(true);
    addToCart({ ...product, ...selectedVariant, quantity });
    setTimeout(() => setIsAdding(false), 500);
  };

  const images = product?.images?.length > 0 ? product.images : (product?.image ? [product.image] : []);

  if (loading) {
    return (
      <div className="product-details-container">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-container">
        <Navbar />
        <div className="empty-state">
          <h2>Product not found</h2>
          <button onClick={() => navigate("/home")}>Back to Home</button>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-details-container">
      <Navbar />
      <div className="product-details-content">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back
        </button>

        <div className="product-details-grid">
          <div className="product-images">
            <div className="main-image">
              {images.length > 0 ? (
                <img src={images[selectedImage]} alt={product.name} />
              ) : (
                <div className="image-placeholder">No Image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className={selectedImage === idx ? "active" : ""}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-rating-section">
              <div className="stars">
                {"★".repeat(Math.floor(product.rating || 0))}
                {"☆".repeat(5 - Math.floor(product.rating || 0))}
              </div>
              <span className="rating-value">{product.rating || 0}</span>
              <span className="review-count">({product.reviewCount || 0} reviews)</span>
            </div>

            <div className="product-price-section">
              <span className="current-price">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="original-price">₹{product.originalPrice}</span>
                  <span className="discount-badge">{discount}% off</span>
                </>
              )}
            </div>

            {product.variants && Object.keys(product.variants).length > 0 && (
              <div className="product-variants">
                {Object.entries(product.variants).map(([key, options]) => (
                  <div key={key} className="variant-group">
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    <div className="variant-options">
                      {options.map((option) => (
                        <button
                          key={option}
                          className={`variant-btn ${selectedVariant[key] === option ? "active" : ""}`}
                          onClick={() => setSelectedVariant({ ...selectedVariant, [key]: option })}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="stock-info">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="product-actions">
              <button
                className={`add-to-cart-btn ${isAdding ? "adding" : ""}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {isAdding ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button className="buy-now-btn" disabled={product.stock === 0}>
                Buy Now
              </button>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || "No description available."}</p>
            </div>

            {product.brand && (
              <div className="product-meta">
                <span><strong>Brand:</strong> {product.brand}</span>
                {product.category && <span><strong>Category:</strong> {product.category}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

