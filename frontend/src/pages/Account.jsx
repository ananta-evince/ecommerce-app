import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Account.css";

function Account() {
  const { user } = useAuth();

  return (
    <div className="account-page">
      <Navbar />
      <div className="account-container">
        <div className="account-sidebar">
          <div className="account-profile">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <h3>{user?.name || "User"}</h3>
            <p>{user?.email || ""}</p>
          </div>
          <nav className="account-nav">
            <Link to="/account" className="nav-item active">Dashboard</Link>
            <Link to="/account/profile" className="nav-item">Profile</Link>
            <Link to="/account/orders" className="nav-item">Orders</Link>
            <Link to="/account/addresses" className="nav-item">Addresses</Link>
            <Link to="/wishlist" className="nav-item">Wishlist</Link>
          </nav>
        </div>

        <div className="account-content">
          <h1>Account Dashboard</h1>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <h3>Recent Orders</h3>
              <p>View and track your orders</p>
              <Link to="/account/orders" className="card-link">View Orders →</Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3>Wishlist</h3>
              <p>Your saved items</p>
              <Link to="/wishlist" className="card-link">View Wishlist →</Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3>Addresses</h3>
              <p>Manage your delivery addresses</p>
              <Link to="/account/addresses" className="card-link">Manage Addresses →</Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>Profile</h3>
              <p>Update your personal information</p>
              <Link to="/account/profile" className="card-link">Edit Profile →</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Account;

