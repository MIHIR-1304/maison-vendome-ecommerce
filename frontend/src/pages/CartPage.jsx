import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, ArrowRight, ShoppingBag, ShieldCheck, ChevronLeft, 
  Sparkles, Truck, Lock, Plus, Minus, UserCheck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const CartPage = () => {
  const { items, totalItems, subtotal, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const freeShippingThreshold = 500;
  const currentSubtotal = Number(subtotal) || 0;
  const isFreeShipping = currentSubtotal >= freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - currentSubtotal);
  const progressPercent = Math.min(100, Math.round((currentSubtotal / freeShippingThreshold) * 100));

  if (loading && items.length === 0) {
    return <LoadingSpinner text="Retrieving Maison Vendôme archival records..." />;
  }

  // If cart is empty (for both guest and authenticated user)
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-100/60 flex items-center justify-center text-amber-900/60 border border-amber-900/10">
          <ShoppingBag className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.3em] text-amber-800 font-semibold block">
            Maison Vendôme Bag
          </span>
          <h2 className="font-serif text-3xl font-medium text-slate-950">Votre Sac d'Achats Est Vide</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Your shopping bag is currently empty. Explore our hand-crafted timepieces, fine leather goods, and timeless creations.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-950 text-amber-200 text-xs uppercase tracking-widest font-semibold hover:bg-slate-800 transition-colors shadow-md"
        >
          Explore Creations
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-amber-900/10 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-amber-800 block">
            Maison Vendôme Paris
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-slate-950 mt-1">
            Votre Sac d'Achats
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {totalItems} {totalItems === 1 ? 'exceptional creation' : 'exceptional creations'} reserved in your bag
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={clearCart}
            className="text-xs uppercase tracking-wider font-semibold text-slate-500 hover:text-rose-600 transition-colors"
          >
            Clear Bag
          </button>
        </div>
      </div>

      {/* Guest Notice (if not signed in) */}
      {!user && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <UserCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              Shopping as a <strong>Valued Guest</strong>. Sign in to link these creations to your Maison VIP account.
            </span>
          </div>
          <Link
            to="/login?redirect=/cart"
            className="inline-flex items-center gap-1.5 font-semibold text-amber-950 hover:underline uppercase tracking-wider text-[11px]"
          >
            Sign In Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Complimentary White-Glove Shipping Progress */}
      <div className="p-5 bg-white rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-800 flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-700" />
            {isFreeShipping ? (
              <span className="text-emerald-700">
                🎉 Félicitations! You have unlocked Complimentary White-Glove Courier Delivery.
              </span>
            ) : (
              <span>
                Add <strong className="text-slate-950">${amountToFreeShipping.toFixed(2)}</strong> more to unlock Complimentary White-Glove Courier Delivery
              </span>
            )}
          </span>
          <span className="text-slate-500 font-mono text-[11px]">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Cart Item Rows */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id || item.productId}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-2xl border border-amber-900/10 gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <Link
                  to={`/products/${item.productId}`}
                  className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100 relative group"
                >
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=300&q=80'}
                    alt={item.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold block">
                    Maison Selection
                  </span>
                  <Link
                    to={`/products/${item.productId}`}
                    className="font-serif text-base sm:text-lg font-medium text-slate-900 hover:text-amber-800 transition-colors line-clamp-1"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    ${Number(item.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  {item.availableStock !== undefined && item.availableStock < item.quantity && (
                    <span className="inline-block mt-1 text-[11px] text-amber-700 font-semibold">
                      Only {item.availableStock} in atelier stock
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={loading}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={loading || (item.availableStock && item.quantity >= item.availableStock)}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-serif font-bold text-slate-950 text-lg sm:w-28 text-right font-mono">
                  ${Number(item.lineTotal || item.unitPrice * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  aria-label="Remove Item"
                  title="Remove from bag"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-amber-900 hover:text-amber-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Continuer Vos Découvertes (Continue Shopping)
            </Link>
          </div>
        </div>

        {/* Order Summary Checkout Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 space-y-6 shadow-md">
          <div className="border-b border-amber-900/10 pb-4">
            <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold block">
              Sommaire de la Commande
            </span>
            <h3 className="font-serif text-2xl font-normal text-slate-950 mt-1">
              Order Summary
            </h3>
          </div>

          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} {totalItems === 1 ? 'creation' : 'creations'})</span>
              <span className="font-serif font-medium text-slate-900 font-mono text-sm">
                ${currentSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>White-Glove Courier Delivery</span>
              <span className="font-semibold text-slate-900">
                {isFreeShipping ? 'Complimentary' : '$25.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Signature Gift Packaging & Wax Seal</span>
              <span className="text-amber-800 font-medium">Included</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated VAT / Duties</span>
              <span className="font-serif font-medium text-slate-900 font-mono text-sm">
                ${(currentSubtotal * 0.08).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="pt-4 border-t border-amber-900/10 flex justify-between items-baseline text-slate-950">
              <span className="text-sm font-semibold uppercase tracking-wider">Total</span>
              <span className="font-serif text-2xl font-normal font-mono text-amber-900">
                ${(currentSubtotal + (isFreeShipping ? 0 : 25) + currentSubtotal * 0.08).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-4 rounded-xl bg-slate-950 text-amber-200 text-xs uppercase tracking-widest font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            Passer la Commande (Checkout)
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Authenticity & Atelier Certificate Included</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Complimentary 30-Day Insured Return Transit</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CartPage;
