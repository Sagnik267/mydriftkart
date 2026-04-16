import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartWiggle, setCartWiggle] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setCartWiggle(true);
      const timer = setTimeout(() => setCartWiggle(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${search}`);
  };

  const getUserInitial = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : "U";
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 font-sans ${scrolled ? 'bg-navy/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group shrink-0">
              <span className="text-3xl transform group-hover:-rotate-12 transition-transform duration-300">🏎️</span>
              <h2 className="text-white font-display font-black text-3xl tracking-wide uppercase italic m-0">
                Drift<span className="text-orange">Kart</span>
              </h2>
            </Link>

            {/* Desktop Search Center */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form className="w-full relative group" onSubmit={handleSearch}>
                <input 
                  type="text" 
                  className="w-full bg-card/60 text-white border border-white/10 group-hover:border-white/30 focus:border-orange rounded-full py-2.5 px-6 outline-none transition-all placeholder-gray-400 focus:shadow-[0_0_20px_rgba(255,107,0,0.2)] backdrop-blur-sm shadow-inner"
                  placeholder="Search gear, parts, electronics..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-orange transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-6 shrink-0">
              <Link to="/shop" className="text-white hover:text-orange font-bold tracking-widest transition-colors uppercase text-sm">Shop</Link>
              
              <Link to="/cart" className="relative group text-white hover:text-orange transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${cartWiggle ? 'animate-wiggle' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-badge text-navy text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(255,214,10,0.6)]">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-white hover:text-orange transition-colors focus:outline-none cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-orange text-white flex items-center justify-center font-bold shadow-[0_0_15px_rgba(255,107,0,0.4)]">
                      {getUserInitial()}
                    </div>
                    <span className="font-semibold text-sm">Hi, {user.name.split(" ")[0]}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-card border border-white/10 rounded-lg shadow-2xl py-1 z-50 overflow-hidden">
                      <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 hover:text-orange transition-colors">Profile Options</Link>
                      <Link to="/orders" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 hover:text-orange transition-colors">My Orders</Link>
                      {user.isAdmin && <Link to="/admin" className="block px-4 py-2.5 text-sm font-bold text-badge hover:bg-white/5 transition-colors">Admin Panel</Link>}
                      <div className="h-px bg-white/10 my-1"></div>
                      <button onClick={() => { logout(); navigate("/"); }} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="bg-orange hover:bg-orange/90 text-white px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-[0_4px_14px_0_rgba(255,107,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.33)] hover:-translate-y-0.5">
                  Join Now
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-5">
              <Link to="/cart" className="relative text-white hover:text-orange transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-badge text-navy text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-orange focus:outline-none transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>

          </div>
          
          {/* Mobile Search Bar */}
          <div className="md:hidden mt-3 pb-2 transition-all">
             <form className="w-full relative" onSubmit={handleSearch}>
                <input 
                  type="text" 
                  className="w-full bg-card/80 text-white border border-white/10 rounded-full py-2.5 px-5 text-sm outline-none placeholder-gray-400 focus:border-orange focus:shadow-[0_0_10px_rgba(255,107,0,0.3)]"
                  placeholder="Search products..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </form>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-navy/98 backdrop-blur-xl z-40 transform transition-transform duration-300 md:hidden pt-36 px-6 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col space-y-6 text-center font-sans">
          <Link to="/" className="text-3xl font-display font-bold text-white uppercase tracking-wider hover:text-orange transition-colors">Home</Link>
          <Link to="/shop" className="text-3xl font-display font-bold text-white uppercase tracking-wider hover:text-orange transition-colors">Shop</Link>
          
          <div className="w-full h-px bg-white/10 my-4"></div>
          
          {user ? (
            <>
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-orange text-white flex items-center justify-center font-bold text-2xl shadow-[0_0_15px_rgba(255,107,0,0.4)]">
                  {getUserInitial()}
                </div>
                <span className="text-white text-xl font-bold">{user.name}</span>
              </div>
              <Link to="/profile" className="text-lg font-bold text-gray-300 hover:text-orange">Profile Settings</Link>
              <Link to="/orders" className="text-lg font-bold text-gray-300 hover:text-orange">My Orders</Link>
              {user.isAdmin && <Link to="/admin" className="text-lg font-bold text-badge hover:text-white">Admin Panel</Link>}
              
              <div className="flex-1 mt-10">
                <button 
                  className="w-full bg-card border border-red-500/30 text-red-400 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-red-500/10 transition-colors" 
                  onClick={() => { logout(); navigate("/"); }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
             <Link to="/login" className="mt-8 bg-orange text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-[0_4px_14px_0_rgba(255,107,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.33)] transition-shadow">
                Login / Register
             </Link>
          )}
        </div>
      </div>
    </>
  );
}
