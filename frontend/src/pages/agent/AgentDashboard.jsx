import React, { useEffect, useState, useRef } from 'react';
import axios from '../../axiosConfig';
import { io } from 'socket.io-client';

export default function AgentDashboard() {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [logs, setLogs] = useState([]);
  const timerRef = useRef(null);
  
  const agentStr = localStorage.getItem("agent");
  const agent = agentStr ? JSON.parse(agentStr) : null;

  useEffect(() => {
    fetchDeliveries();
    
    // Connect Socket
    const token = localStorage.getItem("token");
    const newSocket = io("http://localhost:5000", {
      auth: { token }
    });

    newSocket.on("connect", () => {
      addLog("Connected to tracking server");
    });

    newSocket.on("connect_error", (err) => {
      addLog(`Connection error: ${err.message}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get("/api/agent/deliveries");
      setOrders(res.data);
    } catch (err) {
      addLog("Failed to fetch assigned deliveries.");
    }
  };

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/agent/deliveries/${orderId}/status`, { status });
      addLog(`Order ${orderId} marked as ${status}`);
      fetchDeliveries();
    } catch (err) {
      addLog("Failed to update status");
    }
  };

  // MOCK TRACKING SIMULATOR
  // Since we can't easily walk around with the laptop, we simulate movement
  const toggleTracking = () => {
    if (tracking) {
      clearInterval(timerRef.current);
      setTracking(false);
      addLog("Stopped broadcasting location.");
    } else {
      setTracking(true);
      addLog("Started tracking! Simulating movement...");
      
      // Start somewhere in Mumbai
      let currentLat = 19.0760;
      let currentLng = 72.8777;

      timerRef.current = setInterval(() => {
        // Move slightly northeast
        currentLat += 0.0001 + (Math.random() * 0.0001);
        currentLng += 0.0001 + (Math.random() * 0.0001);

        // Ping socket for ALL active orders on the way
        const activeOrders = orders.filter(o => o.status === 'on_the_way');
        
        if (socket && activeOrders.length > 0) {
          activeOrders.forEach(o => {
            socket.emit("agentLocationUpdate", {
              lat: currentLat,
              lng: currentLng,
              orderId: o._id,
              // MOCK shopId to broadcast to fleet manager
              shopId: o.items[0]?.product?.shopkeeper || null
            });
          });
          addLog(`Broadcasted loc to ${activeOrders.length} orders`);
        } else if (socket) {
           // Broadcast generally to show up on global maps even if not strictly on the way to a specific customer yet
           socket.emit("agentLocationUpdate", {
            lat: currentLat,
            lng: currentLng
          });
          addLog(`Broadcasted idle loc: ${currentLat.toFixed(4)}, ${currentLng.toFixed(4)}`);
        }
      }, 3000);
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#0d1117', color: '#fff', minHeight: '100vh', fontFamily: 'Inter' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#fbbf24' }}>Agent Dashboard</h1>
          <p>Welcome, {agent?.name}</p>
        </div>
        <button 
          onClick={toggleTracking}
          style={{ 
            padding: '1rem 2rem', 
            background: tracking ? '#ef4444' : '#10b981', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          {tracking ? '🛑 Stop Tracking' : '📍 Start Location Tracking'}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <h2>Assigned Deliveries</h2>
          {orders.length === 0 ? (
            <div style={{ padding: '2rem', background: '#1c1c24', borderRadius: '8px', marginTop: '1rem' }}>
              No active deliveries right now. Take a break!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {orders.map(o => (
                <div key={o._id} style={{ padding: '1.5rem', background: '#1c1c24', borderRadius: '8px', borderLeft: '4px solid #fbbf24' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Order #{o._id.substring(0,6)}</h3>
                    <span style={{ padding: '0.25rem 0.5rem', background: '#3b82f6', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {o.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p style={{ margin: '0.5rem 0', color: '#9ca3af' }}>Customer: {o.user?.name} | {o.user?.phone}</p>
                  <p style={{ margin: '0.5rem 0', color: '#9ca3af' }}>Items: {o.items.reduce((s, i) => s + i.quantity, 0)}</p>
                  
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {o.status === 'confirmed' && (
                      <button onClick={() => updateStatus(o._id, 'picked_up')} style={btnStyle('#fbbf24')}>Mark Picked Up</button>
                    )}
                    {(o.status === 'confirmed' || o.status === 'picked_up') && (
                      <button onClick={() => updateStatus(o._id, 'on_the_way')} style={btnStyle('#3b82f6')}>Out for Delivery</button>
                    )}
                    {o.status === 'on_the_way' && (
                      <button onClick={() => updateStatus(o._id, 'delivered')} style={btnStyle('#10b981')}>Mark Delivered</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#1c1c24', padding: '1.5rem', borderRadius: '8px', maxHeight: '500px', overflowY: 'auto' }}>
          <h3>Tracking Logs</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
            {logs.map((L, i) => (
              <li key={i} style={{ borderBottom: '1px solid #333', padding: '0.5rem 0', fontSize: '0.85rem', color: '#d1d5db' }}>{L}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const btnStyle = (bg) => ({
  flex: 1, padding: '0.5rem', border: 'none', borderRadius: '4px', background: bg, color: '#000', fontWeight: 'bold', cursor: 'pointer'
});
