import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, 
  Sparkles, Truck, Lock, ArrowUpRight 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartDrawer() {
  const { 
    items, 
    totalItems, 
    subtotal, 
    isCartDrawerOpen, 
    closeCartDrawer, 
    updateQuantity, 
    removeFromCart,
    loading 
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Free shipping threshold for luxury delivery
  const freeShippingThreshold = 500;
  const currentSubtotal = Number(subtotal) || 0;
  const progressPercent = Math.min(100, Math.round((currentSubtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - currentSubtotal);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const handleCheckoutClick = () => {
    closeCartDrawer();
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleViewBagClick = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={closeCartDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-amber-900/10 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-amber-900/10 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-200 flex items-center justify-center font-serif text-sm">
                  MV
                </div>
                <div>
                  <h2 className="font-serif text-lg font-medium text-slate-950 leading-tight">
                    Votre Sac d'Achats
                  </h2>
                  <p className="text-[11px] uppercase tracking-widest text-amber-900/70 font-medium">
                    {totalItems} {totalItems === 1 ? 'Creation' : 'Creations'} Selected
                  </p>
                </div>
              </div>
              <button
                onClick={closeCartDrawer}
                className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Close Shopping Bag Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  {currentSubtotal >= freeShippingThreshold ? (
                    <span className="text-emerald-700 font-semibold">
                      Complimentary White-Glove Courier Unlocked!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-slate-900">${amountToFreeShipping.toFixed(2)}</strong> for Free Courier
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-600 to-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Drawer Body: Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100/60 flex items-center justify-center text-amber-900/60">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-slate-900">Your Shopping Bag is Empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explore our curated collections of fine horology, leather goods, and timeless objects.
                  </p>
                </div>
                <Link
                  to="/products"
                  onClick={closeCartDrawer}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-amber-100 text-xs uppercase tracking-widest font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Browse Creations
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.id || item.productId}
                  className="flex gap-4 p-3 rounded-xl bg-white border border-amber-900/10 shadow-sm transition-all hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <Link 
                    to={`/products/${item.productId}`}
                    onClick={closeCartDrawer}
                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0"
                  >
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=300&auto=format&fit=crop'}
                      alt={item.productName}
                      className="w-full h-full object-cover object-center"
                    />
                  </Link>

                  {/* Info & Quantity */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${item.productId}`}
                          onClick={closeCartDrawer}
                          className="font-serif text-sm font-medium text-slate-900 hover:text-amber-800 line-clamp-1"
                        >
                          {item.productName}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-mono font-medium text-slate-600 mt-0.5">
                        ${Number(item.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={loading}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-semibold text-slate-800 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={loading || (item.availableStock && item.quantity >= item.availableStock)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <span className="font-serif text-sm font-semibold text-slate-900">
                        ${Number(item.lineTotal || item.unitPrice * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer: Order Summary & Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-amber-900/10 bg-white space-y-4">
              {/* Subtotal */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Sous-total / Subtotal</span>
                  <span className="font-serif text-lg font-bold text-slate-950 font-mono">
                    ${currentSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>White-Glove Delivery</span>
                  <span>{currentSubtotal >= freeShippingThreshold ? 'Complimentary' : '$25.00'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Maison Packaging & Certificate</span>
                  <span className="text-amber-800 font-medium">Included</span>
                </div>
              </div>

              {/* Checkout CTAs */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-950 text-amber-200 text-xs uppercase tracking-widest font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-[0.99]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Passer la Commande (Checkout)
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>

                <button
                  onClick={handleViewBagClick}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-100/40 text-slate-900 text-xs uppercase tracking-wider font-semibold hover:bg-amber-100/70 transition-colors text-center"
                >
                  View Full Shopping Bag ({totalItems})
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                  <span>100% Certified Authentic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                  <span>Atelier Guarantee</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
