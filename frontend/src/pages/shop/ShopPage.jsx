import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";
import ProductCard from "../../components/shop/ProductCard";
import SkeletonCard from "../../components/shop/SkeletonCard";
import StarRating from "../../components/shop/StarRating";
import Toast from "../../components/shop/Toast";
import { CartContext } from "../../context/CartContext";
import "./ShopPage.css";

// Helper to highlight search terms
const HighlightText = ({ text, highlight }) => {
  if (!highlight || !text) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? 
          <b key={i} className="highlight">{part}</b> : part
      )}
    </span>
  );
};

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("asc");

  // New UI states
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);

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
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
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

  // Local filtering hook
  const filteredProducts = products.filter(p => {
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (minRating > 0 && (p.avgRating || 0) < minRating) return false;
    return true;
  });

  return (
    <div className="page-wrapper" style={{ background: 'var(--surface-2)' }}>
      <Navbar />
      
      <div className="shop-layout">
        <button 
          className="mobile-sidebar-toggle" 
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        >
          <span>🎯 Filter & Sort</span>
          <span>{showMobileSidebar ? "▲" : "▼"}</span>
        </button>

        {/* SIDEBAR */}
        <aside className={`shop-sidebar ${showMobileSidebar ? 'open' : ''}`}>
          <div className="sidebar-header">Filters</div>
          
          <div className="filter-section">
            <div className="filter-title">Categories</div>
            <label className="custom-checkbox-label">
              <input 
                type="checkbox" 
                checked={!categoryQuery} 
                onChange={() => handleCategoryChange("")} 
              />
              <span className="checkmark"></span>
              All Products
            </label>
            {categories.map(cat => (
              <label key={cat._id} className="custom-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={categoryQuery === cat._id} 
                  onChange={() => handleCategoryChange(cat._id)} 
                />
                <span className="checkmark"></span>
                {cat.name}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <div className="filter-title">Price Range (₹)</div>
            <div className="price-slider-wrap">
              <div className="price-inputs">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice} 
                  onChange={e => setMinPrice(e.target.value)} 
                />
                <span>-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice} 
                  onChange={e => setMaxPrice(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-title">Minimum Rating</div>
            {[4, 3, 2, 1].map(r => (
              <label key={r} className="rating-filter-label" onClick={() => setMinRating(minRating === r ? 0 : r)}>
                <input 
                  type="checkbox" 
                  style={{ display: 'none' }} 
                  checked={minRating === r} 
                  readOnly 
                />
                <span className="checkmark" style={{ marginRight: '8px' }}></span>
                <StarRating rating={r} readonly /> & Up
              </label>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="shop-main">
          <div className="shop-top-bar">
            <div className="result-count">
              Showing <strong>{filteredProducts.length}</strong> results
              {searchQuery && <span> for "<strong>{searchQuery}</strong>"</span>}
            </div>
            
            <div className="top-bar-actions">
              <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>

              <div className="view-toggles">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  ▦
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={viewMode === 'grid' ? 'products-grid' : 'products-list-view'}>
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>We couldn't find anything matching your current filters.</p>
              <button 
                className="hero-btn-primary ripple-btn" 
                onClick={() => {
                  setMinPrice(""); setMaxPrice(""); setMinRating(0); handleCategoryChange("");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'products-grid' : 'products-list-view'}>
              {filteredProducts.map(product => {
                if (viewMode === 'grid') {
                  // Re-use standard ProductCard
                  // Using wrapper so we can pass HighlightText custom logic or keep as is.
                  // ProductCard takes a product object, we can't easily inject the highlight component without changing ProductCard source.
                  // For highlight, we'll just let ProductCard render standard, but maybe we can override name object?
                  // React components complain if we inject JSX into string. 
                  const pCopy = { ...product };
                  // If we simply pass it, it might not render JSX if expect String, but standard React handles JSX natively if not doing String ops inside.
                  // Let's modify ProductCard to accept string, wait, I can just map standard ProductCard for grid.
                  return <ProductCard key={product._id} product={product} onAddToCart={() => handleAddToCart(product._id)} />;
                } else {
                  // Custom List render
                  const isDiscounted = product.discountedPrice && product.discountedPrice < product.price;
                  const displayPrice = isDiscounted ? product.discountedPrice : product.price;
                  
                  return (
                    <div key={product._id} className="list-card">
                      <div className="card-image-wrapper">
                        <Link to={`/product/${product._id}`}>
                          <img 
                            src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"} 
                            alt={product.name} 
                            className="card-image"
                          />
                        </Link>
                        <div className="card-badge">{product.category?.name || "General"}</div>
                      </div>
                      <div className="card-content">
                        <Link to={`/product/${product._id}`} className="card-title" style={{ fontSize: '1.25rem' }}>
                          <HighlightText text={product.name} highlight={searchQuery} />
                        </Link>
                        <div className="card-meta">
                          <StarRating rating={product.avgRating || 0} readonly />
                          <span className="review-count">({product.numReviews || 0} reviews)</span>
                        </div>
                        <p className="card-desc">
                          {product.description || "Premium product crafted with top materials. Experience the ultimate quality with DriftKart exclusive collection."}
                        </p>
                        <div className="card-price-row" style={{ marginTop: 'auto', marginBottom: 0 }}>
                          <div className="price-container">
                            <span className="price-current" style={{ fontSize: '1.5rem' }}>₹{displayPrice}</span>
                            {isDiscounted && <span className="price-original">₹{product.price}</span>}
                          </div>
                        </div>
                        <button 
                          className="btn-add-cart-new ripple-btn" 
                          onClick={(e) => { e.preventDefault(); handleAddToCart(product._id); }}
                          disabled={!product.inStock}
                          style={{ marginTop: '1rem' }}
                        >
                          {product.inStock ? "🛍️ Add to Cart" : "Out of Stock"}
                        </button>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
              <button 
                className="hero-btn-secondary ripple-btn" 
                style={{ color: 'var(--primary)', borderColor: 'var(--border)' }}
                disabled={page === 1} 
                onClick={() => window.scrollTo(0,0) || setPage(p => p - 1)}
              >
                &larr; Previous
              </button>
              <div style={{ padding: '0.8rem 1.5rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', fontWeight: 600, border: '1px solid var(--border)' }}>
                Page {page} of {totalPages}
              </div>
              <button 
                className="hero-btn-secondary ripple-btn" 
                style={{ color: 'var(--primary)', borderColor: 'var(--border)' }}
                disabled={page === totalPages} 
                onClick={() => window.scrollTo(0,0) || setPage(p => p + 1)}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </main>
      </div>

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
