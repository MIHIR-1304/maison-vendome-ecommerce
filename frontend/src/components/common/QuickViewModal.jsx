import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Check, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function QuickViewModal({ product, onClose }) {
  const { addItem, loading: cartLoading } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = async () => {
    try {
      await addItem(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-[#FAF9F5] border border-amber-900/10 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white shadow transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative bg-slate-100 min-h-[320px] md:min-h-[420px] overflow-hidden flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-slate-900/80 text-amber-200 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Maison Exclusive
            </span>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category */}
              <div className="text-xs uppercase tracking-widest text-amber-800/80 font-medium mb-1">
                {product.category?.name || 'Haute Creation'}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-serif text-slate-900 mb-2 font-normal leading-tight">
                {product.name}
              </h2>

              {/* Price & Stock */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-amber-900/10">
                <span className="text-2xl font-serif text-slate-900">
                  ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                  isOutOfStock 
                    ? 'bg-rose-50 text-rose-700' 
                    : product.stockQuantity < 10 
                      ? 'bg-amber-50 text-amber-700' 
                      : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {isOutOfStock ? 'Sold Out' : product.stockQuantity < 10 ? `Only ${product.stockQuantity} Remaining` : 'In Stock & Ready to Dispatch'}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-xs text-slate-600 bg-white/60 p-3 rounded-xl border border-amber-900/5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Certified Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-700" />
                  <span>White-Glove Courier</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {/* Quantity */}
                <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-medium text-slate-900 w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                    disabled={quantity >= product.stockQuantity || isOutOfStock}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || cartLoading}
                  className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm ${
                    added
                      ? 'bg-emerald-800 text-white'
                      : isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 text-amber-100 hover:bg-slate-800'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      {isOutOfStock ? 'Currently Unavailable' : 'Add to Shopping Bag'}
                    </>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-lg border transition-colors ${
                    inWishlist
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-slate-300 bg-white text-slate-600 hover:text-rose-600'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* View Full Product Link */}
              <Link
                to={`/products/${product.id}`}
                onClick={onClose}
                className="block text-center text-xs tracking-wider uppercase text-slate-600 hover:text-slate-900 underline underline-offset-4"
              >
                Inspect Full Savoir-Faire & Specifications →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
