import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";
import ProductCard from "../../components/shop/ProductCard";
import Loader from "../../components/shop/Loader";
import Toast from "../../components/shop/Toast";
import { CartContext } from "../../context/CartContext";
import "./Pages.css";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get("/api/products?limit=8"),
          axios.get("/api/products/categories")
        ]);
        setProducts(prodRes.data.products);
        setCategories(catRes.data);
      } catch (err) {
        setToast({ msg: "Failed to load shop data", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleAddToCart = async (id) => {
    const res = await addToCart(id, 1);
    if (res.error) setToast({ msg: res.error, type: "error" });
    else setToast({ msg: "Added to cart!", type: "success" });
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <section className="hero-section">
        <h1>Gear Up Your Life with DriftKart</h1>
        <p>Discover the finest selection of premium products, unbeatable prices, and lightning-fast delivery.</p>
        <Link to="/shop" className="hero-btn">Shop Now</Link>
      </section>

      <div className="home-container">
        {loading ? <Loader /> : (
          <>
            <h2 className="section-title">Shop by Category</h2>
            <div className="category-chips">
              <Link to="/shop" className="chip active">All</Link>
              {categories.map(cat => (
                <Link to={`/shop?category=${cat}`} key={cat} className="chip">{cat}</Link>
              ))}
            </div>

            <h2 className="section-title">Featured Products</h2>
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </>
        )}
      </div>

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
