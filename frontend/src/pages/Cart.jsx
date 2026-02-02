import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useToast } from "../components/ToastContainer";
import Navbar from "../components/Navbar";
import "./Cart.css";

function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart,
    appliedDiscountCode,
    appliedDiscount: cartDiscount,
    setAppliedDiscountCode,
    setAppliedDiscount,
    clearDiscount
  } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedDiscount, setAppliedDiscountState] = useState(false);

  useEffect(() => {
    if (appliedDiscountCode) {
      setDiscountCode(appliedDiscountCode);
      setDiscount(cartDiscount);
      setAppliedDiscountState(true);
    }
  }, [appliedDiscountCode, cartDiscount]);

  const subtotal = getCartTotal();
  const discountAmount = discount;
  const tax = (subtotal - discountAmount) * 0.18; // 18% GST on amount after discount
  const shipping = subtotal >= 999 ? 0 : 50;
  const total = subtotal + tax + shipping - discountAmount;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      showToast("Please enter a discount code", "warning", 3000);
      return;
    }

    try {
      const res = await API.post("/coupons/validate", {
        code: discountCode.trim(),
        subtotal,
      });

      if (res.data.valid) {
        const discountAmount = res.data.discount;
        setDiscount(discountAmount);
        setAppliedDiscountState(true);
        setAppliedDiscountCode(res.data.coupon.code);
        setAppliedDiscount(discountAmount);
        showToast(
          `Discount code "${res.data.coupon.code}" applied! You saved ₹${discountAmount.toFixed(2)}`,
          "success",
          4000
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Invalid discount code";
      showToast(errorMessage, "error", 4000);
      setDiscount(0);
      setAppliedDiscountState(false);
      clearDiscount();
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
          <button onClick={() => navigate("/")} className="shop-button">
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
                {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                  <p className="item-variants">
                    {Object.entries(item.selectedVariants)
                      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                      .join(", ")}
                  </p>
                )}
                <p className="item-price">₹{item.price}</p>
              </div>
              <div className="item-quantity">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1, (error) => showToast(error, "error"))}
                  className="quantity-btn"
                >
                  −
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1, (error) => showToast(error, "error"))}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <div className="item-total">
                <span>₹{item.price * item.quantity}</span>
              </div>
              <button
                onClick={() => removeFromCart(item.id, item.selectedVariants || null)}
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
              onClick={appliedDiscount ? () => {
                setDiscount(0);
                setAppliedDiscountState(false);
                setDiscountCode("");
                clearDiscount();
              } : handleApplyDiscount}
              className="apply-discount-btn"
            >
              {appliedDiscount ? "Remove" : "Apply"}
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

