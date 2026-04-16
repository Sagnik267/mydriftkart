import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Shop User Pages
import HomePage from "./pages/shop/HomePage";
import ShopPage from "./pages/shop/ShopPage";
import ProductDetailPage from "./pages/shop/ProductDetailPage";
import CartPage from "./pages/shop/CartPage";
import CheckoutPage from "./pages/shop/CheckoutPage";
import OrdersPage from "./pages/shop/OrdersPage";
import OrderDetailPage from "./pages/shop/OrderDetailPage";
import ProfilePage from "./pages/shop/ProfilePage";
import LoginPage from "./pages/shop/LoginPage";
import RegisterPage from "./pages/shop/RegisterPage";
import ProtectedRoute from "./components/shop/ProtectedRoute";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

// Shopkeeper/Vendor pages
import ShopLogin from "./pages/ShopLogin";
import ShopRegister from "./pages/ShopRegister";
import ShopDashboard from "./pages/ShopDashboard";
import ShopkeeperRoute from "./components/ShopkeeperRoute";

// Agent pages
import AgentLogin from "./pages/agent/AgentLogin";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentRoute from "./components/AgentRoute";

// 🔒 Protected Customer Routes
import LiveTrackingPage from "./pages/shop/LiveTrackingPage";

import NearbyShopsPage from "./pages/shop/NearbyShopsPage";
import ShopDetailPage from "./pages/shop/ShopDetailPage";


function App() {
  return (
    <Router>
      <Routes>
        {/* 🛒 Customer Shop Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:id" element={<ShopDetailPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔒 Protected Customer Routes */}
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/order/:id/track" element={<ProtectedRoute><LiveTrackingPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* 🏪 Shopkeeper Routes */}
        <Route path="/shop/login" element={<ShopLogin />} />
        <Route path="/shop/register" element={<ShopRegister />} />
        <Route path="/shop/dashboard" element={<ShopkeeperRoute><ShopDashboard /></ShopkeeperRoute>} />

        {/* 🛵 Delivery Agent Routes */}
        <Route path="/agent/login" element={<AgentLogin />} />
        <Route path="/agent/dashboard" element={<AgentRoute><AgentDashboard /></AgentRoute>} />

        {/* 🛡️ Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;