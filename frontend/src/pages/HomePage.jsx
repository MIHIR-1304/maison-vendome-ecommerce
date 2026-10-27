import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Award, ArrowUpRight, ShoppingBag, Eye, Heart, Compass, Check } from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import QuickViewModal from '../components/common/QuickViewModal';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          productApi.getProducts({ size: 6, sortBy: 'featured' }),
          productApi.getCategories()
        ]);
        setFeaturedProducts(prodRes.content || []);
        setCategories(catRes || []);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuickAdd = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAddingId(product.id);
      await addItem(product.id, 1);
      setAddedIds((prev) => new Set(prev).add(product.id));
      setTimeout(() => {
        setAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
      }, 2000);
    } catch (err) {
      alert(err.message || 'Please log in to add items to your shopping bag');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="space-y-24 pb-20 font-sans">
      
      {/* Grand Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-b border-amber-900/20">
        {/* Subtle Luxury Pattern / Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Nouvelles Créations • Place Vendôme</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-amber-50 leading-[1.08]">
                Haute Horlogerie & <br />
                <span className="italic font-light text-amber-200">Maroquinerie d’Art</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Hand-finished Swiss complications, vegetable-tanned Italian calfskin luggage, and acoustical instruments crafted for connoisseurs of timeless elegance and technical mastery.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-400 text-slate-950 text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-300 transition-all shadow-lg hover:shadow-amber-400/20 flex items-center justify-center gap-2 group"
                >
                  <span>Explore The Collections</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/products?category=haute-horlogerie"
                  className="w-full sm:w-auto px-8 py-4 rounded-full border border-amber-400/40 text-amber-100 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white/5 transition-colors text-center"
                >
                  Haute Horlogerie
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="font-serif text-xl font-normal text-amber-200">1892</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Atelier Heritage</p>
                </div>
                <div>
                  <p className="font-serif text-xl font-normal text-amber-200">100%</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Certified Authentic</p>
                </div>
                <div>
                  <p className="font-serif text-xl font-normal text-amber-200">Global</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">White-Glove Courier</p>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Piece */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-slate-900 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80"
                  alt="Vendôme Grand Complication Tourbillon"
                  className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Showcase Pill */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/30 text-white flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-semibold block">Piece Unique</span>
                    <h3 className="font-serif text-lg text-amber-100">Vendôme Grand Complication Tourbillon</h3>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">$4,850.00 USD</p>
                  </div>
                  <Link
                    to="/products"
                    className="p-3 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors flex-shrink-0 shadow"
                    title="View Creation"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Curated Categories Spotlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-amber-900/10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-800">
              The Departments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-950 font-normal mt-1">
              Curated Universes
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs uppercase tracking-widest font-semibold text-amber-900 hover:text-amber-700 inline-flex items-center gap-1 group"
          >
            <span>View All Universes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] border border-amber-900/10 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 opacity-80 group-hover:opacity-70 transition-opacity"></div>
              
              {/* Category Background Imagery */}
              <div className="w-full h-full bg-slate-800">
                <img
                  src={
                    cat.slug === 'haute-horlogerie'
                      ? 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
                      : cat.slug === 'maroquinerie'
                        ? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
                        : cat.slug === 'joaillerie-accessories'
                          ? 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
                          : cat.slug === 'acoustic-studio'
                            ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
                            : 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20 space-y-1 text-white">
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300 font-semibold block">
                  Haute Atelier
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-amber-50 group-hover:text-amber-200 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1 font-light opacity-90">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Novelties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-amber-900/10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-800">
              Autumn / Winter Novelties
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-950 font-normal mt-1">
              Exceptional Masterpieces
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs uppercase tracking-widest font-semibold text-amber-900 hover:text-amber-700 inline-flex items-center gap-1 group"
          >
            <span>Inspect All Pieces</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const isOutOfStock = product.stockQuantity <= 0;
              const isAdded = addedIds.has(product.id);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-amber-900/10 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative"
                >
                  {/* Image & Quick Actions */}
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <Link to={`/products/${product.id}`} className="block w-full h-full">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>

                    {/* Wishlist Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all ${
                        inWishlist
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-600'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick View Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-950/85 text-amber-100 text-xs uppercase tracking-wider font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-md flex items-center gap-1.5 shadow-lg hover:bg-slate-900"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Quick View
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-amber-900/70 mb-1 block">
                        {product.category?.name || 'Maison Creation'}
                      </span>
                      <Link to={`/products/${product.id}`}>
                        <h3 className="font-serif text-lg text-slate-900 group-hover:text-amber-800 transition-colors font-normal leading-snug">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <span className="font-serif text-xl text-slate-950">
                        ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        disabled={isOutOfStock || addingId === product.id}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          isAdded
                            ? 'bg-emerald-800 text-white'
                            : isOutOfStock
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-slate-900 text-amber-100 hover:bg-slate-800'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            {isOutOfStock ? 'Sold' : 'Add to Bag'}
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
      </section>

      {/* Savoir-Faire Editorial Storytelling Section */}
      <section className="bg-slate-950 text-white py-20 border-y border-amber-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-400">
                L'Art du Savoir-Faire
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-amber-50 font-normal leading-tight">
                Peerless Craftsmanship, <br />
                From Paris to the World
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                Every piece bearing the Maison Vendôme hallmark represents hundreds of hours of painstaking hand-craftsmanship by guild artisans in France, Switzerland, and Italy.
              </p>
              <ul className="space-y-4 pt-2 text-xs text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
                  <span><strong>Master Horology Calibers:</strong> Assembled under 10x binocular magnification in Le Brassus, with hand-beveled bridges and black-polished tourbillon cages.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
                  <span><strong>Full-Grain Tuscan Tannery:</strong> Hand-curried vegetable-tanned hides aged naturally with organic bark extracts for lifelong patina.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
                  <span><strong>Archival Provenance:</strong> Each creation carries an individually engraved serial number registered forever in our private Place Vendôme ledger.</span>
                </li>
              </ul>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80"
                alt="Artisan Leather Crafting"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-6 left-6 text-amber-200 font-serif italic text-sm">
                "Perfection is not an accident; it is our solemn obligation."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

    </div>
  );
};

export default HomePage;
