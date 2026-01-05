import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(false);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal >= 999 ? 0 : 50;
  const discountAmount = discount;
  const total = subtotal + tax + shipping - discountAmount;

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === "SAVE10") {
      setDiscount(subtotal * 0.1);
      setAppliedDiscount(true);
    } else if (discountCode.toUpperCase() === "WELCOME20") {
      setDiscount(subtotal * 0.2);
      setAppliedDiscount(true);
    } else {
      alert("Invalid discount code");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <Navbar />
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M50 50 L50 80 L40 80 L40 100 L60 100 L60 80 L70 80 L70 140 L80 140 L80 80 L90 80 L90 100 L110 100 L110 80 L100 80 L100 50 L50 50 Z"
                stroke="#d1d5db"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="65" cy="160" r="14" fill="#60a5fa" opacity="0.5" />
              <circle cx="95" cy="160" r="14" fill="#60a5fa" opacity="0.5" />
              <path
                d="M60 80 L60 40 C60 30 65 25 75 25 C85 25 90 30 90 40 L90 80"
                stroke="#60a5fa"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.7"
              />
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button onClick={() => navigate("/home")} className="shop-button">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <Navbar />
      <div className="cart-content">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>

        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="item-placeholder">🛍️</div>
                )}
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">₹{item.price}</p>
              </div>
              <div className="item-quantity">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  −
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <div className="item-total">
                <span>₹{item.price * item.quantity}</span>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="discount-section">
            <input
              type="text"
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="discount-input"
              disabled={appliedDiscount}
            />
            <button
              onClick={handleApplyDiscount}
              className="apply-discount-btn"
              disabled={appliedDiscount}
            >
              {appliedDiscount ? "Applied" : "Apply"}
            </button>
          </div>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          {discountAmount > 0 && (
            <div className="summary-row discount">
              <span>Discount:</span>
              <span>-₹{discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Tax (GST 18%):</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button 
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;

