import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AccountSidebar.css";

function AccountSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/account") {
      return location.pathname === "/account";
    }
    return location.pathname.startsWith(path);
  };

  const getPhotoUrl = () => {
    if (user?.profilePhoto) {
      return user.profilePhoto.startsWith('http') 
        ? user.profilePhoto 
        : `${import.meta.env.VITE_API_SERVER_URL || 'http://localhost:5000'}${user.profilePhoto}`;
    }
    return null;
  };

  return (
    <div className="account-sidebar">
      <div className="account-profile">
        <div className="profile-avatar">
          {getPhotoUrl() ? (
            <img src={getPhotoUrl()} alt={user?.name || "User"} />
          ) : (
            user?.name?.charAt(0).toUpperCase() || "U"
          )}
        </div>
        <h3>{user?.name || "User"}</h3>
        <p>{user?.email || ""}</p>
      </div>
      <nav className="account-nav">
        <Link 
          to="/account" 
          className={`nav-item ${isActive("/account") && location.pathname === "/account" ? "active" : ""}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/account/profile" 
          className={`nav-item ${isActive("/account/profile") ? "active" : ""}`}
        >
          Profile
        </Link>
        <Link 
          to="/account/orders" 
          className={`nav-item ${isActive("/account/orders") ? "active" : ""}`}
        >
          Orders
        </Link>
        <Link 
          to="/account/addresses" 
          className={`nav-item ${isActive("/account/addresses") ? "active" : ""}`}
        >
          Addresses
        </Link>
        <Link 
          to="/wishlist" 
          className="nav-item"
        >
          Wishlist
        </Link>
      </nav>
    </div>
  );
}

export default AccountSidebar;

