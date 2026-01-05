import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function Navbar({ onSearch }) {
  const { logout, user } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (!event.target.closest('.mobile-menu-toggle')) {
          setMobileMenuOpen(false);
        }
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    } else if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const cartCount = getCartCount();

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="navbar-container">
          <div className="navbar-left">
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
            <Link to="/home" className="navbar-logo-link">
              <img 
                src="/logo.png" 
                alt="ShopSwift" 
                className="navbar-logo-image"
              />
            </Link>
          </div>

          <div className="navbar-menu">
            <Link to="/home" className="nav-menu-item active">Home</Link>
            <Link to="/products" className="nav-menu-item">Products</Link>
            <div className="nav-dropdown">
              <button className="nav-menu-item">Categories</button>
              <div className="dropdown-content">
                <Link to="/category/men">Men</Link>
                <Link to="/category/girls">Women</Link>
                <Link to="/category/kids">Kids</Link>
                <Link to="/products">All Products</Link>
              </div>
            </div>
            <Link to="/about" className="nav-menu-item">About</Link>
            <Link to="/contact" className="nav-menu-item">Contact</Link>
          </div>

          <form className={`navbar-search ${searchOpen ? 'search-open' : ''}`} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>

          <div className="navbar-actions">
            <button 
              className="mobile-search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <Link to="/cart" className="cart-link">
              <div className="cart-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
            </Link>
            {user ? (
              <div className="account-menu">
                <Link to="/account" className="account-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Account</span>
                </Link>
                <button onClick={handleLogout} className="logout-button">
                  <span className="logout-text">Logout</span>
                  <svg className="logout-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} ref={menuRef}>
        <div className="mobile-menu-content">
          <div className="mobile-user-info">
            <span className="user-greeting">Hello, {user?.name || "User"}</span>
          </div>
          <div className="mobile-nav-menu">
            <Link to="/home" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link to="/about" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;

