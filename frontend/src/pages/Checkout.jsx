import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastContainer";
import Navbar from "../components/Navbar";
import "./Checkout.css";

function Checkout() {
  const { 
    cart, 
    getCartTotal, 
    clearCart,
    appliedDiscountCode: cartDiscountCode,
    appliedDiscount: cartDiscountAmount
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
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
  const [addressErrors, setAddressErrors] = useState({});

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (cartDiscountCode && cartDiscountAmount) {
      setAppliedCoupon({
        code: cartDiscountCode,
        discount: cartDiscountAmount,
      });
      setCouponCode(cartDiscountCode);
    }
  }, [cartDiscountCode, cartDiscountAmount]);

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

  const validateAddressForm = () => {
    const newErrors = {};

    if (!newAddress.name.trim()) {
      newErrors.name = "Name is required";
    } else if (newAddress.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(newAddress.name.trim())) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    if (!newAddress.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(newAddress.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!newAddress.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    } else if (newAddress.addressLine1.trim().length < 10) {
      newErrors.addressLine1 = "Address must be at least 10 characters";
    }

    if (!newAddress.city.trim()) {
      newErrors.city = "City is required";
    } else if (!/^[a-zA-Z\s]+$/.test(newAddress.city.trim())) {
      newErrors.city = "City can only contain letters and spaces";
    }

    if (!newAddress.state.trim()) {
      newErrors.state = "State is required";
    } else if (!/^[a-zA-Z\s]+$/.test(newAddress.state.trim())) {
      newErrors.state = "State can only contain letters and spaces";
    }

    if (!newAddress.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(newAddress.pincode.replace(/\D/g, ""))) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressErrors({});

    if (!validateAddressForm()) {
      return;
    }

    try {
      const addressData = {
        ...newAddress,
        phone: newAddress.phone.replace(/\D/g, ""),
        pincode: newAddress.pincode.replace(/\D/g, ""),
      };
      const res = await API.post("/addresses", addressData);
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
      setAddressErrors({});
      showToast("Address added successfully", "success");
    } catch (error) {
      console.error("Error creating address:", error);
      const errorMessage = error.response?.data?.error || "Failed to create address. Please try again.";
      setAddressErrors({ submit: errorMessage });
      showToast(errorMessage, "error");
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      showToast("Please enter a coupon code", "warning", 3000);
      return;
    }

    try {
      const subtotal = getCartTotal();
      const res = await API.post("/coupons/validate", {
        code: couponCode.trim(),
        subtotal,
      });

      if (res.data.valid) {
        setAppliedCoupon({
          code: res.data.coupon.code,
          discount: res.data.discount,
          discountType: res.data.coupon.discountType,
          discountValue: res.data.coupon.discountValue,
        });
        showToast(
          `Coupon "${res.data.coupon.code}" applied! You saved ₹${res.data.discount.toFixed(2)}`,
          "success",
          4000
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Invalid coupon code";
      showToast(errorMessage, "error", 4000);
      setAppliedCoupon(null);
    }
  };

  const calculateTotals = () => {
    const subtotal = getCartTotal();
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const tax = (subtotal - discount) * 0.18;
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal - discount + tax + shipping;
    return { subtotal, discount, tax, shipping, total };
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast("Please select or add a delivery address", "warning", 3000);
      return;
    }
    if (cart.length === 0) {
      showToast("Your cart is empty", "warning", 3000);
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

      clearCart();
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      showToast("Error placing order. Please try again.", "error", 4000);
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
          <button onClick={() => navigate("/")}>Continue Shopping</button>
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
                  {addressErrors.submit && <div className="error-message">{addressErrors.submit}</div>}
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newAddress.name}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        setNewAddress({ ...newAddress, name: value });
                        if (addressErrors.name) setAddressErrors({ ...addressErrors, name: "" });
                      }}
                      className={addressErrors.name ? "error" : ""}
                      required
                    />
                    {addressErrors.name && <span className="error-message">{addressErrors.name}</span>}
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      placeholder="Phone Number (10 digits)"
                      value={newAddress.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setNewAddress({ ...newAddress, phone: value });
                        if (addressErrors.phone) setAddressErrors({ ...addressErrors, phone: "" });
                      }}
                      className={addressErrors.phone ? "error" : ""}
                      maxLength="10"
                      required
                    />
                    {addressErrors.phone && <span className="error-message">{addressErrors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={newAddress.addressLine1}
                      onChange={(e) => {
                        setNewAddress({ ...newAddress, addressLine1: e.target.value });
                        if (addressErrors.addressLine1) setAddressErrors({ ...addressErrors, addressLine1: "" });
                      }}
                      className={addressErrors.addressLine1 ? "error" : ""}
                      required
                    />
                    {addressErrors.addressLine1 && <span className="error-message">{addressErrors.addressLine1}</span>}
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Address Line 2 (Optional)"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                          setNewAddress({ ...newAddress, city: value });
                          if (addressErrors.city) setAddressErrors({ ...addressErrors, city: "" });
                        }}
                        className={addressErrors.city ? "error" : ""}
                        required
                      />
                      {addressErrors.city && <span className="error-message">{addressErrors.city}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                          setNewAddress({ ...newAddress, state: value });
                          if (addressErrors.state) setAddressErrors({ ...addressErrors, state: "" });
                        }}
                        className={addressErrors.state ? "error" : ""}
                        required
                      />
                      {addressErrors.state && <span className="error-message">{addressErrors.state}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Pincode (6 digits)"
                      value={newAddress.pincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setNewAddress({ ...newAddress, pincode: value });
                        if (addressErrors.pincode) setAddressErrors({ ...addressErrors, pincode: "" });
                      }}
                      className={addressErrors.pincode ? "error" : ""}
                      maxLength="6"
                      required
                    />
                    {addressErrors.pincode && <span className="error-message">{addressErrors.pincode}</span>}
                  </div>
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
                    <button type="button" onClick={() => { setShowAddressForm(false); setAddressErrors({}); }}>
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
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                  <button onClick={() => {
                    setAppliedCoupon(null);
                    setCouponCode("");
                  }}>Remove</button>
                ) : (
                  <button onClick={applyCoupon}>Apply</button>
                )}
              </div>
              {appliedCoupon && (
                <p className="coupon-applied">
                  ✓ Coupon {appliedCoupon.code} applied! Discount: ₹{appliedCoupon.discount.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div className="checkout-right">
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="order-items">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="order-item">
                    <img src={item.image || "/placeholder.png"} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <p className="item-variants">
                          {Object.entries(item.selectedVariants)
                            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                            .join(", ")}
                        </p>
                      )}
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

