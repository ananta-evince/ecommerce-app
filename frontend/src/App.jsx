import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider } from "./components/ToastContainer";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ScrollToTop from "./components/ScrollToTop";
import LoginPopupWrapper from "./components/LoginPopupWrapper";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Addresses from "./pages/Addresses";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Policy from "./pages/Policy";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <BrowserRouter>
            <ScrollToTop />
            <LoginPopupWrapper />
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              
              {/* Public Pages */}
              <Route path="/home" element={<PublicRoute><Home /></PublicRoute>} />
              <Route path="/products" element={<PublicRoute><Products /></PublicRoute>} />
              <Route path="/product/:id" element={<PublicRoute><ProductDetails /></PublicRoute>} />
              <Route path="/search" element={<PublicRoute><Search /></PublicRoute>} />
              <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
              <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
              <Route path="/privacy-policy" element={<PublicRoute><Policy /></PublicRoute>} />
              <Route path="/terms" element={<PublicRoute><Policy /></PublicRoute>} />
              <Route path="/returns" element={<PublicRoute><Policy /></PublicRoute>} />
              <Route path="/shipping" element={<PublicRoute><Policy /></PublicRoute>} />
              
              {/* Authentication Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ResetPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected Pages */}
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/order-success/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
              <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              <Route path="/account/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/account/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
              <Route path="/account/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

              {/* Admin (role-protected) */}
              <Route path="/admin" element={<RoleProtectedRoute allowedRoles={["admin"]}><AdminLayout /></RoleProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Routes>
          </BrowserRouter>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
