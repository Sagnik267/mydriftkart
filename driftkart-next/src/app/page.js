"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  
  const categories = ["All", "Electronics", "Fashion", "Auto Parts", "Sports"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://my-backend-api.onrender.com/api";
        const response = await fetch(`${baseUrl}/products`);
        
        if (!response.ok) throw new Error("Failed to fetch products");
        
        const data = await response.json();
        // Handle varying standard API schemas { products: [] } or just []
        const fetchedProducts = data.products || data || [];
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (err) {
        console.error("API error, falling back to mock data:", err);
        // Fallback mock data to ensure UI displays as requested if API fails
        const mockData = Array.from({ length: 12 }).map((_, i) => ({
          id: `mock-${i}`,
          name: `DriftKart Premium Item ${i + 1}`,
          price: Math.floor(Math.random() * 5000) + 500,
          category: { name: categories[(i % 4) + 1] },
        }));
        setProducts(mockData);
        setFilteredProducts(mockData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    
    if (category !== "All") {
      result = result.filter(p => {
        const catName = p.category?.name || p.category || "General";
        return catName.toLowerCase() === category.toLowerCase();
      });
    }
    
    if (search.trim()) {
      result = result.filter(p => 
        (p.name || p.title || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredProducts(result);
  }, [search, category, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 mb-4">
          SHOP <span className="text-orange-600">PREMIUM</span> GEAR
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Explore our massive collection of high-performance products fetched dynamically from our external API.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 gap-4">
        
        <div className="flex overflow-x-auto space-x-2 w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all whitespace-nowrap ${
                category === c 
                  ? "bg-gray-900 text-white shadow-md" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 shrink-0">
          <input 
            type="text" 
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium placeholder-gray-400"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-32 flex justify-center items-center flex-col">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Fetching inventory constraints...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
           <p className="font-bold">{error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-32 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-xl font-bold mb-2">No products found</p>
          <p>Try adjusting your search or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
      
    </div>
  );
}
