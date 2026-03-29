import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Toast from "../../components/shop/Toast";
import Navbar from "../../components/shop/Navbar";
import "./Pages.css";

export default function ProfilePage() {
  const { user, fetchUserProfile } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [toast, setToast] = useState(null);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/user/profile", { name, email });
      setToast({ msg: "Profile updated successfully", type: "success" });
      fetchUserProfile();
    } catch (err) {
      setToast({ msg: "Failed to update profile", type: "error" });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/user/password", { oldPassword, newPassword });
      setToast({ msg: "Password updated successfully", type: "success" });
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setToast({ msg: err.response?.data?.message || "Failed to update password", type: "error" });
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="profile-container">
        <h1>My Profile</h1>
        
        <div className="profile-grid">
          <form className="profile-card" onSubmit={handleProfileUpdate}>
            <h3>Account Details</h3>
            <div className="auth-input-group">
              <label>Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="auth-input-group">
              <label>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button type="submit" className="auth-btn">Save Details</button>
          </form>

          <form className="profile-card" onSubmit={handlePasswordUpdate}>
            <h3>Change Password</h3>
            <div className="auth-input-group">
              <label>Current Password</label>
              <input type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
            </div>
            <div className="auth-input-group">
              <label>New Password</label>
              <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <button type="submit" className="auth-btn">Change Password</button>
          </form>
        </div>
      </div>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
