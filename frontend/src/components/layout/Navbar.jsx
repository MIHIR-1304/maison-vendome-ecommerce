import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, User, LogOut, Menu, X, Shield, Package, Heart, Sparkles, 
  Search, Compass, ChevronDown, Check 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import CategoryNav from '../navigation/CategoryNav';
import CategoryDrawer from '../navigation/CategoryDrawer';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);

  // Search state with Amazon-style category scoping
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCat, setSelectedSearchCat] = useState('');

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (selectedSearchCat) {
      params.set('category', selectedSearchCat);
    }
    navigate(`/products?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-amber-900/10 shadow-sm">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-slate-950 text-amber-200/90 text-xs tracking-widest uppercase py-2 px-4 text-center font-medium border-b border-amber-500/20 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Complimentary White-Glove Courier Delivery & Signature Packaging On All Global Orders</span>
        <span className="hidden md:inline text-amber-400 font-semibold">• CODE: VENDOME</span>
      </div>

      {/* Main Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Monogram */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
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
          </div>

          {/* Amazon-Style Smart Search Bar with Category Scoping (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form 
              onSubmit={handleSearchSubmit}
              className="flex items-center w-full rounded-full border border-amber-900/20 bg-white shadow-inner focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:border-amber-600 transition-all overflow-hidden"
            >
              {/* Category Dropdown (Amazon style) */}
              <div className="relative border-r border-slate-200 bg-sand-100/60 hover:bg-sand-100 transition-colors">
                <select
                  value={selectedSearchCat}
                  onChange={(e) => setSelectedSearchCat(e.target.value)}
                  className="appearance-none bg-transparent py-2.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer tracking-wider uppercase"
                  aria-label="Filter by department"
                >
                  <option value="">All Departments</option>
                  <option value="haute-horlogerie">Horlogerie</option>
                  <option value="maroquinerie">Maroquinerie</option>
                  <option value="joaillerie-accessories">Joaillerie</option>
                  <option value="acoustic-studio">Acoustics</option>
                  <option value="fragrance-objets">Objets d'Art</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Keyword Input */}
              <input
                type="text"
                placeholder="Search fine timepieces, rare leather, studio acoustics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-2 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none font-sans"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-slate-950 text-amber-300 hover:bg-slate-800 transition-colors px-4 py-2.5 flex items-center justify-center border-l border-amber-900/10"
                aria-label="Search catalogue"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              aria-label="Saved Wishlist"
              title="Curated Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-rose-600 rounded-full min-w-[18px] shadow">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button with Slide-Out Drawer trigger */}
            <button
              onClick={openCartDrawer}
              className="relative p-2.5 rounded-full text-slate-700 hover:text-slate-950 hover:bg-amber-100/40 transition-colors flex items-center gap-2 group"
              aria-label="Shopping Bag"
              title="View Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-800 group-hover:scale-105 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-slate-950 bg-amber-300 rounded-full min-w-[18px] shadow">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-xs font-semibold uppercase tracking-wider text-slate-800">
                Bag ({totalItems})
              </span>
            </button>

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
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-amber-900/10 py-2 z-50 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
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
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 hover:text-slate-900 text-xs"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Private Account
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 hover:text-slate-900 text-xs"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        Order History
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 hover:text-slate-900 text-xs"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        Curated Wishlist ({wishlistCount})
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 text-amber-900 font-medium text-xs"
                        >
                          <Shield className="w-4 h-4 text-amber-700" />
                          Maison Director Suite
                        </Link>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs uppercase tracking-widest font-medium text-slate-700 hover:text-slate-950 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs uppercase tracking-widest font-semibold px-4 py-2 rounded-full bg-slate-900 text-amber-100 hover:bg-slate-800 transition-colors shadow-sm"
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

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form 
            onSubmit={handleSearchSubmit}
            className="flex items-center w-full rounded-full border border-amber-900/20 bg-white shadow-inner overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search Maison creations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-2 px-3 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="bg-slate-950 text-amber-300 px-3.5 py-2 flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Amazon-Style Secondary Category Bar */}
      <CategoryNav onOpenAllCategories={() => setCategoryDrawerOpen(true)} />

      {/* Amazon-Style Mega Left Slide Drawer */}
      <CategoryDrawer 
        isOpen={categoryDrawerOpen} 
        onClose={() => setCategoryDrawerOpen(false)} 
      />

      {/* Mobile Drawer (When Mobile Menu Toggle is clicked) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F5] border-t border-amber-900/10 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2 text-xs uppercase tracking-widest font-medium text-slate-800">
            <Link 
              to="/products" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-amber-100/50"
            >
              All Creations
            </Link>
            <Link 
              to="/products?category=haute-horlogerie" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-amber-100/50"
            >
              Haute Horlogerie
            </Link>
            <Link 
              to="/products?category=maroquinerie" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-amber-100/50"
            >
              Maroquinerie
            </Link>
            <Link 
              to="/products?category=joaillerie-accessories" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-amber-100/50"
            >
              Joaillerie
            </Link>
            <Link 
              to="/products?category=acoustic-studio" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-amber-100/50"
            >
              Acoustic Studio
            </Link>
            <Link 
              to="/products?category=fragrance-objets" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-amber-100/50"
            >
              Objets d'Art
            </Link>
          </div>

          {!user && (
            <div className="pt-3 border-t border-amber-900/10 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full border border-slate-900 text-slate-900 text-xs uppercase tracking-widest font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-slate-900 text-amber-100 text-xs uppercase tracking-widest font-semibold"
              >
                Join Maison Vendôme
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
