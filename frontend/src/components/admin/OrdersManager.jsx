import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import Toast from '../shop/Toast';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/admin/orders');
      setOrders(res.data);
    } catch (err) {
      setToast({ msg: "Failed to fetch orders", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark order as ${status}?`)) return;
    try {
      await axios.put(`/api/admin/orders/${id}/status`, { status });
      setToast({ msg: `Order ${id.substring(0,6)} marked as ${status}`, type: "success" });
      fetchOrders();
    } catch (err) {
      setToast({ msg: "Update failed", type: "error" });
    }
  };

  // Filtering
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o._id.includes(searchTerm) || o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? o.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="admin-container-block">
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search ID or Customer..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            className="admin-input"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="admin-select">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="picked_up">Picked Up</option>
          <option value="on_the_way">On The Way</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? <p>Loading orders...</p> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Agent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map(order => (
                <tr key={order._id}>
                  <td className="col-id">#{order._id.substring(0, 8)}...</td>
                  <td className="col-customer">{order.user?.name}</td>
                  <td className="col-time">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="col-amount">${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{order.deliveryAgent ? order.deliveryAgent.name : "Unassigned"}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    {order.status === 'pending' && <button className="btn-confirm" onClick={() => updateStatus(order._id, 'confirmed')}>Confirm</button>}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && <button className="btn-cancel" onClick={() => updateStatus(order._id, 'cancelled')}>Cancel</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button className="admin-btn-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} style={{padding:'8px 16px', borderRadius:'8px', cursor:'pointer'}}>Prev</button>
        <span style={{color:'var(--admin-text-muted)', display:'flex', alignItems:'center'}}>Page {currentPage} of {Math.ceil(filteredOrders.length / itemsPerPage) || 1}</span>
        <button className="admin-btn-secondary" disabled={currentPage >= Math.ceil(filteredOrders.length / itemsPerPage)} onClick={() => setCurrentPage(c => c + 1)} style={{padding:'8px 16px', borderRadius:'8px', cursor:'pointer'}}>Next</button>
      </div>

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
