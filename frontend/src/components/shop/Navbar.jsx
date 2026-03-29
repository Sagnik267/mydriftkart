import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import "./Components.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${search}`);
  };

  return (
    <nav className="site-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="logo-icon">🏎️</span>
          <h2>DriftKart</h2>
        </Link>
        
        <form className="navbar-search" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="navbar-links">
          <Link to="/shop" className="nav-link">Shop</Link>
          
          <Link to="/cart" className="nav-link cart-icon-wrapper">
            🛒 <span className="cart-badge">{cartCount}</span>
          </Link>
          
          {user ? (
            <div className="nav-dropdown">
              <span className="nav-link user-greeting">Hi, {user.name.split(" ")[0]} ▾</span>
              <div className="dropdown-menu">
                <Link to="/profile">Profile</Link>
                <Link to="/orders">My Orders</Link>
                {user.isAdmin && <Link to="/admin">Admin Panel</Link>}
                <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-btn-login">Login / Register</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
