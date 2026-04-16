import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';

export default function RevenueReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/admin/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{padding: '20px'}}>Loading Revenue Reports...</div>;
  if (!data) return <div style={{padding: '20px'}}>Failed to load data.</div>;

  // Max value for scaling
  const maxRevenue = data.dailySalesAggr && data.dailySalesAggr.length > 0
    ? Math.max(...data.dailySalesAggr.map(d => d.revenue))
    : 100;

  return (
    <div className="admin-container-block">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>📊 Global Revenue & Reports</h2>
        <button className="ripple-btn" onClick={() => window.print()} style={{ padding: '8px 16px' }}>Export PDF</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="col-amount">${data.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{data.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Active Shopkeepers</h3>
          <p>{data.totalShopkeepers}</p>
        </div>
        <div className="stat-card">
          <h3>Registered Users</h3>
          <p>{data.totalUsers}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 style={{ marginBottom: '20px', color: 'var(--text)' }}>Last 30 Days Revenue</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', flexGrow: 1, gap: '4px', overflowX: 'auto', paddingBottom: '10px' }}>
            {data.dailySalesAggr?.length > 0 ? data.dailySalesAggr.map(item => (
              <div key={item._id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', background: 'var(--primary)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', height: `${(item.revenue / maxRevenue) * 300}px`, minHeight: '5px' }} title={`$${item.revenue} on ${item._id}`}></div>
                <div style={{ fontSize: '10px', marginTop: '5px', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>{item._id.substring(5)}</div>
              </div>
            )) : <p>No revenue data in last 30 days</p>}
          </div>
        </div>

        <div className="chart-card">
          <h3 style={{ marginBottom: '20px', color: 'var(--text)' }}>Orders by Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {data.ordersByStatus?.length > 0 ? data.ordersByStatus.map(status => {
              const colors = { pending: 'orange', confirmed: 'blue', picked_up: 'purple', on_the_way: 'cyan', delivered: 'green', cancelled: 'red' };
              const color = colors[status._id] || 'gray';
              return (
                <div key={status._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', textTransform: 'capitalize' }}>
                    <span>{status._id.replace('_', ' ')}</span>
                    <span style={{ fontWeight: 'bold' }}>{status.count}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px' }}>
                    <div style={{ width: `${(status.count / data.totalOrders) * 100}%`, height: '100%', background: color, borderRadius: '4px' }}></div>
                  </div>
                </div>
              );
            }) : <p>No orders yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
