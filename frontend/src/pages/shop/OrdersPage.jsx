import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";
import Loader from "../../components/shop/Loader";
import Toast from "../../components/shop/Toast";
import "./Pages.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders/my");
        setOrders(res.data);
      } catch (err) {
        setToast({ msg: "Failed to load orders", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancel = async (id) => {
    try {
      await axios.put(`/api/orders/${id}/cancel`);
      setToast({ msg: "Order cancelled", type: "success" });
      setOrders(orders.map(o => o._id === id ? { ...o, status: "cancelled" } : o));
    } catch (err) {
      setToast({ msg: err.response?.data?.message || "Failed to cancel order", type: "error" });
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="cart-container" style={{maxWidth: '800px'}}>
        <h1 className="section-title">My Orders</h1>

        {loading ? <Loader /> : orders.length === 0 ? (
          <div style={{textAlign:'center', marginTop:'3rem', color:'var(--shop-text-muted)'}}>
            <h2>You haven't placed any orders yet.</h2>
            <Link to="/shop" className="hero-btn" style={{marginTop:'1rem'}}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column'}}>
            {orders.map(order => (
              <div className="order-card" key={order._id}>
                <div>
                  <div className="order-id">Order #{order._id}</div>
                  <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                  <span className={`order-status status-${order.status}`}>{order.status}</span>
                </div>
                <div className="order-amounts">
                  <div style={{color:'var(--shop-text-muted)', marginBottom:'0.5rem'}}>
                    {order.items.length} items
                  </div>
                  <strong>₹{order.totalAmount}</strong>
                  <div style={{marginTop:'1rem', display:'flex', gap:'1rem'}}>
                    <Link to={`/order/${order._id}`} className="page-btn" style={{textDecoration:'none'}}>View Details</Link>
                    {order.status === 'pending' && (
                      <button onClick={() => handleCancel(order._id)} className="page-btn" style={{color:'var(--shop-danger)'}}>Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
