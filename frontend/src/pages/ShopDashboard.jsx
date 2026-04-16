import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "./Shopkeeper.css";
import FleetTrackerMap from "../components/FleetTrackerMap";
import ShopLocationManager from "../components/shop/ShopLocationManager";

const initialProducts = [
  { id: 1, name: "Basmati Rice", price: 85, stock: 50, category: "Grocery" },
  { id: 2, name: "Amul Milk 500ml", price: 28, stock: 30, category: "Dairy" },
  { id: 3, name: "Sugar 1kg", price: 44, stock: 20, category: "Grocery" },
];

const mockOrders = [
  { id: "#001", product: "Rice", qty: 2, total: 170, customer: "Rahul", status: "Pending" },
  { id: "#002", product: "Milk", qty: 3, total: 84, customer: "Priya", status: "Delivered" },
  { id: "#003", product: "Sugar", qty: 1, total: 44, customer: "Amit", status: "Pending" },
];

export default function ShopDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ myProducts: 0, myOrders: 0, myRevenue: 0, pendingOrders: 0 });
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", category: "", description: "Standard description" });
  const [shop, setShop] = useState({ shop: "Your Shop" });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get Shop Profile
      const meRes = await axios.get("/api/auth/me");
      setShop({ shop: meRes.data.name }); // shopkeeper owner name
      
      const statsRes = await axios.get("/api/shop/dashboard");
      setStats(statsRes.data);

      const prodsRes = await axios.get("/api/shop/products");
      setProducts(prodsRes.data);

      const ordersRes = await axios.get("/api/shop/orders");
      setOrders(ordersRes.data);

    } catch (err) {
      if(err.response?.status === 401 || err.response?.status === 403) {
        navigate("/shop/login");
      }
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert("Fill name and price");
    
    const numPrice = Number(newProduct.price);
    const numStock = Number(newProduct.stock);
    
    if (isNaN(numPrice) || isNaN(numStock)) {
      return alert("Price and Stock must be strictly numeric values");
    }

    try {
      const res = await axios.post("/api/shop/products", {
        ...newProduct,
        price: numPrice,
        stock: numStock,
        description: newProduct.description || "Standard Item Description"
      });
      setProducts(p => [...p, res.data]);
      setStats(s => ({...s, myProducts: s.myProducts + 1}));
      setNewProduct({ name: "", price: "", stock: "", category: "", description: "Standard Item Description" });
      setShowAdd(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/shop/products/${id}`);
      setProducts(p => p.filter(p => p._id !== id));
      setStats(s => ({...s, myProducts: s.myProducts - 1}));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const toggleOrder = async (id, currentStatus) => {
    const nextStatus = currentStatus === "pending" ? "delivered" : "pending";
    try {
      await axios.put(`/api/shop/orders/${id}/status`, { status: nextStatus });
      setOrders(o => o.map(order => order._id === id ? { ...order, status: nextStatus } : order));
      fetchDashboardData(); // Refresh stats
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  return (
    <div className="shop-wrapper">
      {/* Top Nav */}
      <nav className="shop-dash-nav">
        <div style={{display:'flex', alignItems:'center', gap:'var(--space-3)'}}>
          <div className="shop-icon-box" style={{width:'40px', height:'40px', fontSize:'1.2rem'}}>🏪</div>
          <div className="shop-dash-user">
            <span className="shop-dash-name">{shop.shop}</span>
            <span className="shop-dash-role">Shopkeeper Dashboard</span>
          </div>
        </div>
        <button
          onClick={() => { localStorage.removeItem("shopkeeper"); navigate("/shop/login"); }}
          className="shop-dash-logout"
        >
          Logout
        </button>
      </nav>

      {/* Tabs */}
      <div className="shop-dash-tabs">
        {["overview", "products", "orders", "location", "fleet"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shop-tab-btn ${tab === t ? "active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      <main className="shop-dash-content">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <h2 className="shop-dash-header">Overview</h2>
            <div className="stat-grid">
              {[
                ["📦", "Total Products", stats.myProducts, "var(--primary)"],
                ["🕐", "Pending Orders", stats.pendingOrders, "#f59e0b"],
                ["💰", "Revenue", `₹${stats.myRevenue}`, "#10b981"],
              ].map(([icon, label, val, color]) => (
                <div key={label} className="stat-card">
                  <div className="stat-icon">{icon}</div>
                  <div className="stat-val" style={{color}}>{val}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <h3 style={{fontFamily:'var(--font-display)', fontSize:'1.25rem', marginBottom:'var(--space-4)'}}>Recent Orders</h3>
            <div className="list-container">
              {orders.slice(0, 3).map(o => (
                <div key={o._id} className="list-item-card">
                  <div>
                    <span style={{fontWeight:600}}>{o.items.length > 0 ? o.items[0].product?.name : 'Items'}</span>
                    <span style={{color:'var(--text-muted)', fontSize:'0.85rem', marginLeft:'var(--space-2)'}}>by {o.user?.name || o.customer}</span>
                  </div>
                  <span className={`item-badge ${o.status.toLowerCase()}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === "products" && (
          <div>
            <div className="shop-dash-header">
              <h2>My Products</h2>
              <button onClick={() => setShowAdd(!showAdd)} className="shop-btn-primary" style={{marginTop:0, padding:'8px 16px', fontSize:'0.9rem'}}>
                + Add Product
              </button>
            </div>

            {showAdd && (
              <div className="add-product-panel">
                <h3 style={{marginBottom:'var(--space-4)'}}>New Product</h3>
                <div className="add-product-grid">
                  {[["Product Name", "name", "text"], ["Price (₹)", "price", "number"], ["Stock (qty)", "stock", "number"], ["Category", "category", "text"]].map(([ph, key, type]) => (
                    <input key={key} type={type} placeholder={ph} value={newProduct[key]}
                      onChange={e => setNewProduct(p => ({ ...p, [key]: e.target.value }))}
                      className="shop-input"
                    />
                  ))}
                </div>
                <div style={{display:'flex', gap:'var(--space-3)'}}>
                  <button onClick={addProduct} className="shop-btn-primary" style={{margin:0, flex:1}}>Add Product</button>
                  <button onClick={() => setShowAdd(false)} className="action-btn-danger" style={{flex:1, border:'1px solid var(--border)', color:'var(--text-muted)'}}>Cancel</button>
                </div>
              </div>
            )}

            <div className="list-container">
              {products.map(p => (
                <div key={p.id} className="list-item-card" style={{alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700, fontSize:'1.1rem'}}>{p.name}</div>
                    <div style={{color:'var(--text-muted)', fontSize:'0.85rem', marginTop:'2px'}}>{p.category} &middot; Stock: {p.stock}</div>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'var(--space-6)'}}>
                    <span style={{color:'var(--primary)', fontWeight:800, fontSize:'1.25rem'}}>₹{p.price}</span>
                    <button onClick={() => deleteProduct(p.id)} className="action-btn-danger">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

          {/* ORDERS */}
        {tab === "orders" && (
          <div>
            <h2 className="shop-dash-header">Orders</h2>
            <div className="list-container">
              {orders.map(o => (
                <div key={o._id} className="list-item-card" style={{flexDirection:'column', alignItems:'stretch', gap:'var(--space-3)', padding:'var(--space-5)'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                    <div>
                      <span style={{fontWeight:800, fontSize:'1.1rem'}}>{o._id.substring(o._id.length - 6).toUpperCase()}</span>
                      <span style={{color:'var(--text-muted)', marginLeft:'var(--space-2)'}}>{o.items.length > 0 ? o.items[0].product?.name : 'Items'} &times; {o.items.length > 0 ? o.items[0].quantity : 1}</span>
                    </div>
                    <span style={{color:'#10b981', fontWeight:800, fontSize:'1.1rem'}}>₹{o.totalAmount || o.total}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--border)', paddingTop:'var(--space-3)'}}>
                    <span style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>Customer: <strong style={{color:'var(--text)'}}>{o.user?.name || o.customer}</strong></span>
                    <button onClick={() => toggleOrder(o._id, o.status)}
                      className={`item-badge ${o.status.toLowerCase()}`}
                      style={{cursor:'pointer', border:'none', outline:'none', fontSize:'0.85rem', padding:'6px 16px', transition:'all var(--transition-fast)'}}
                    >
                      {o.status} {o.status === "pending" ? "→ Mark Delivered" : (o.status === "delivered" ? "→ Mark Pending" : "✓")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOCATION */}
        {tab === "location" && (
          <ShopLocationManager shopName={shop.shop} />
        )}

        {/* FLEET TRACKING */}
        {tab === "fleet" && (
          <div>
            <h2 className="shop-dash-header">Fleet Tracking Map</h2>
            <p style={{marginBottom: '1rem', color: 'var(--text-secondary)'}}>Live tracking of your assigned delivery agents.</p>
            <FleetTrackerMap role="shopkeeper" />
          </div>
        )}
      </main>
    </div>
  );
}