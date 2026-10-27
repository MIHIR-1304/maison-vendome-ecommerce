import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist, totalValue } = useWishlist();
  const { addItem } = useCart();
  const [movingId, setMovingId] = useState(null);
  const [movedIds, setMovedIds] = useState(new Set());

  const handleMoveToBag = async (product) => {
    try {
      setMovingId(product.id);
      await addItem(product.id, 1);
      setMovedIds((prev) => new Set(prev).add(product.id));
      setTimeout(() => {
        removeFromWishlist(product.id);
      }, 1000);
    } catch (err) {
      alert(err.message || 'Please log in to add items to your shopping bag');
    } finally {
      setMovingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-sans">
      
      {/* Page Header */}
      <div className="border-b border-amber-900/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-800">
            Private Curation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-slate-950 font-normal mt-1">
            Your Maison Wishlist
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {wishlist.length} {wishlist.length === 1 ? 'creation' : 'creations'} reserved in your personal salon
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Total Selection Value</span>
              <span className="font-serif text-xl text-slate-900 font-medium">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <button
              onClick={clearWishlist}
              className="text-xs text-slate-500 hover:text-rose-600 underline font-medium"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-amber-900/15 p-8 max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl text-slate-900 font-normal">
            Your Wishlist is Currently Empty
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Curate your personal collection of Haute Horlogerie, artisan Maroquinerie, and rare objects by clicking the heart emblem on any piece.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-amber-100 text-xs uppercase tracking-widest font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>Explore Les Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const isMoved = movedIds.has(item.id);
            const isOutOfStock = item.stockQuantity <= 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-amber-900/10 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
              >
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  <Link to={`/products/${item.id}`}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white shadow transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-amber-200 backdrop-blur-sm">
                    {item.category?.name || 'Maison Creation'}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <Link to={`/products/${item.id}`}>
                      <h3 className="font-serif text-lg text-slate-900 hover:text-amber-800 transition-colors leading-tight">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="font-serif text-xl text-slate-950">
                      ${Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleMoveToBag(item)}
                      disabled={isOutOfStock || movingId === item.id || isMoved}
                      className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs ${
                        isMoved
                          ? 'bg-emerald-800 text-white'
                          : isOutOfStock
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 text-amber-100 hover:bg-slate-800'
                      }`}
                    >
                      {isMoved ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added to Bag
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          {isOutOfStock ? 'Sold Out' : 'Move to Bag'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default WishlistPage;
