import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, Shield, Package, Heart, Sparkles, Search, Compass, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-amber-900/10">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-slate-950 text-amber-200/90 text-xs tracking-widest uppercase py-2 px-4 text-center font-medium border-b border-amber-500/20 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Complimentary White-Glove Courier Delivery & Signature Packaging On All Global Orders</span>
        <span className="hidden md:inline text-amber-400 font-semibold">• CODE: VENDOME</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Monogram */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Crest Monogram */}
              <div className="w-10 h-10 rounded-full border border-amber-800/30 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-amber-300 font-serif text-lg font-bold shadow-sm group-hover:border-amber-600 transition-colors">
                MV
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl tracking-[0.2em] font-normal text-slate-950 uppercase leading-none group-hover:text-amber-800 transition-colors">
                  Maison Vendôme
                </span>
                <span className="text-[10px] uppercase tracking-[0.35em] text-amber-900/70 font-medium mt-1">
                  Paris • Haute Horlogerie
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Categories */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-widest font-medium text-slate-700">
              <Link to="/products" className="hover:text-amber-800 transition-colors py-2 border-b-2 border-transparent hover:border-amber-700">
                All Creations
              </Link>
              <Link to="/products?category=haute-horlogerie" className="hover:text-amber-800 transition-colors py-2 border-b-2 border-transparent hover:border-amber-700">
                Horlogerie
              </Link>
              <Link to="/products?category=maroquinerie" className="hover:text-amber-800 transition-colors py-2 border-b-2 border-transparent hover:border-amber-700">
                Maroquinerie
              </Link>
              <Link to="/products?category=joaillerie-accessories" className="hover:text-amber-800 transition-colors py-2 border-b-2 border-transparent hover:border-amber-700">
                Joaillerie
              </Link>
              <Link to="/products?category=acoustic-studio" className="hover:text-amber-800 transition-colors py-2 border-b-2 border-transparent hover:border-amber-700">
                Acoustics
              </Link>
              <Link to="/products?category=fragrance-objets" className="hover:text-amber-800 transition-colors py-2 border-b-2 border-transparent hover:border-amber-700">
                Objets d'Art
              </Link>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* Search Trigger */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-amber-900/20 rounded-full px-3 py-1.5 shadow-inner">
                  <input
                    type="text"
                    placeholder="Search creations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-36 sm:w-48 text-xs bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
                  />
                  <button type="submit" className="text-slate-500 hover:text-slate-900 p-0.5">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-700 ml-1 p-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-full text-slate-700 hover:text-slate-950 hover:bg-amber-100/40 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              aria-label="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-rose-600 rounded-full min-w-[18px] shadow">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full text-slate-700 hover:text-slate-950 hover:bg-amber-100/40 transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-slate-950 bg-amber-300 rounded-full min-w-[18px] shadow">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Account Profile / VIP Concierge Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-amber-100/40 transition-colors border border-amber-900/10"
                  aria-label="User account menu"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-200 flex items-center justify-center font-semibold text-xs shadow-sm">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1 hidden sm:inline" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-amber-900/10 py-2 z-50 divide-y divide-slate-100">
                    <div className="px-4 py-3">
                      <p className="text-xs uppercase tracking-wider text-amber-900/60 font-semibold">Maison VIP Client</p>
                      <p className="text-sm font-serif font-medium text-slate-900 truncate">{user.fullName || 'Valued Guest'}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900">
                          Maison Administrator
                        </span>
                      )}
                    </div>

                    <div className="py-1 text-sm text-slate-700">
                      <Link
                        to="/account"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Private Account
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        Order History
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        Curated Wishlist ({wishlistCount})
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 text-amber-900 font-medium"
                        >
                          <Shield className="w-4 h-4 text-amber-700" />
                          Maison Director Suite
                        </Link>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs uppercase tracking-widest font-medium text-slate-700 hover:text-slate-950 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs uppercase tracking-widest font-semibold px-4 py-2.5 rounded-full bg-slate-900 text-amber-100 hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Join Maison
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-amber-100/40"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-900/10 bg-[#FAF9F5] px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-700 uppercase tracking-wider">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-amber-100/50"
            >
              All Creations
            </Link>
            <Link
              to="/products?category=haute-horlogerie"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-amber-100/50"
            >
              Haute Horlogerie
            </Link>
            <Link
              to="/products?category=maroquinerie"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-amber-100/50"
            >
              Maroquinerie & Fine Leather
            </Link>
            <Link
              to="/products?category=joaillerie-accessories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-amber-100/50"
            >
              Haute Joaillerie
            </Link>
            <Link
              to="/products?category=acoustic-studio"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-amber-100/50"
            >
              Acoustic & Studio Artistry
            </Link>
            <Link
              to="/products?category=fragrance-objets"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-amber-100/50"
            >
              Maison Fragrance & Objets
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-amber-100/50 flex items-center justify-between"
            >
              <span>Saved Wishlist</span>
              <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                {wishlistCount}
              </span>
            </Link>
          </nav>

          {!user && (
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-slate-300 text-xs uppercase tracking-wider font-medium text-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-slate-900 text-amber-100 text-xs uppercase tracking-wider font-semibold shadow"
              >
                Join Maison
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
