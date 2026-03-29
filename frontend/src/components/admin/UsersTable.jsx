import React, { useEffect, useState } from "react";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const promoteUser = async (id) => {
    if (!window.confirm("Are you sure you want to promote this user to Admin?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/make-admin`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("User promoted to Admin successfully");
        fetchUsers();
      } else {
        showToast("Failed to promote user", "error");
      }
    } catch (err) {
      showToast("Server Error", "error");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("User deleted successfully");
        setUsers(users.filter(u => u._id !== id));
      } else {
        showToast("Failed to delete user", "error");
      }
    } catch (err) {
      showToast("Server Error", "error");
    }
  };

  if (loading) return <div style={{color: 'var(--admin-text-muted)'}}>Loading users...</div>;

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>User Management</h2>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center'}}>No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: "4px", 
                      fontSize: "0.75rem", 
                      fontWeight: "bold",
                      backgroundColor: user.isAdmin ? "var(--admin-primary)" : "var(--admin-border)",
                      color: "white"
                    }}>
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      {!user.isAdmin && (
                        <button className="admin-btn" onClick={() => promoteUser(user._id)}>
                          Make Admin
                        </button>
                      )}
                      <button className="admin-btn admin-btn-danger" onClick={() => deleteUser(user._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
