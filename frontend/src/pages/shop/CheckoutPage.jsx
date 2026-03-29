import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";
import Toast from "../../components/shop/Toast";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import "./Pages.css";

export default function CheckoutPage() {
  const { cartItems, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacingOrder(true);
    try {
      // Save address implicitly
      await axios.post("/api/user/address", address);

      const res = await axios.post("/api/orders", {
        shippingAddress: address,
        paymentMethod
      });
      
      await fetchCart(); // Cart is cleared now
      navigate(`/order/${res.data._id}`);
    } catch (err) {
      setToast({ msg: err.response?.data?.message || "Failed to place order", type: "error" });
      setPlacingOrder(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="cart-container" style={{maxWidth: '900px'}}>
        <h1 className="section-title">Checkout</h1>
        
        <form onSubmit={handlePlaceOrder}>
          <div className="cart-grid">
            
            <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
              <div className="profile-card">
                <h3>Shipping Address</h3>
                <div className="auth-input-group">
                  <label>Street Address</label>
                  <input type="text" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                </div>
                <div style={{display:'flex', gap:'1rem'}}>
                  <div className="auth-input-group" style={{flex:1}}>
                    <label>City</label>
                    <input type="text" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                  </div>
                  <div className="auth-input-group" style={{flex:1}}>
                    <label>State</label>
                    <input type="text" required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                  </div>
                  <div className="auth-input-group" style={{flex:1}}>
                    <label>Pincode</label>
                    <input type="text" required value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h3>Payment Method</h3>
                <div className="auth-input-group">
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <option value="COD">Cash On Delivery (COD)</option>
                    <option value="Online">Online Payment (Mock)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              <div className="summary-total summary-row">
                <span>Total</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              <button type="submit" className="checkout-btn" disabled={placingOrder}>
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>

          </div>
        </form>
      </div>

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
