import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import "./Wishlist.css";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="wishlist-page">
      <Navbar />
      <div className="wishlist-container">
        <h1>My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <h2>Your wishlist is empty</h2>
            <p>Start adding products you love to your wishlist</p>
            <Link to="/products" className="shop-btn">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <p className="wishlist-count">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} in your wishlist</p>
            <div className="wishlist-grid">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Wishlist;

