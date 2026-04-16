"use client";
import { useCart } from "@/lib/CartContext";
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 mb-2">
          YOUR <span className="text-orange-600">CART</span>
        </h1>
        <p className="text-gray-500 font-medium tracking-wide">
          {cartCount} items currently in your cart.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
          <span className="text-6xl mb-6">🛒</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added any premium gear to your cart yet. Discover our collection.</p>
          <Link href="/" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-bold tracking-wide transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm gap-6">
                
                <div className="w-full sm:w-28 h-28 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-50">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{item.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{item.shop}</p>
                  <p className="text-orange-600 font-black text-xl">₹{item.price}</p>
                </div>
                
                <div className="flex flex-col sm:items-end gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                  <div className="flex items-center justify-center sm:justify-end bg-gray-50 rounded-lg p-1 border border-gray-100 w-full sm:w-auto">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:text-black rounded-md transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm select-none">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:text-black rounded-md transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest pl-2"
                  >
                    Remove
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold border-b border-gray-100 pb-4 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-bold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Shipping Estimate</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Tax Estimate</span>
                  <span className="font-bold">₹{Math.floor(cartTotal * 0.18)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
                <span className="font-bold text-lg text-gray-900">Order Total</span>
                <span className="font-black text-2xl text-orange-600">₹{cartTotal + Math.floor(cartTotal * 0.18)}</span>
              </div>
              
              <button 
                onClick={() => alert("Mock Checkout Triggered! Since this is a frontend-only design, backend logic is bypassed.")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold tracking-widest uppercase transition-colors shadow-lg shadow-orange-600/20 active:scale-95"
              >
                Proceed to Checkout
              </button>
              
              <p className="text-center text-xs text-gray-400 font-medium mt-4">
                Secure API-less mock checkout design.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
