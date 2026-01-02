import { createContext, useState, useContext, useEffect } from "react";
import API from "../api/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await API.get("/wishlist");
      setWishlist(res.data.map((item) => item.Product || item));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    if (!user) {
      alert("Please login to add items to wishlist");
      return;
    }
    try {
      await API.post("/wishlist", { productId: product.id });
      setWishlist((prev) => [...prev, product]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (error.response?.status === 400) {
        alert("Product already in wishlist");
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      await API.delete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const moveToCart = (product, addToCart) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        moveToCart,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

