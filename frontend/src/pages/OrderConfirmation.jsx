import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyOrderId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(`#${order.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/orders/${id}`);
      let orderData = res.data;
      
      // Parse items if it's a JSON string
      if (orderData.items && typeof orderData.items === 'string') {
        try {
          orderData.items = JSON.parse(orderData.items);
        } catch (e) {
          console.warn("Failed to parse items JSON:", e);
          orderData.items = [];
        }
      }
      
      // Ensure items is an array
      if (!Array.isArray(orderData.items)) {
        orderData.items = [];
      }
      
      // Parse shippingAddress if it's a JSON string
      if (orderData.shippingAddress && typeof orderData.shippingAddress === 'string') {
        try {
          orderData.shippingAddress = JSON.parse(orderData.shippingAddress);
        } catch (e) {
          console.warn("Failed to parse shippingAddress JSON:", e);
        }
      }
      
      // Ensure shippingAddress is an object
      if (!orderData.shippingAddress || typeof orderData.shippingAddress !== 'object') {
        orderData.shippingAddress = {
          name: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pincode: '',
          phone: '',
          country: 'India'
        };
      }
      
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="order-confirmation-container">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirmation-container">
        <Navbar />
        <div className="empty-state">
          <h2>Order not found</h2>
          <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-container">
      <Navbar />
      <div className="order-confirmation-content">
        <div className="thank-you-section">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="thank-you-title">Thank you for your order!</h1>
          <p className="thank-you-message">Your order has been placed successfully</p>
          <div className="order-id-container">
            <span className="order-id-label">Order ID:</span>
            <div className="order-id-wrapper">
              <span className="order-id-value">#{order.id}</span>
              <button 
                onClick={copyOrderId} 
                className="copy-order-id-btn"
                aria-label="Copy order ID"
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
            {copied && <span className="copy-feedback">Copied!</span>}
          </div>
        </div>

        <div className="order-details-grid">
          <div className="order-details-card">
            <h2>Order Items</h2>
            <div className="order-items-list">
              {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <img src={item.image || "/placeholder.png"} alt={item.name || "Product"} />
                    <div className="item-info">
                      <p className="item-name">{item.name || "Product"}</p>
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <p className="item-variants">
                          {Object.entries(item.selectedVariants)
                            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                            .join(", ")}
                        </p>
                      )}
                      <p className="item-quantity">Quantity: {item.quantity || 1}</p>
                    </div>
                    <span className="item-total">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="no-items">No items found in this order.</p>
              )}
            </div>

            <div className="order-summary-section">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              {order.discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount:</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Tax:</span>
                <span>₹{order.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          <div className="order-info-sidebar">
            <div className="delivery-info-card">
              <h3>Delivery Address</h3>
              <div className="address-content">
                {order.shippingAddress?.name && <p className="address-name"><strong>{order.shippingAddress.name}</strong></p>}
                {order.shippingAddress?.addressLine1 && <p>{order.shippingAddress.addressLine1}</p>}
                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                {(order.shippingAddress?.city || order.shippingAddress?.state || order.shippingAddress?.pincode) && (
                  <p>
                    {order.shippingAddress.city || ''}{order.shippingAddress.city && order.shippingAddress.state ? ', ' : ''}
                    {order.shippingAddress.state || ''}
                    {order.shippingAddress.pincode ? ` - ${order.shippingAddress.pincode}` : ''}
                  </p>
                )}
                {order.shippingAddress?.country && <p>{order.shippingAddress.country}</p>}
                {order.shippingAddress?.phone && <p className="address-phone">Phone: {order.shippingAddress.phone}</p>}
              </div>
            </div>

            <div className="order-status-card">
              <h3>Order Status</h3>
              <div className="status-info">
                <div className="status-item">
                  <span className="status-label">Status:</span>
                  <span className={`status-badge ${order.orderStatus}`}>{order.orderStatus || 'Pending'}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Payment:</span>
                  <span className={`status-badge ${order.paymentStatus || 'pending'}`}>{order.paymentStatus || 'Pending'}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Payment Method:</span>
                  <span className="payment-method">{order.paymentMethod || 'Cash on Delivery'}</span>
                </div>
              </div>
              <div className="action-buttons">
                <button onClick={() => navigate("/account/orders")} className="view-orders-btn primary">
                  View My Orders
                </button>
                <button onClick={() => navigate("/")} className="continue-shopping-btn secondary">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OrderConfirmation;

