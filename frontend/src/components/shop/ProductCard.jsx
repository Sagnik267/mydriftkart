import React, { useState } from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";

export default function ProductCard({ product, onAddToCart }) {
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (added || !product.inStock) return;
    
    await onAddToCart(product._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    setWishlist(!wishlist);
  };

  const isDiscounted = product.discountedPrice && product.discountedPrice < product.price;
  const displayPrice = isDiscounted ? product.discountedPrice : product.price;

  return (
    <div className="bg-card w-full rounded-2xl overflow-hidden border-2 border-transparent hover:border-orange transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-[0_10px_30px_rgba(255,107,0,0.2)] group font-sans flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-white/5">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <img 
            src={product.imageUrl || product.image || "/placeholder.png"} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            onError={(e) => { e.target.onError = null; e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'; }}
          />
        </Link>
        <div className="absolute top-3 left-3 bg-navy text-badge text-xs font-bold px-3 py-1 rounded-full border border-badge/50 shadow-md uppercase tracking-wider backdrop-blur-md">
          {product.category?.name || "General"}
        </div>
        <button 
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-navy/80 flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors ${wishlist ? 'text-red-500 border-red-500/50' : 'text-gray-400 hover:text-white'}`}
          onClick={toggleWishlist}
          aria-label="Toggle Wishlist"
        >
          <span className="text-sm">{wishlist ? "❤️" : "🤍"}</span>
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="text-white font-bold text-lg leading-tight mb-2 hover:text-orange transition-colors line-clamp-2 title-font tracking-wide">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-2 mb-4 mt-auto">
          <span className="text-xs text-badge flex items-center">
             <StarRating rating={product.avgRating || 0} readonly />
          </span>
          <span className="text-gray-400 text-xs font-medium">({product.numReviews || 0})</span>
        </div>

        <div className="flex items-center justify-between mt-auto mb-4">
          <div className="flex flex-col">
            <span className="text-orange font-bold text-xl drop-shadow-[0_0_5px_rgba(255,107,0,0.5)]">₹{displayPrice}</span>
            {isDiscounted && <span className="text-gray-500 text-sm line-through decoration-red-500/70">₹{product.price}</span>}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${product.inStock ? "text-green-400 border-green-400/30 bg-green-400/10" : "text-red-400 border-red-400/30 bg-red-400/10"}`}>
            {product.inStock ? "In Stock" : "Sold Out"}
          </span>
        </div>

        <button 
          className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 ${
            added 
              ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
              : product.inStock 
                ? "bg-white/5 text-white border border-white/10 hover:bg-orange hover:border-orange hover:text-white hover:shadow-[0_0_20px_rgba(255,107,0,0.4)]" 
                : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/10"
          }`} 
          onClick={handleAddToCart}
          disabled={!product.inStock || added}
        >
          {added ? "Added ✓" : product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
