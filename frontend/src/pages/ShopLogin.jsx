import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "./Shopkeeper.css";

export default function ShopLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (phone && password) {
      try {
        const res = await axios.post("/api/auth/login/shopkeeper", { email: phone, password });
        if (res.data.role === 'shopkeeper') {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("shopkeeper", JSON.stringify({ phone, shop: res.data.name }));
          navigate("/shop/dashboard");
        } else {
          alert("Account is not authorized as a Shopkeeper.");
        }
      } catch (err) {
        alert(err.response?.data?.message || "Invalid credentials");
      }
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="shop-wrapper shop-auth-container">
      <div className="shop-logo-header">
        <div className="shop-icon-box">🏪</div>
        <h1 className="shop-logo-text">DriftKart <span className="shop-logo-highlight">for Shops</span></h1>
      </div>

      <div className="shop-auth-card">
        <h2 className="shop-auth-title">Shopkeeper Login</h2>

        <div style={{display:'flex', flexDirection:'column', gap:'var(--space-4)'}}>
          <div className="shop-input-wrapper">
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="shop-input"
            />
          </div>
          <div className="shop-input-wrapper">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="shop-input"
            />
          </div>
        </div>

        <button onClick={handleLogin} className="shop-btn-primary">
          Login &rarr;
        </button>

        <p className="shop-auth-footer">
          New shop?{" "}
          <span onClick={() => navigate("/shop/register")} className="shop-auth-link">
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}