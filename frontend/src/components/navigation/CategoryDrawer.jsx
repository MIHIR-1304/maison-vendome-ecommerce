import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, User, ChevronRight, Watch, Briefcase, Gem, Headphones, Sparkles, 
  Flame, Award, Gift, Compass, ShieldCheck, PhoneCall, Package, Heart, LogIn, LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

export default function CategoryDrawer({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLinkClick = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel from Left */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pr-12 sm:pr-16">
        <div className="w-screen max-w-sm sm:max-w-md bg-[#FAF9F5] border-r border-amber-900/10 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300">
          
          {/* Amazon-style User Greeting Header */}
          <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-amber-500/20 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center font-serif text-sm">
                {user ? (user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U') : <User className="w-5 h-5 text-amber-200" />}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-amber-300/80 font-medium">
                  {user ? 'Maison VIP Privileges' : 'Welcome to Maison Vendôme'}
                </p>
                <h3 className="font-serif text-base font-semibold text-white tracking-wide">
                  {user ? `Hello, ${user.fullName || 'Connoisseur'}` : (
                    <button 
                      onClick={() => handleLinkClick('/login')}
                      className="hover:text-amber-200 underline decoration-amber-400/50 underline-offset-4"
                    >
                      Hello, Sign In
                    </button>
                  )}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              aria-label="Close menu drawer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Menu Scrollable Body */}
          <div className="flex-1 overflow-y-auto divide-y divide-amber-900/10">
            
            {/* Section 1: Trending & Highlights */}
            <div className="py-4">
              <div className="px-5 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-900/80">
                Trending & Curations
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => handleLinkClick('/products?sortBy=featured')}
                  className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 hover:text-amber-900 transition-colors text-left"
                >
                  <span className="flex items-center gap-3">
                    <Flame className="w-4 h-4 text-amber-600" />
                    Place Vendôme Bestsellers
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => handleLinkClick('/products?sortBy=newest')}
                  className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 hover:text-amber-900 transition-colors text-left"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    New Atelier Releases 2026
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-950">
                    New
                  </span>
                </button>
                <button
                  onClick={() => handleLinkClick('/products?sortBy=price-desc')}
                  className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 hover:text-amber-900 transition-colors text-left"
                >
                  <span className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-amber-600" />
                    High Complication Vault
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => handleLinkClick('/products?category=fragrance-objets')}
                  className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 hover:text-amber-900 transition-colors text-left"
                >
                  <span className="flex items-center gap-3">
                    <Gift className="w-4 h-4 text-amber-600" />
                    Maison Gift Salon & Packaging
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Section 2: Shop by Department (Amazon style) */}
            <div className="py-4">
              <div className="px-5 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-900/80">
                Shop By Department
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => handleLinkClick('/products?category=haute-horlogerie')}
                  className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 hover:text-amber-900 transition-colors text-left"
                >
                  <span className="flex items-center gap-3">
                    <Watch className="w-4 h-4 text-slate-700" />
                    Haute Horlogerie
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Timepieces</span>
                </button>

                <button
                  onClick={() => handleLinkClick('/products?category=maroquinerie')}
                  className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 hover:text-amber-900 transition-colors text-left"
                >
                  <span className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-slate-700" />
                    Maroquinerie
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Leather Goods</span>
                </button>

                <button
                  onClick={() => handleLinkClick('/products?category=joaillerie-accessories')}
                  className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 hover:text-amber-900 transition-colors text-left"
                >
                  <span className="flex items-center gap-3">
                    <Gem className="w-4 h-4 text-slate-700" />
                    Haute Joaillerie & Accessories
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Jewelry</span>
                </button>

                <button
                  onClick={() => handleLinkClick('/products?category=acoustic-studio')}
                  className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 hover:text-amber-900 transition-colors text-left"
                >
                  <span className="flex items-center gap-3">
                    <Headphones className="w-4 h-4 text-slate-700" />
                    Acoustic Artistry & Studio
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Audiophile</span>
                </button>

                <button
                  onClick={() => handleLinkClick('/products?category=fragrance-objets')}
                  className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 hover:text-amber-900 transition-colors text-left"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-slate-700" />
                    Objets d'Art & Living
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Sculpture & Scent</span>
                </button>

                <button
                  onClick={() => handleLinkClick('/products')}
                  className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100/60 transition-colors text-left"
                >
                  <span className="flex items-center gap-3">
                    <Compass className="w-4 h-4 text-amber-800" />
                    Explore Complete Maison Catalogue
                  </span>
                  <ChevronRight className="w-4 h-4 text-amber-800" />
                </button>
              </div>
            </div>

            {/* Section 3: Programs & Maison Privileges */}
            <div className="py-4">
              <div className="px-5 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-900/80">
                Programs & Privileges
              </div>
              <div className="space-y-0.5">
                <div className="px-5 py-2 text-xs text-slate-600 flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Complimentary White-Glove Global Courier</span>
                </div>
                <div className="px-5 py-2 text-xs text-slate-600 flex items-center gap-3">
                  <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Lifetime Certificate of Authenticity</span>
                </div>
                <div className="px-5 py-2 text-xs text-slate-600 flex items-center gap-3">
                  <PhoneCall className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>24/7 Client Concierge & Atelier Booking</span>
                </div>
              </div>
            </div>

            {/* Section 4: Help & Settings */}
            <div className="py-4">
              <div className="px-5 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-900/80">
                Account & Settings
              </div>
              <div className="space-y-0.5">
                {user ? (
                  <>
                    <button
                      onClick={() => handleLinkClick('/account')}
                      className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <User className="w-4 h-4 text-slate-500" />
                        Your Private Account
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleLinkClick('/orders')}
                      className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-slate-500" />
                        Consignments & Orders
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleLinkClick('/wishlist')}
                      className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <Heart className="w-4 h-4 text-rose-500" />
                        Saved Wishlist ({wishlistCount})
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleLinkClick('/admin')}
                        className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-semibold text-amber-900 bg-amber-50/60 hover:bg-amber-100 text-left"
                      >
                        <span className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-amber-700" />
                          Maison Director Suite
                        </span>
                        <ChevronRight className="w-4 h-4 text-amber-700" />
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleLinkClick('/login')}
                      className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-amber-100/40 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <LogIn className="w-4 h-4 text-slate-500" />
                        Sign In / Private Access
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleLinkClick('/register')}
                      className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-amber-700" />
                        Join Maison Vendôme VIP
                      </span>
                      <ChevronRight className="w-4 h-4 text-amber-700" />
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Drawer Footer: Place Vendôme Stamp */}
          <div className="p-4 bg-slate-900 text-amber-200/80 text-[10px] uppercase tracking-widest text-center border-t border-amber-500/20">
            Place Vendôme, 75001 Paris • France
          </div>

        </div>
      </div>
    </div>
  );
}
