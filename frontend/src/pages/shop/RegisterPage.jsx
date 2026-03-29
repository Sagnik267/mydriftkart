import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Pages.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-input-group">
          <label>Name</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="auth-input-group">
          <label>Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="auth-input-group">
          <label>Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="auth-btn">Register</button>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
