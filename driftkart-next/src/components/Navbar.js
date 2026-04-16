"use client";
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl">🏎️</span>
            <span className="font-black text-2xl tracking-tighter italic">
              Drift<span className="text-orange-600">Kart</span>
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
             <Link href="/" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">
               Shop
             </Link>
             <Link href="/cart" className="relative text-gray-700 hover:text-orange-600 transition-colors flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
               {cartCount > 0 && (
                 <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                   {cartCount}
                 </span>
               )}
             </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
