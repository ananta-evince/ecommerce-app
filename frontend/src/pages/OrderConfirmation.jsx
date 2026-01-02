import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
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
          <button onClick={() => navigate("/home")}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-container">
      <Navbar />
      <div className="order-confirmation-content">
        <div className="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1>Order Placed Successfully!</h1>
        <p className="order-id">Order ID: #{order.id}</p>

        <div className="order-details-card">
          <h2>Order Details</h2>
          <div className="order-items-list">
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item-row">
                <img src={item.image || "/placeholder.png"} alt={item.name} />
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                </div>
                <span className="item-total">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="order-summary-section">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="summary-row discount">
                <span>Discount:</span>
                <span>-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Tax:</span>
              <span>₹{order.tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="delivery-info">
            <h3>Delivery Address</h3>
            <p>{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="order-status">
            <p><strong>Status:</strong> <span className={`status-badge ${order.orderStatus}`}>{order.orderStatus}</span></p>
            <p><strong>Payment:</strong> <span className={`status-badge ${order.paymentStatus}`}>{order.paymentStatus}</span></p>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate("/home")} className="continue-shopping-btn">
            Continue Shopping
          </button>
          <button onClick={() => navigate("/orders")} className="view-orders-btn">
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;

