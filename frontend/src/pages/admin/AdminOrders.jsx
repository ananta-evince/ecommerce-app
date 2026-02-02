import { useState, useEffect } from "react";
import API from "../../api/api";
import AdminPageHeader from "./AdminPageHeader";
import AdminMessageModal from "./AdminMessageModal";
import AdminPagination from "./AdminPagination";
import "./AdminOrders.css";

const LIMIT = 10;

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [messageModal, setMessageModal] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (statusFilter !== "all") params.status = statusFilter;
    API.get("/admin/orders", { params })
      .then((res) => {
        setOrders(Array.isArray(res.data?.orders) ? res.data.orders : []);
        setTotal(res.data?.total ?? 0);
        setTotalPages(res.data?.totalPages ?? 1);
      })
      .catch(() => {
        setOrders([]);
        setTotal(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleOrderStatusChange = (order, newStatus) => {
    API.put(`/admin/orders/${order.id}/status`, { orderStatus: newStatus })
      .then(() => fetchOrders())
      .catch((err) => setMessageModal({ title: "Error", message: err.response?.data?.error || "Update failed" }));
  };

  if (loading) return <div className="admin-orders"><div className="admin-content"><div className="admin-loading">Loading orders...</div></div></div>;

  return (
    <div className="admin-orders">
      <AdminPageHeader>
        <select
          className="admin-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </AdminPageHeader>
      <div className="admin-content">
        {messageModal && (
          <AdminMessageModal
            title={messageModal.title}
            message={messageModal.message}
            onClose={() => setMessageModal(null)}
          />
        )}
        <div className="admin-table-wrap">
          {orders.length === 0 ? (
            <div className="admin-empty">No orders found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Order Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>
                      {o.User ? (
                        <span>{o.User.name} ({o.User.email})</span>
                      ) : (
                        <span>User #{o.userId}</span>
                      )}
                    </td>
                    <td>₹{Number(o.totalAmount).toLocaleString()}</td>
                    <td>
                      <select
                        className="order-status-select"
                        value={o.orderStatus}
                        onChange={(e) => handleOrderStatusChange(o, e.target.value)}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>{o.paymentStatus}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {total > 0 && (
          <p className="admin-pagination-summary" style={{ marginTop: 16, marginBottom: 0 }}>
            Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} orders
          </p>
        )}
        {totalPages > 1 && (
          <AdminPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
