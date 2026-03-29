import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";
import Loader from "../../components/shop/Loader";
import Toast from "../../components/shop/Toast";
import "./Pages.css";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        setToast({ msg: "Failed to load order details", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="page-wrapper"><Navbar /><Loader /></div>;
  if (!order) return <div className="page-wrapper"><Navbar /><h2 style={{textAlign:'center', marginTop:'3rem'}}>Order not found</h2></div>;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="cart-container" style={{maxWidth: '900px'}}>
        <Link to="/orders" style={{color:'var(--shop-primary)', textDecoration:'none', fontWeight:600}}>&larr; Back to Orders</Link>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', margin:'1rem 0 2rem 0', borderBottom:'1px solid var(--shop-border)', paddingBottom:'1rem'}}>
          <div>
            <h1 style={{margin:0, color:'var(--shop-navy)'}}>Order Details</h1>
            <span style={{color:'var(--shop-text-muted)', fontSize:'0.875rem'}}>#{order._id}</span>
          </div>
          <span className={`order-status status-${order.status}`} style={{fontSize:'1rem'}}>{order.status}</span>
        </div>

        <div className="cart-grid">
          <div>
            <h3 style={{marginTop:0, color:'var(--shop-navy)'}}>Items</h3>
            <div className="cart-items" style={{marginBottom:'2rem'}}>
              {order.items.map(item => (
                <div className="cart-item" key={item._id} style={{padding:'1rem'}}>
                  <img src={item.product?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"} alt={item.product?.name} className="cart-item-img" style={{width:'80px', height:'80px'}} />
                  <div className="cart-item-info">
                    <Link to={`/product/${item.product?._id}`} style={{textDecoration:'none', color:'inherit', fontWeight:600}}>{item.product?.name || "Deleted Product"}</Link>
                    <div style={{color:'var(--shop-text-muted)', marginTop:'0.25rem'}}>Qty: {item.quantity} × ₹{item.price}</div>
                  </div>
                  <div style={{fontWeight:700, fontSize:'1.125rem'}}>₹{item.quantity * item.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
            <div className="cart-summary" style={{position:'static', padding:'1.5rem'}}>
              <h3 style={{marginTop:0}}>Order Summary</h3>
              <div className="summary-row">
                <span>Items Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-total summary-row">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
              <div style={{marginTop:'1.5rem', paddingTop:'1.5rem', borderTop:'1px solid #cbd5e1'}}>
                <h4 style={{margin:'0 0 0.5rem 0'}}>Payment Method</h4>
                <div style={{color:'var(--shop-text-muted)'}}>{order.paymentMethod}</div>
              </div>
            </div>

            <div className="cart-summary" style={{position:'static', padding:'1.5rem'}}>
              <h3 style={{marginTop:0}}>Shipping Address</h3>
              <div style={{color:'var(--shop-text-muted)', lineHeight:1.6}}>
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                Pincode: {order.shippingAddress?.pincode}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
