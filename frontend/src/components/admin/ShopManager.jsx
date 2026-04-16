import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';

export default function ShopManager() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/shops').then(res => setShops(res.data)).catch(console.error);
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`/api/admin/shops/${id}/status`, { status });
    setShops(shops.map(s => s._id === id ? { ...s, status } : s));
  };

  return (
    <div className="admin-container-block">
      <h2>🏪 Shop Management</h2>
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: 'var(--border)' }}>
            <th style={{ padding: '12px' }}>Shop Name</th>
            <th style={{ padding: '12px' }}>Owner</th>
            <th style={{ padding: '12px' }}>Category</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shops.map(shop => (
            <tr key={shop._id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px' }}>{shop.name}</td>
              <td style={{ padding: '12px' }}>{shop.user?.name || 'N/A'}</td>
              <td style={{ padding: '12px' }}>{shop.category}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ color: shop.status === 'active' ? 'green' : shop.status === 'suspended' ? 'red' : 'orange' }}>
                  {shop.status}
                </span>
              </td>
              <td style={{ padding: '12px', display: 'flex', gap: '5px' }}>
                {shop.status === 'pending' && <button onClick={() => updateStatus(shop._id, 'active')}>Approve</button>}
                {shop.status !== 'suspended' && <button onClick={() => updateStatus(shop._id, 'suspended')} style={{ background: 'red', color: 'white' }}>Suspend</button>}
                {shop.status === 'suspended' && <button onClick={() => updateStatus(shop._id, 'active')} style={{ background: 'green', color: 'white' }}>Reactivate</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
