"use client";
import { useCart } from '@/lib/CartContext';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  // Safe extraction for placeholder APIs
  const id = product.id || product._id || Math.random().toString();
  const name = product.name || product.title || "Unknown Product";
  const price = product.price || 0;
  const image = product.image || product.imageUrl || `https://picsum.photos/400/300?random=${id}`;
  const shop = product.shop || product.category?.name || "General Store";

  const handleAdd = () => {
    addToCart({ id, name, price, image, shop });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide border border-gray-100 shadow-sm">
          {shop}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight line-clamp-2">
          {name}
        </h3>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="font-black text-xl text-orange-600">₹{price}</span>
          <button 
            onClick={handleAdd}
            className="bg-orange-600 hover:bg-orange-700 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm shadow-orange-600/30 active:scale-95"
            title="Add to Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
