import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";

export default function HomePage() {
  
  // Flash Sale Countdown Logic
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else hours = 23; 
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  // Hardcoded Categories
  const categories = [
    { name: "Electronics", icon: "🎧" },
    { name: "Fashion", icon: "👗" },
    { name: "Auto Parts", icon: "🏎️" },
    { name: "Sports", icon: "⚽" },
    { name: "Home & Living", icon: "🏠" },
    { name: "Laptops", icon: "💻" },
    { name: "Mobiles", icon: "📱" },
    { name: "Gaming", icon: "🎮" },
  ];

  // Hardcoded Products
  const mockProducts = Array.from({ length: 8 }).map((_, i) => ({
    _id: `prod-${i}`,
    name: `Premium Gear Model ${i + 1}`,
    category: categories[i % categories.length].name,
    price: Math.floor(Math.random() * 500) + 50,
    rating: 4.5,
    imageUrl: `https://picsum.photos/300/300?random=${i + 1}`
  }));

  return (
    <div className="bg-navy min-h-screen text-white font-sans selection:bg-orange selection:text-white pb-0">
      <Navbar />
      
      {/* SECTION 1 — HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden w-full">
        {/* Subtle orange radial glow */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,107,0,0.15)_0%,rgba(13,27,42,0)_60%)] -z-0"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* HERO LEFT */}
            <div className="flex flex-col items-start space-y-6">
              <div className="inline-flex items-center px-4 py-1.5 border border-orange/40 bg-orange/10 rounded-full">
                <span className="w-2 h-2 rounded-full bg-orange animate-pulse mr-2"></span>
                <span className="text-orange font-bold text-sm tracking-widest uppercase">
                  NEXT-GEN RACING GEAR
                </span>
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none tracking-tighter">
                Gear Up Your <br/> Life with <span className="text-orange drop-shadow-[0_0_15px_rgba(255,107,0,0.3)]">DriftKart</span>
              </h1>
              
              <p className="text-xl text-gray-300 font-medium max-w-lg leading-relaxed">
                Discover premium products, unbeatable prices, and lightning-fast delivery.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                <Link to="/shop" className="bg-orange hover:bg-[#ea6c0a] text-white px-8 py-4 rounded font-bold uppercase tracking-widest transition-all shadow-[4px_4px_0_0_rgba(255,214,10,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(255,214,10,1)] text-center">
                  Shop Now
                </Link>
                <Link to="/profile" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-4 rounded font-bold uppercase tracking-widest transition-all text-center group">
                  Join Now
                </Link>
              </div>
            </div>
            
            {/* HERO RIGHT */}
            <div className="relative flex justify-center items-center h-[400px] lg:h-[500px]">
              <div className="absolute w-2/3 h-5/6 bg-[#FFD60A] transform rotate-3 rounded-2xl shadow-[0_20px_50px_rgba(255,214,10,0.2)]"></div>
              <div className="absolute w-2/3 h-5/6 bg-card border-2 border-white/20 transform -rotate-3 rounded-2xl p-6 flex flex-col justify-between shadow-2xl z-10 hover:-translate-y-2 transition-transform duration-500">
                <div className="flex justify-between items-start">
                   <span className="bg-navy text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 uppercase">Featured</span>
                   <span className="text-orange font-bold">₹2,499</span>
                </div>
                <div className="flex-1 flex items-center justify-center py-4">
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop" 
                    alt="Premium Headphones" 
                    className="w-full h-48 object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] animate-[float_6s_ease-in-out_infinite]"
                  />
                </div>
                <div>
                   <h3 className="text-white font-bold text-xl uppercase tracking-wide">DriftX Pro Headphones</h3>
                   <div className="w-full h-1 bg-orange/20 mt-3 rounded overflow-hidden">
                     <div className="w-4/5 h-full bg-orange"></div>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 — STATS BAR */}
      <section className="bg-card border-y border-white/10 py-8 relative z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center items-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="w-full md:w-1/3 py-4 md:py-0 text-center flex flex-col items-center">
              <span className="font-display text-4xl md:text-5xl font-black text-orange">50K+</span>
              <span className="font-bold uppercase tracking-widest text-gray-400 text-sm mt-1">Products</span>
            </div>
            <div className="w-full md:w-1/3 py-4 md:py-0 text-center flex flex-col items-center">
              <span className="font-display text-4xl md:text-5xl font-black text-orange">2M+</span>
              <span className="font-bold uppercase tracking-widest text-gray-400 text-sm mt-1">Happy Customers</span>
            </div>
            <div className="w-full md:w-1/3 py-4 md:py-0 text-center flex flex-col items-center">
              <span className="font-display text-4xl md:text-5xl font-black text-orange">24/7</span>
              <span className="font-bold uppercase tracking-widest text-gray-400 text-sm mt-1">Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — CATEGORY CHIPS */}
      <section className="py-16 bg-navy">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl font-black uppercase mb-8"><span className="text-orange border-b-4 border-orange pb-1">Shop</span> Categories</h2>
          <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide snap-x">
             {categories.map((cat, idx) => (
               <Link 
                 key={idx} 
                 to={`/shop?category=${cat.name}`} 
                 className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 snap-center shrink-0 transition-all ${idx === 0 ? 'bg-orange/10 border-orange text-orange' : 'bg-card border-transparent text-gray-300 hover:border-orange/50 hover:bg-card/80 hover:-translate-y-1'}`}
               >
                 <span className="text-2xl">{cat.icon}</span>
                 <span className="font-bold tracking-wide uppercase text-sm whitespace-nowrap">{cat.name}</span>
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — FEATURED PRODUCTS GRID */}
      <section className="py-16 bg-navy">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
             <h2 className="font-display text-4xl lg:text-5xl font-black uppercase">
               Featured <span className="text-orange relative">Products<div className="absolute -bottom-2 left-0 w-full h-1 bg-orange"></div></span>
             </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <div key={product._id} className="bg-card w-full rounded-xl overflow-hidden border-2 border-transparent hover:border-orange/80 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,107,0,0.15)] flex flex-col items-start group">
                {/* Image Area */}
                <div className="w-full relative aspect-[4/3] bg-white/5 overflow-hidden">
                  <Link to={`/product/${product._id}`} className="block w-full h-full">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="absolute top-3 left-3 bg-navy/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 uppercase tracking-wider">
                    {product.category}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-1 w-full">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-white font-bold text-lg leading-tight mb-2 hover:text-orange transition-colors truncate">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center space-x-1 mb-4 text-orange text-sm font-bold">
                    <span>⭐</span>
                    <span>{product.rating}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between w-full">
                    <span className="text-orange font-black text-2xl">₹{product.price}</span>
                    <button className="bg-white/10 hover:bg-orange text-white w-10 h-10 flex items-center justify-center rounded-lg transition-colors border border-white/10 hover:border-orange group-hover:shadow-[0_0_15px_rgba(255,107,0,0.5)]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                         <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — FLASH SALE BANNER */}
      <section className="relative py-20 overflow-hidden transform -skew-y-2 bg-orange my-20">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20mix-blend-multiply"></div>
         <div className="max-w-[1400px] mx-auto px-4 relative z-10 transform skew-y-2">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-4">
               
               <div className="text-center lg:text-left">
                  <h2 className="font-display text-5xl md:text-7xl font-black text-navy uppercase leading-none drop-shadow-lg">
                    ⚡ Flash Sale
                  </h2>
                  <p className="font-bold text-2xl md:text-4xl text-white uppercase tracking-widest mt-2 drop-shadow-md">
                    Up to 70% Off
                  </p>
               </div>
               
               <div className="flex gap-4">
                  <div className="bg-navy px-6 py-4 rounded-xl flex flex-col items-center shadow-xl border-2 border-white/20 min-w-[90px]">
                     <span className="font-display text-5xl font-black text-white">{formatNumber(timeLeft.hours)}</span>
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hours</span>
                  </div>
                  <div className="font-display text-5xl font-black text-navy self-start mt-2 hidden sm:block">:</div>
                  <div className="bg-navy px-6 py-4 rounded-xl flex flex-col items-center shadow-xl border-2 border-white/20 min-w-[90px]">
                     <span className="font-display text-5xl font-black text-white">{formatNumber(timeLeft.minutes)}</span>
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mins</span>
                  </div>
                  <div className="font-display text-5xl font-black text-navy self-start mt-2 hidden sm:block">:</div>
                  <div className="bg-navy px-6 py-4 rounded-xl flex flex-col items-center shadow-xl border-2 border-orange min-w-[90px]">
                     <span className="font-display text-5xl font-black text-orange">{formatNumber(timeLeft.seconds)}</span>
                     <span className="text-xs font-bold text-orange/70 uppercase tracking-widest">Secs</span>
                  </div>
               </div>
               
               <Link to="/shop" className="bg-navy text-white hover:bg-white hover:text-navy px-10 py-5 font-bold text-xl uppercase tracking-widest shadow-[8px_8px_0_0_rgba(13,27,42,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded text-center whitespace-nowrap">
                 Grab Deals Now
               </Link>
               
            </div>
         </div>
      </section>

      {/* SECTION 6 — FOOTER */}
      <footer className="bg-[#050A0F] border-t-4 border-orange pt-20 pb-8 text-gray-400">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-16">
            
            {/* Col 1: Logo */}
            <div className="flex flex-col space-y-6">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-3xl">🏎️</span>
                <h2 className="text-white font-display font-black text-3xl tracking-wide uppercase italic m-0">
                  Drift<span className="text-orange">Kart</span>
                </h2>
              </Link>
              <p className="text-sm font-medium leading-relaxed">
                The ultimate platform for premium racing gear and heavy-duty auto parts. Geared for speed.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-widest mb-6">Quick Links</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link to="/shop" className="hover:text-orange transition-colors">Shop Gear</Link></li>
                <li><Link to="/cart" className="hover:text-orange transition-colors">Your Cart</Link></li>
                <li><Link to="/profile" className="hover:text-orange transition-colors">Track Order</Link></li>
              </ul>
            </div>

            {/* Col 3: Support */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-widest mb-6">Customer Support</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="hover:text-orange transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange transition-colors">Returns policy</a></li>
                <li><a href="#" className="hover:text-orange transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-widest mb-6">Newsletter</h3>
              <form className="relative flex" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter email..." 
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-l focus:outline-none focus:border-orange text-sm font-medium"
                />
                <button type="submit" className="bg-orange hover:bg-orange/90 text-white px-6 rounded-r font-bold text-sm tracking-widest uppercase transition-colors">
                  Subscribe
                </button>
              </form>
            </div>

          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs font-bold tracking-widest uppercase mt-8 gap-4 text-gray-500">
            <p>&copy; {new Date().getFullYear()} DriftKart Worldwide. All Rights Reserved.</p>
            <div className="flex space-x-6 text-xl">
              <a href="#" className="hover:text-orange transition-colors">X</a>
              <a href="#" className="hover:text-orange transition-colors">IG</a>
              <a href="#" className="hover:text-orange transition-colors">FB</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
