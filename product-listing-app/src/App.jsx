import React, { useState, useMemo } from 'react';
import './index.css'; // Remove App.css, just use global index.css

const MOCK_PRODUCTS = [
  { id: 1, name: 'Quantum Core Headphones', category: 'Electronics', originalPrice: 4500, currentPrice: 3150, stockStatus: 'In Stock' },
  { id: 2, name: 'Premium Silk Blend Shirt', category: 'Clothing', originalPrice: 2400, currentPrice: 2400, stockStatus: 'In Stock' },
  { id: 3, name: 'Organic Matcha Powder', category: 'Food', originalPrice: 1200, currentPrice: 900, stockStatus: 'Out of Stock' },
  { id: 4, name: 'Pro-Grip Gaming Mouse', category: 'Electronics', originalPrice: 1800, currentPrice: 2100, stockStatus: 'In Stock' }, // Price increased
  { id: 5, name: 'Aero-Runner Sneakers', category: 'Clothing', originalPrice: 6000, currentPrice: 4500, stockStatus: 'In Stock' },
  { id: 6, name: 'Artisan Dark Chocolate', category: 'Food', originalPrice: 350, currentPrice: 350, stockStatus: 'In Stock' }
];

const CATEGORIES = ['Electronics', 'Clothing', 'Food'];

const calculateDiff = (original, current) => {
  const diff = original - current;
  if (diff > 0) {
    const percent = Math.round((diff / original) * 100);
    return { type: 'discount', text: `Save ₹${diff} (${percent}% off)` };
  } else if (diff < 0) {
    const inc = Math.abs(diff);
    const percent = Math.round((inc / original) * 100);
    return { type: 'increase', text: `Price increased ₹${inc} (+${percent}%)` };
  }
  return null;
};

const getDiscountPercent = (original, current) => {
  if (current >= original) return 0;
  return ((original - current) / original) * 100;
};

export default function App() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  // Filters State
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [discountOnly, setDiscountOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name-asc'); // price-asc, price-desc, discount-desc, name-asc

  // Add Product State
  const [addForm, setAddForm] = useState({
    name: '',
    category: 'Electronics',
    originalPrice: '',
    currentPrice: '',
    stockStatus: 'In Stock',
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.originalPrice || !addForm.currentPrice) return;
    
    const newProduct = {
      id: Date.now(),
      name: addForm.name,
      category: addForm.category,
      originalPrice: Number(addForm.originalPrice),
      currentPrice: Number(addForm.currentPrice),
      stockStatus: addForm.stockStatus,
    };

    setProducts([newProduct, ...products]);
    setAddForm({ ...addForm, name: '', originalPrice: '', currentPrice: '' });
  };

  const clearFilters = () => {
    setCategoryFilter('');
    setMinPrice('');
    setMaxPrice('');
    setDiscountOnly(false);
    setInStockOnly(false);
    setSortBy('name-asc');
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filters
    if (categoryFilter) result = result.filter(p => p.category === categoryFilter);
    if (minPrice) result = result.filter(p => p.currentPrice >= Number(minPrice));
    if (maxPrice) result = result.filter(p => p.currentPrice <= Number(maxPrice));
    if (discountOnly) result = result.filter(p => p.currentPrice < p.originalPrice);
    if (inStockOnly) result = result.filter(p => p.stockStatus === 'In Stock');

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.currentPrice - b.currentPrice;
        case 'price-desc': return b.currentPrice - a.currentPrice;
        case 'discount-desc': return getDiscountPercent(b.originalPrice, b.currentPrice) - getDiscountPercent(a.originalPrice, a.currentPrice);
        case 'name-asc': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

    return result;
  }, [products, categoryFilter, minPrice, maxPrice, discountOnly, inStockOnly, sortBy]);

  // Derived Summary
  const { totalProducts, avgPrice, totalSavings } = useMemo(() => {
    if (filteredAndSortedProducts.length === 0) return { totalProducts: 0, avgPrice: 0, totalSavings: 0 };
    
    let sumPrice = 0;
    let sumSavings = 0;
    filteredAndSortedProducts.forEach(p => {
      sumPrice += p.currentPrice;
      if (p.currentPrice < p.originalPrice) {
        sumSavings += (p.originalPrice - p.currentPrice);
      }
    });

    return {
      totalProducts: filteredAndSortedProducts.length,
      avgPrice: Math.round(sumPrice / filteredAndSortedProducts.length),
      totalSavings: sumSavings,
    };
  }, [filteredAndSortedProducts]);

  return (
    <div className="app-container">
      <header className="hero-header">
        <h1>DriftKart Catalog</h1>
        <p className="subtitle">Premium product management and listing system.</p>
      </header>

      {/* Summary Bar */}
      <div className="summary-bar slide-in">
        <div className="stat">
          <span className="stat-label">Displayed Products</span>
          <span className="stat-value">{totalProducts}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Average Price</span>
          <span className="stat-value">₹{avgPrice}</span>
        </div>
        <div className="stat highlight">
          <span className="stat-label">Total Savings</span>
          <span className="stat-value text-success">₹{totalSavings}</span>
        </div>
      </div>

      <div className="main-layout">
        <aside className="sidebar fade-in">
          {/* Add Product Section */}
          <div className="panel add-product-form">
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
               <div className="input-group">
                 <label>Name</label>
                 <input type="text" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} placeholder="e.g. Smart Watch" required />
               </div>
               <div className="input-group">
                 <label>Category</label>
                 <select value={addForm.category} onChange={e => setAddForm({...addForm, category: e.target.value})}>
                   {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               
               <div className="price-row">
                 <div className="input-group">
                   <label>Original (₹)</label>
                   <input type="number" min="0" value={addForm.originalPrice} onChange={e => setAddForm({...addForm, originalPrice: e.target.value})} required />
                 </div>
                 <div className="input-group">
                   <label>Current (₹)</label>
                   <input type="number" min="0" value={addForm.currentPrice} onChange={e => setAddForm({...addForm, currentPrice: e.target.value})} required />
                 </div>
               </div>

               {/* Live Difference Preview */}
               {addForm.originalPrice && addForm.currentPrice && (
                 <div className="live-preview">
                   {(() => {
                     const diff = calculateDiff(Number(addForm.originalPrice), Number(addForm.currentPrice));
                     if (!diff) return <span className="badge neutral">No difference</span>;
                     return <span className={`badge ${diff.type}`}>{diff.text}</span>;
                   })()}
                 </div>
               )}

               <div className="input-group">
                 <label>Stock Status</label>
                 <select value={addForm.stockStatus} onChange={e => setAddForm({...addForm, stockStatus: e.target.value})}>
                   <option value="In Stock">In Stock</option>
                   <option value="Out of Stock">Out of Stock</option>
                 </select>
               </div>
               <button type="submit" className="btn-primary">Add to Catalog</button>
            </form>
          </div>

          {/* Filter Section */}
          <div className="panel filters-panel">
            <div className="filters-header">
              <h2>Filters</h2>
              <button className="btn-text" onClick={clearFilters}>Reset</button>
            </div>
            
            <div className="input-group">
              <label>Category</label>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="price-row">
                 <div className="input-group">
                   <label>Min Price</label>
                   <input type="number" placeholder="₹" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                 </div>
                 <div className="input-group">
                   <label>Max Price</label>
                   <input type="number" placeholder="₹" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                 </div>
            </div>

            <div className="toggle-group">
              <label>
                <input type="checkbox" checked={discountOnly} onChange={e => setDiscountOnly(e.target.checked)} />
                Discounted Items Only
              </label>
            </div>
            <div className="toggle-group">
              <label>
                <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />
                In Stock Only
              </label>
            </div>

            <div className="divider"></div>

            <div className="input-group">
              <label>Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="name-asc">Name (A-Z)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="discount-desc">Discount (%)</option>
              </select>
            </div>
          </div>
        </aside>

        <main className="product-display">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="empty-state">
              <h3>No products found.</h3>
              <p>Try adjusting your filters or adding a new product.</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredAndSortedProducts.map(product => {
                const diff = calculateDiff(product.originalPrice, product.currentPrice);
                const outOfStock = product.stockStatus === 'Out of Stock';
                return (
                  <div className={`product-card scale-in ${outOfStock ? 'dimmed' : ''}`} key={product.id}>
                    <div className="card-image">
                       <span className={`stock-badge ${outOfStock ? 'out' : 'in'}`}>{product.stockStatus}</span>
                    </div>
                    <div className="card-content">
                       <span className="category-tag">{product.category}</span>
                       <h3 className="product-name">{product.name}</h3>
                       
                       <div className="pricing">
                         <span className="current-price">₹{product.currentPrice}</span>
                         {product.currentPrice !== product.originalPrice && (
                           <span className="original-price">₹{product.originalPrice}</span>
                         )}
                       </div>
                       
                       <div className="diff-container">
                         {diff && (
                           <span className={`badge ${diff.type} full-width`}>{diff.text}</span>
                         )}
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
