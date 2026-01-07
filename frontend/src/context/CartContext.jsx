import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

const getInitialCart = () => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
        return [];
      }
    }
  }
  return [];
};

const getInitialDiscount = () => {
  if (typeof window !== "undefined") {
    const savedDiscount = localStorage.getItem("cartDiscount");
    if (savedDiscount) {
      try {
        const discountData = JSON.parse(savedDiscount);
        return {
          code: discountData.code || null,
          discount: discountData.discount || 0,
        };
      } catch (e) {
        console.error("Error parsing discount from localStorage:", e);
      }
    }
  }
  return { code: null, discount: 0 };
};

export const CartProvider = ({ children }) => {
  const initialCart = getInitialCart();
  const initialDiscount = getInitialDiscount();
  
  const [cart, setCart] = useState(initialCart);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState(initialDiscount.code);
  const [appliedDiscount, setAppliedDiscount] = useState(initialDiscount.discount);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedDiscountCode) {
      localStorage.setItem("cartDiscount", JSON.stringify({
        code: appliedDiscountCode,
        discount: appliedDiscount
      }));
    } else {
      localStorage.removeItem("cartDiscount");
    }
  }, [appliedDiscountCode, appliedDiscount]);

  const addToCart = (product, onError) => {
    let errorMessage = null;
    setCart((prevCart) => {
      const quantity = product.quantity || 1;
      const productVariants = product.selectedVariants || null;
      
      const existingItem = prevCart.find((item) => {
        if (item.id !== product.id) return false;
        const itemVariants = item.selectedVariants || null;
        if (!productVariants && !itemVariants) return true;
        if (!productVariants || !itemVariants) return false;
        return JSON.stringify(productVariants) === JSON.stringify(itemVariants);
      });
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (product.stock && newQuantity > product.stock) {
          errorMessage = `Only ${product.stock} items available in stock`;
          return prevCart;
        }
        return prevCart.map((item) => {
          if (item.id === product.id) {
            const itemVariants = item.selectedVariants || null;
            const variantsMatch = !productVariants && !itemVariants 
              ? true 
              : productVariants && itemVariants 
                ? JSON.stringify(productVariants) === JSON.stringify(itemVariants)
                : false;
            if (variantsMatch) {
              return { ...item, quantity: newQuantity };
            }
          }
          return item;
        });
      }
      
      if (product.stock && quantity > product.stock) {
        errorMessage = `Only ${product.stock} items available in stock`;
        return prevCart;
      }
      
      return [...prevCart, { ...product, quantity, selectedVariants: productVariants }];
    });
    if (errorMessage && onError) {
      onError(errorMessage);
    }
  };

  const removeFromCart = (productId, selectedVariants = null) => {
    setCart((prevCart) => {
      if (selectedVariants) {
        // Remove specific variant
        return prevCart.filter((item) => {
          if (item.id !== productId) return true;
          const itemVariants = item.selectedVariants || null;
          return JSON.stringify(itemVariants) !== JSON.stringify(selectedVariants);
        });
      }
      // Remove all variants of this product (backward compatibility)
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId, quantity, onError) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    let errorMessage = null;
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === productId);
      if (item && item.stock && quantity > item.stock) {
        errorMessage = `Only ${item.stock} items available in stock`;
        return prevCart;
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
    if (errorMessage && onError) {
      onError(errorMessage);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    // Clear discount when cart is cleared
    setAppliedDiscountCode(null);
    setAppliedDiscount(0);
    localStorage.removeItem("cartDiscount");
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const clearDiscount = () => {
    setAppliedDiscountCode(null);
    setAppliedDiscount(0);
    localStorage.removeItem("cartDiscount");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        appliedDiscountCode,
        appliedDiscount,
        setAppliedDiscountCode,
        setAppliedDiscount,
        clearDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

