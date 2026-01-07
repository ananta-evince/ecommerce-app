import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccountSidebar from "../components/AccountSidebar";
import "./Orders.css";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/orders");
      
      const processedOrders = res.data.map(order => {
        let items = order.items;
        
        if (typeof items === 'string') {
          try {
            items = JSON.parse(items);
          } catch (e) {
            console.warn("Failed to parse items JSON:", e);
            items = [];
          }
        }
        
        if (!Array.isArray(items)) {
          items = [];
        }
        
        return {
          ...order,
          items
        };
      });
      
      setOrders(processedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      setLoadingOrderDetails(true);
      const res = await API.get(`/orders/${orderId}`);
      let orderData = res.data;
      
      if (orderData.items && typeof orderData.items === 'string') {
        try {
          orderData.items = JSON.parse(orderData.items);
        } catch (e) {
          console.warn("Failed to parse items JSON:", e);
          orderData.items = [];
        }
      }
      
      if (!Array.isArray(orderData.items)) {
        orderData.items = [];
      }

      if (orderData.shippingAddress && typeof orderData.shippingAddress === 'string') {
        try {
          orderData.shippingAddress = JSON.parse(orderData.shippingAddress);
        } catch (e) {
          console.warn("Failed to parse shippingAddress JSON:", e);
        }
      }

      setSelectedOrder(orderData);
      setShowOrderDetails(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      showToast("Failed to load order details. Please try again.", "error");
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelConfirm(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return;

    try {
      await API.put(`/orders/${orderToCancel}/cancel`);
      fetchOrders();
      setShowCancelConfirm(false);
      setOrderToCancel(null);
      showToast("Order cancelled successfully", "success");
    } catch (error) {
      console.error("Error cancelling order:", error);
      showToast("Failed to cancel order. Please try again.", "error");
    }
  };

  const handleCancelClose = () => {
    setShowCancelConfirm(false);
    setOrderToCancel(null);
  };


  if (!user) {
    return (
      <div className="account-page">
        <Navbar />
        <div className="account-container">
          <AccountSidebar />
          <div className="account-content">
            <div className="empty-state">
              <h2>Please log in to view your orders</h2>
              <Link to="/login" className="shop-btn">Login</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="account-page">
      <Navbar />
      <div className="account-container">
        <AccountSidebar />

        <div className="account-content">
          <h1>My Orders</h1>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchOrders} className="retry-btn">Retry</button>
          </div>
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
          <>
            {(() => {
              const totalPages = Math.ceil(orders.length / itemsPerPage);
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              const currentOrders = orders.slice(startIndex, endIndex);

              return (
                <>
                  <div className="orders-list">
                    {currentOrders.map((order) => (
                      <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                  <span
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                  >
                    {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || "Pending"}
                  </span>
                </div>
                <div className="order-items">
                  {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <img 
                          src={item.image || item.product?.image || "/placeholder.png"} 
                          alt={item.name || "Product"} 
                        />
                        <div className="item-details">
                          <h4>{item.name || "Product"}</h4>
                          <p>Quantity: {item.quantity || 1}</p>
                          {item.selectedVariants && (
                            <p className="item-variants">
                              {Object.entries(item.selectedVariants)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                        <div className="item-price">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-items">No items found in this order.</p>
                  )}
                </div>
                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ₹{(order.totalAmount || 0).toLocaleString()}</strong>
                  </div>
                  <div className="order-actions">
                    <button 
                      onClick={() => handleViewDetails(order.id)} 
                      className="view-btn"
                    >
                      View Details
                    </button>
                    {order.orderStatus === "pending" && (
                      <button 
                        onClick={() => handleCancelClick(order.id)} 
                        className="cancel-btn"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination 
                      currentPage={currentPage} 
                      totalPages={totalPages} 
                      onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                    />
                  )}
                </>
              );
            })()}
          </>
        )}
        </div>
      </div>
      <Footer />

      {showOrderDetails && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
          loading={loadingOrderDetails}
        />
      )}

      {showCancelConfirm && (
        <CancelConfirmModal 
          onConfirm={handleCancelConfirm}
          onCancel={handleCancelClose}
        />
      )}
    </div>
  );
}

function OrderDetailsModal({ order, onClose, loading }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress && typeof order.shippingAddress === 'string' 
    ? JSON.parse(order.shippingAddress) 
    : order.shippingAddress;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content order-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details - #{order.id}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="order-info-section">
            <div className="info-row">
              <span className="info-label">Order Date:</span>
              <span className="info-value">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Order Status:</span>
              <span 
                className="order-status-badge"
                style={{ backgroundColor: getStatusColor(order.orderStatus) }}
              >
                {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || "Pending"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Payment Method:</span>
              <span className="info-value">
                {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod?.toUpperCase()}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Payment Status:</span>
              <span className="info-value">{order.paymentStatus || "Pending"}</span>
            </div>
          </div>

          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="order-items-list">
              {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <img 
                      src={item.image || item.product?.image || "/placeholder.png"} 
                      alt={item.name || "Product"} 
                    />
                    <div className="item-info">
                      <p className="item-name">{item.name || "Product"}</p>
                      <p className="item-quantity">Quantity: {item.quantity || 1}</p>
                      {item.selectedVariants && (
                        <p className="item-variants">
                          {Object.entries(item.selectedVariants)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="item-price">
                      ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-items">No items found in this order.</p>
              )}
            </div>
          </div>

          {shippingAddress && (
            <div className="delivery-info-section">
              <h3>Delivery Address</h3>
              <div className="address-details">
                <p><strong>{shippingAddress.name}</strong></p>
                <p>{shippingAddress.addressLine1 || shippingAddress.address}</p>
                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                <p>
                  {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                </p>
                <p>Phone: {shippingAddress.phone}</p>
              </div>
            </div>
          )}

          <div className="order-summary-section">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{(order.subtotal || 0).toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="summary-row discount">
                <span>Discount:</span>
                <span>-₹{(order.discount || 0).toLocaleString()}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Tax:</span>
              <span>₹{(order.tax || 0).toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{order.shipping === 0 ? "Free" : `₹${(order.shipping || 0).toLocaleString()}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{(order.totalAmount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CancelConfirmModal({ onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content cancel-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Cancel Order</h2>
          <button className="modal-close-btn" onClick={onCancel}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="confirm-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="confirm-message">
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <button className="cancel-modal-btn" onClick={onCancel}>
            Keep Order
          </button>
          <button className="confirm-modal-btn" onClick={onConfirm}>
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"></path>
        </svg>
        Previous
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis") {
            return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
          }
          return (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"></path>
        </svg>
      </button>
    </div>
  );
}

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "#f59e0b";
    case "confirmed":
    case "processing":
      return "#3b82f6";
    case "shipped":
      return "#8b5cf6";
    case "delivered":
      return "#10b981";
    case "cancelled":
      return "#ef4444";
    case "returned":
      return "#6b7280";
    default:
      return "#666";
  }
}

export default Orders;

