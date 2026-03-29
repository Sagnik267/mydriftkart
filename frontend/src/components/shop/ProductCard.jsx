import React from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import "./Components.css";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"} 
          alt={product.name} 
          className="product-image"
        />
      </Link>
      <div className="product-info">
        <Link to={`/product/${product._id}`} className="product-name">
          {product.name}
        </Link>
        <div className="product-meta">
          <StarRating rating={product.avgRating || 0} readonly />
          <span className="product-price">₹{product.price}</span>
        </div>
        <button 
          className="btn-add-cart" 
          onClick={() => onAddToCart(product._id)}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
