import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';

export default function UserManager() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/users').then(res => setUsers(res.data)).catch(console.error);
  }, []);

  const toggleSuspension = async (id, currentStatus) => {
    await axios.put(`/api/admin/users/${id}/suspend`, { isSuspended: !currentStatus });
    setUsers(users.map(u => u._id === id ? { ...u, isSuspended: !currentStatus } : u));
  };

  return (
    <div className="admin-container-block">
      <h2>👥 Registered Users</h2>
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: 'var(--border)' }}>
            <th style={{ padding: '12px' }}>Name</th>
            <th style={{ padding: '12px' }}>Email</th>
            <th style={{ padding: '12px' }}>Joined</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px' }}>{user.name}</td>
              <td style={{ padding: '12px' }}>{user.email}</td>
              <td style={{ padding: '12px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: '12px' }}>{user.isSuspended ? 'Suspended' : 'Active'}</td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => toggleSuspension(user._id, user.isSuspended)}>
                  {user.isSuspended ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
