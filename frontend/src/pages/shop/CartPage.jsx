import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";
import Toast from "../../components/shop/Toast";
import { CartContext } from "../../context/CartContext";
import "./Pages.css";

export default function CartPage() {
  const { cartItems, updateQuantity, removeCartItem, clearCart } = useContext(CartContext);
  const [toast, setToast] = useState(null);

  const handleQtyChange = async (productId, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) return setToast({ msg: `Only ${stock} units available`, type: "error" });
    
    const res = await updateQuantity(productId, newQty);
    if (res.error) setToast({ msg: res.error, type: "error" });
  };

  const handleRemove = async (productId) => {
    const res = await removeCartItem(productId);
    if (!res.error) setToast({ msg: "Item removed", type: "success" });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="cart-container">
        <h1 className="section-title">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div style={{textAlign:'center', marginTop:'3rem'}}>
             <h2 style={{color: 'var(--shop-navy)', marginBottom:'1rem'}}>Your cart is currently empty.</h2>
             <Link to="/shop" className="hero-btn">Return to Shop</Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {cartItems.map(item => {
                const prod = item.product;
                if (!prod) return null; // Edge case
                return (
                  <div className="cart-item" key={prod._id}>
                    <img src={prod.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"} alt={prod.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <Link to={`/product/${prod._id}`} style={{textDecoration:'none', color:'inherit'}}>
                        <h4>{prod.name}</h4>
                      </Link>
                      <div className="cart-item-price">₹{prod.price}</div>
                    </div>
                    <div className="cart-item-controls">
                      <button className="page-btn" onClick={() => handleQtyChange(prod._id, item.quantity - 1, prod.stock)}>-</button>
                      <span style={{fontWeight:600, width:'30px', textAlign:'center'}}>{item.quantity}</span>
                      <button className="page-btn" onClick={() => handleQtyChange(prod._id, item.quantity + 1, prod.stock)}>+</button>
                      <button className="btn-icon" onClick={() => handleRemove(prod._id)}>🗑️</button>
                    </div>
                  </div>
                );
              })}
              <button 
                onClick={clearCart} 
                style={{alignSelf: 'flex-start', background:'none', color:'var(--shop-danger)', border:'none', cursor:'pointer', fontWeight:600}}
              >
                Clear Cart
              </button>
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items ({cartItems.reduce((a,c)=>a+c.quantity, 0)})</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-total summary-row">
                <span>Total</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
            </div>
          </div>
        )}
      </div>

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
