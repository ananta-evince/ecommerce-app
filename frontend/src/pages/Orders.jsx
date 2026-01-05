import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Orders.css";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "processing":
        return "#3b82f6";
      case "shipped":
        return "#8b5cf6";
      case "delivered":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      default:
        return "#666";
    }
  };

  return (
    <div className="orders-page">
      <Navbar />
      <div className="orders-container">
        <h1>My Orders</h1>

        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12l2 2 4-4M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2"></path>
            </svg>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
            <Link to="/products" className="shop-btn">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="order-items">
                  {order.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image || item.product?.image} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">₹{item.price?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ₹{order.total?.toLocaleString()}</strong>
                  </div>
                  <div className="order-actions">
                    <Link to={`/order/${order.id}`} className="view-btn">View Details</Link>
                    {order.status === "pending" && (
                      <button className="cancel-btn">Cancel Order</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Orders;

