import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', targetRole: 'all', isBanner: false });

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = () => {
    axios.get('/api/admin/notifications').then(res => setNotifications(res.data)).catch(console.error);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/notifications', form);
      setForm({ title: '', message: '', targetRole: 'all', isBanner: false });
      fetchNotifs();
      alert('Notification broadcasted!');
    } catch (err) {
      alert('Failed to send notification');
    }
  };

  return (
    <div className="admin-container-block">
      <h2>📢 Global Notifications</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3>Create New Broadcast</h3>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            <input type="text" placeholder="Notification Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={{ padding: '8px' }} />
            <textarea placeholder="Message body..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required style={{ padding: '8px', minHeight: '100px' }} />
            <select value={form.targetRole} onChange={e => setForm({...form, targetRole: e.target.value})} style={{ padding: '8px' }}>
              <option value="all">Broadcast to All</option>
              <option value="user">Customers Only</option>
              <option value="shopkeeper">Shopkeepers Only</option>
              <option value="agent">Delivery Agents Only</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={form.isBanner} onChange={e => setForm({...form, isBanner: e.target.checked})} />
              Display as App-Wide Banner
            </label>
            <button type="submit" className="ripple-btn">Send Broadcast</button>
          </form>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3>Broadcast History</h3>
          <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.map(n => (
              <div key={n._id} style={{ padding: '10px', borderLeft: '4px solid var(--primary)', background: 'rgba(255,255,255,0.05)' }}>
                <strong>{n.title}</strong>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>{n.message}</p>
                <small style={{ color: 'gray' }}>To: {n.targetRole} • {new Date(n.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
