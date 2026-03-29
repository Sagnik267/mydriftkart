import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get("/api/cart");
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (productId, quantity = 1) => {
    if (!token) return { error: "Please login first" };
    try {
      const res = await axios.post("/api/cart", { productId, quantity });
      setCartItems(res.data.items || []);
      return { success: true };
    } catch (err) {
      return { error: err.response?.data?.message || "Failed to add" };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await axios.put(`/api/cart/${productId}`, { quantity });
      setCartItems(res.data.items || []);
      return { success: true };
    } catch (err) {
      return { error: err.response?.data?.message || "Failed to update" };
    }
  };

  const removeCartItem = async (productId) => {
    try {
      const res = await axios.delete(`/api/cart/${productId}`);
      setCartItems(res.data.items || []);
      return { success: true };
    } catch (err) {
      return { error: "Failed to remove item" };
    }
  };

  const clearCart = async () => {
    try {
      const res = await axios.delete("/api/cart");
      setCartItems(res.data.items || []);
      return { success: true };
    } catch (err) {
      return { error: "Failed to clear cart" };
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, loading, fetchCart, addToCart, updateQuantity, removeCartItem, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
