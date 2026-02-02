import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";
import AdminPageHeader from "./AdminPageHeader";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const themeGreen = "#22c55e";
const themeGreenDark = "#16a34a";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-dashboard"><div className="admin-content"><div className="admin-loading">Loading dashboard...</div></div></div>;
  if (error) return <div className="admin-dashboard"><div className="admin-content"><div className="admin-error">{error}</div></div></div>;
  if (!stats) return null;

  return (
    <div className="admin-dashboard">
      <AdminPageHeader />
      <div className="admin-content">
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h3>Total Users</h3>
            <div className="value">{stats.userCount}</div>
          </div>
          <div className="admin-stat-card">
            <h3>Products</h3>
            <div className="value">{stats.productCount}</div>
          </div>
          <div className="admin-stat-card">
            <h3>Orders</h3>
            <div className="value">{stats.orderCount}</div>
          </div>
          <div className="admin-stat-card primary">
            <h3>Revenue (₹)</h3>
            <div className="value">{stats.totalRevenue?.toLocaleString() ?? 0}</div>
          </div>
        </div>

        <div className="admin-charts">
          <div className="admin-chart-card">
            <h3>Revenue (last 30 days)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={stats.revenueChart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v) => [`₹${v}`, "Revenue"]} labelFormatter={(l) => `Date: ${l}`} />
                <Line type="monotone" dataKey="amount" stroke={themeGreen} strokeWidth={2} dot={{ fill: themeGreen }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="admin-chart-card">
            <h3>Orders (last 30 days)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.ordersChart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill={themeGreen} name="Orders" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-chart-card">
          <h3>Orders by status</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
            {stats.orderStatusCounts &&
              Object.entries(stats.orderStatusCounts).map(([status, count]) => (
                <span
                  key={status}
                  style={{
                    background: "#f0fdf4",
                    color: themeGreenDark,
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {status}: {count}
                </span>
              ))}
            {(!stats.orderStatusCounts || Object.keys(stats.orderStatusCounts).length === 0) && (
              <span style={{ color: "#666" }}>No orders yet</span>
            )}
          </div>
        </div>

        <p style={{ marginTop: 24 }}>
          <Link to="/admin/orders" style={{ color: themeGreen, fontWeight: 600 }}>View all orders →</Link>
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
