import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const CartPage = () => {
  const { cart, items, totalItems, subtotal, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const freeShippingThreshold = 150;
  const isFreeShipping = Number(subtotal) >= freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - Number(subtotal));

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-sand-100 flex items-center justify-center text-brand-950">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-slate-800">Your Cart Awaits</h2>
        <p className="text-sm text-slate-500">
          Please sign in to view your saved cart items or create a new order.
        </p>
        <Link
          to="/login"
          state={{ from: { pathname: '/cart' } }}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-950 text-white font-bold text-sm hover:bg-brand-900 transition-colors shadow-md"
        >
          Sign In to Access Cart
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return <LoadingSpinner text="Retrieving your shopping cart..." />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-sand-100 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">
          Explore our collection of fine artisan craft, luxury audio gear, and timepieces.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-950 text-white font-bold text-sm hover:bg-brand-900 transition-colors shadow-md"
        >
          Browse Catalogue
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between pb-6 border-b border-sand-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your personal bag
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
        >
          Clear Bag
        </button>
      </div>

      {/* Free Shipping Notification Progress */}
      <div className="p-4 bg-white rounded-2xl border border-sand-200 shadow-2xs space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-800">
            {isFreeShipping ? '🎉 You have unlocked complimentary express delivery!' : `Add $${amountToFreeShipping.toFixed(2)} more for complimentary shipping`}
          </span>
          <span className="text-slate-500">${Number(subtotal).toFixed(2)} / $150.00</span>
        </div>
        <div className="w-full h-2 bg-sand-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (Number(subtotal) / 150) * 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Cart Item Rows */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-sand-200 gap-4 shadow-2xs hover:border-sand-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-sand-100 flex-shrink-0 border border-sand-200">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <Link
                    to={`/products/${item.productId}`}
                    className="font-semibold text-sm sm:text-base text-slate-900 hover:text-brand-700 line-clamp-1"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unit Price: ${Number(item.unitPrice).toFixed(2)}
                  </p>
                  {item.availableStock !== undefined && item.availableStock < item.quantity && (
                    <span className="inline-block mt-1 text-[11px] text-amber-700 font-semibold">
                      Only {item.availableStock} in stock
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-sand-100">
                <div className="flex items-center border border-sand-300 rounded-full bg-sand-50/50 px-2 py-0.5">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-950 font-bold"
                  >
                    -
                  </button>
                  <span className="w-7 text-center text-xs font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-950 font-bold"
                  >
                    +
                  </button>
                </div>

                <span className="font-bold text-slate-950 text-base sm:w-24 text-right">
                  ${Number(item.lineTotal).toFixed(2)}
                </span>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  aria-label="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 hover:text-brand-950"
            >
              <ChevronLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Checkout Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 space-y-6 shadow-md">
          <h3 className="font-serif text-xl font-bold text-brand-950 border-b border-sand-200 pb-4">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({totalItems} items)</span>
              <span className="font-semibold text-slate-900">${Number(subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-slate-900">
                {isFreeShipping ? 'FREE' : '$15.00'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax (8%)</span>
              <span className="font-semibold text-slate-900">
                ${(Number(subtotal) * 0.08).toFixed(2)}
              </span>
            </div>

            <div className="pt-4 border-t border-sand-200 flex justify-between text-base font-bold text-slate-950">
              <span>Estimated Total</span>
              <span className="text-xl">
                ${(Number(subtotal) + (isFreeShipping ? 0 : 15) + Number(subtotal) * 0.08).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-full bg-brand-950 text-white font-bold text-sm hover:bg-brand-900 transition-all shadow-md flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted checkout & Stripe Test Provider</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CartPage;
