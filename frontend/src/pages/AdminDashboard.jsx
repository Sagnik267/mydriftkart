import React from "react";
import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./AdminDashboard.css";

// Admin Sub-pages
import OrdersManager from "../components/admin/OrdersManager";
import FleetTrackerMap from "../components/FleetTrackerMap";
import AgentManager from "../components/admin/AgentManager";
import UserManager from "../components/admin/UserManager";
import ShopManager from "../components/admin/ShopManager";
import ProductManager from "../components/admin/ProductManager";
import RevenueReports from "../components/admin/RevenueReports";
import NotificationsPanel from "../components/admin/NotificationsPanel";
import SettingsPanel from "../components/admin/SettingsPanel";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const menuItems = [
    { path: "", label: "📊 Revenue & Reports" },
    { path: "orders", label: "📦 Orders Management" },
    { path: "live", label: "🛵 Live Tracking" },
    { path: "agents", label: "🛴 Delivery Agents" },
    { path: "users", label: "👥 Users" },
    { path: "shops", label: "🏪 Shops" },
    { path: "products", label: "🛍️ Products" },
    { path: "notifications", label: "📢 Notifications" },
    { path: "settings", label: "⚙️ Settings" },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>DriftKart <span className="highlight">Super</span></h2>
        </div>
        <nav className="admin-nav">
          {menuItems.map(item => (
            <NavLink 
              key={item.path}
              to={`/admin/${item.path}`}
              end={item.path === ""}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h1>{menuItems.find(m => `/admin/${m.path}`.replace(/\/$/, '') === location.pathname.replace(/\/$/, ''))?.label?.slice(3) || "Dashboard"}</h1>
        </header>
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<RevenueReports />} />
            <Route path="/orders" element={<OrdersManager />} />
            <Route path="/live" element={<div style={{height:'70vh'}}><h2 style={{marginBottom:'1rem'}}>Live Deliveries</h2><FleetTrackerMap role="admin" /></div>} />
            <Route path="/agents" element={<AgentManager />} />
            <Route path="/users" element={<UserManager />} />
            <Route path="/shops" element={<ShopManager />} />
            <Route path="/products" element={<ProductManager />} />
            <Route path="/notifications" element={<NotificationsPanel />} />
            <Route path="/settings" element={<SettingsPanel />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
