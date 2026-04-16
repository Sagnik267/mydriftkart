import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "../Shopkeeper.css";

export default function AgentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email && password) {
      try {
        const res = await axios.post("/api/auth/login/agent", { email, password });
        if (res.data.role === 'agent') {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("agent", JSON.stringify({ email, name: res.data.name, id: res.data.id }));
          navigate("/agent/dashboard");
        } else {
          alert("Account is not authorized as a Delivery Agent.");
        }
      } catch (err) {
        alert(err.response?.data?.message || "Invalid credentials");
      }
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="shop-wrapper shop-auth-container" style={{background: '#0d1117'}}>
      <div className="shop-logo-header">
        <div className="shop-icon-box" style={{background: '#fbbf24', color: '#000'}}>🛵</div>
        <h1 className="shop-logo-text">DriftKart <span className="shop-logo-highlight" style={{color: '#fbbf24'}}>Fleet</span></h1>
      </div>

      <div className="shop-auth-card">
        <h2 className="shop-auth-title">Delivery Agent Login</h2>
        <div style={{display:'flex', flexDirection:'column', gap:'var(--space-4)'}}>
          <div className="shop-input-wrapper">
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Agent Email" className="shop-input" />
          </div>
          <div className="shop-input-wrapper">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="shop-input" />
          </div>
        </div>
        <button onClick={handleLogin} className="shop-btn-primary" style={{background: '#fbbf24', color: '#000'}}>
          Start Shift &rarr;
        </button>
      </div>
    </div>
  );
}
