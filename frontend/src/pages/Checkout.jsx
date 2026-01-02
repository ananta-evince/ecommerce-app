import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./Checkout.css";

function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: user?.name || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await API.get("/addresses");
      setAddresses(res.data);
      const defaultAddress = res.data.find((addr) => addr.isDefault);
      if (defaultAddress) setSelectedAddress(defaultAddress.id);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/addresses", newAddress);
      setAddresses([...addresses, res.data]);
      setSelectedAddress(res.data.id);
      setShowAddressForm(false);
      setNewAddress({
        name: user?.name || "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        isDefault: false,
      });
    } catch (error) {
      console.error("Error creating address:", error);
      alert("Error creating address");
    }
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "WELCOME10") {
      setAppliedCoupon({ code: "WELCOME10", discount: 0.1 });
      alert("Coupon applied! 10% discount");
    } else {
      alert("Invalid coupon code");
    }
  };

  const calculateTotals = () => {
    const subtotal = getCartTotal();
    const discount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
    const tax = (subtotal - discount) * 0.18;
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal - discount + tax + shipping;
    return { subtotal, discount, tax, shipping, total };
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select or add a delivery address");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const address = addresses.find((a) => a.id === selectedAddress);
      const { subtotal, discount, tax, shipping, total } = calculateTotals();

      const orderData = {
        items: cart,
        shippingAddress: address,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
      };

      const res = await API.post("/orders", orderData);

      if (paymentMethod === "cod") {
        clearCart();
        navigate(`/order-confirmation/${res.data.id}`);
      } else {
        // Handle Razorpay payment
        alert("Payment integration coming soon!");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, discount, tax, shipping, total } = calculateTotals();

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <Navbar />
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate("/home")}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <Navbar />
      <div className="checkout-content">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          <div className="checkout-left">
            <div className="checkout-section">
              <h2>Delivery Address</h2>
              {addresses.length > 0 && (
                <div className="address-list">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`address-card ${selectedAddress === address.id ? "selected" : ""}`}
                      onClick={() => setSelectedAddress(address.id)}
                    >
                      <div className="address-header">
                        <strong>{address.name}</strong>
                        {address.isDefault && <span className="default-badge">Default</span>}
                      </div>
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p>Phone: {address.phone}</p>
                    </div>
                  ))}
                </div>
              )}

              {!showAddressForm ? (
                <button className="add-address-btn" onClick={() => setShowAddressForm(true)}>
                  + Add New Address
                </button>
              ) : (
                <form className="address-form" onSubmit={handleAddressSubmit}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={newAddress.addressLine1}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    value={newAddress.addressLine2}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                  />
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    required
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    />
                    Set as default address
                  </label>
                  <div className="form-actions">
                    <button type="submit">Save Address</button>
                    <button type="button" onClick={() => setShowAddressForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="checkout-section">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <strong>Cash on Delivery</strong>
                    <p>Pay when you receive</p>
                  </div>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <strong>Razorpay</strong>
                    <p>Pay with card, UPI, or wallet</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="checkout-section">
              <h2>Apply Coupon</h2>
              <div className="coupon-section">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={applyCoupon}>Apply</button>
              </div>
              {appliedCoupon && (
                <p className="coupon-applied">✓ Coupon {appliedCoupon.code} applied!</p>
              )}
            </div>
          </div>

          <div className="checkout-right">
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="order-items">
                {cart.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image || "/placeholder.png"} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p>Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="total-row discount">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="total-row">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="total-row final-total">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress}
              >
                {loading ? "Placing Order..." : `Place Order (₹${total.toFixed(2)})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

