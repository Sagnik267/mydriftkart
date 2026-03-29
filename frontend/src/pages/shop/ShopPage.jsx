import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";
import ProductCard from "../../components/shop/ProductCard";
import Loader from "../../components/shop/Loader";
import Toast from "../../components/shop/Toast";
import { CartContext } from "../../context/CartContext";
import "./Pages.css";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("asc");

  const { addToCart } = useContext(CartContext);
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("/api/products/categories");
        setCategories(res.data);
      } catch (err) {}
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = `/api/products?page=${page}&limit=12&sort=${sort}${searchQuery ? `&search=${searchQuery}` : ""}${categoryQuery ? `&category=${categoryQuery}` : ""}`;
        const res = await axios.get(url);
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setToast({ msg: "Failed to load products", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, sort, searchQuery, categoryQuery]);

  const handleAddToCart = async (id) => {
    const res = await addToCart(id, 1);
    if (res.error) setToast({ msg: res.error, type: "error" });
    else setToast({ msg: "Added to cart!", type: "success" });
  };

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(location.search);
    if (cat) params.set("category", cat);
    else params.delete("category");
    params.delete("page");
    setPage(1);
    navigate(`/shop?${params.toString()}`);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="shop-container">
        <h1 className="section-title">
          {searchQuery ? `Search Results: "${searchQuery}"` : categoryQuery ? `Category: ${categoryQuery}` : "All Products"}
        </h1>

        <div className="shop-filters">
          <div className="category-chips" style={{marginBottom: 0}}>
            <button className={`chip ${!categoryQuery ? "active" : ""}`} onClick={() => handleCategoryChange("")}>All</button>
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`chip ${categoryQuery === cat ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <select className="filter-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>

        {loading ? <Loader /> : (
          <>
            {products.length === 0 ? (
              <div style={{textAlign: "center", marginTop: "3rem", fontSize: "1.25rem", color: "var(--shop-text-muted)"}}>
                No products found matching your criteria.
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-btn" 
                  disabled={page === 1} 
                  onClick={() => window.scrollTo(0,0) || setPage(p => p - 1)}
                >
                  &larr; Prev
                </button>
                <span style={{fontWeight: 600}}>Page {page} of {totalPages}</span>
                <button 
                  className="page-btn" 
                  disabled={page === totalPages} 
                  onClick={() => window.scrollTo(0,0) || setPage(p => p + 1)}
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
