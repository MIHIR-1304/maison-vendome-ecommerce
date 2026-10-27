import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, ShieldCheck, Award, ArrowUpRight, ShoppingBag, 
  Eye, Heart, Compass, Check 
} from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import QuickViewModal from '../components/common/QuickViewModal';
import SmartCategoryGrids from '../components/home/SmartCategoryGrids';

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
      await addItem(product.id, 1, product);
      setAddedIds((prev) => new Set(prev).add(product.id));
      setTimeout(() => {
        setAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
      }, 2500);
    } catch (err) {
      console.error('Failed to add item to bag:', err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="space-y-16 pb-20 font-sans">
      
      {/* Grand Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-b border-amber-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
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

      {/* Amazon-Style Smart 4-in-1 Categories Section */}
      <SmartCategoryGrids />

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
          {(Array.isArray(categories) ? categories : []).map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] border border-amber-900/10 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 opacity-80 group-hover:opacity-70 transition-opacity"></div>
              
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
                  className="group relative bg-white rounded-2xl overflow-hidden border border-amber-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Stock / Atelier Badge */}
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                      {isOutOfStock ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-900/80 text-rose-100 backdrop-blur-md">
                          Archived
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-amber-300 backdrop-blur-md">
                          Atelier Stock: {product.stockQuantity}
                        </span>
                      )}
                    </div>

                    {/* Action Overlay: Wishlist & Quick View */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                        }}
                        className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow ${
                          inWishlist
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-white/80 text-slate-700 hover:text-rose-600 hover:bg-white'
                        }`}
                        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setQuickViewProduct(product);
                        }}
                        className="p-2.5 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-slate-950 hover:bg-white transition-all shadow opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200"
                        title="Quick View Piece"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-amber-800">
                        {product.category?.name || 'Maison Vendôme'}
                      </p>
                      <Link
                        to={`/products/${product.id}`}
                        className="font-serif text-lg font-medium text-slate-950 hover:text-amber-800 transition-colors line-clamp-1 block"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Prix d'Atelier</span>
                        <span className="font-serif text-xl font-normal text-slate-950 font-mono">
                          ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        disabled={isOutOfStock || addingId === product.id}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                          isAdded
                            ? 'bg-emerald-600 text-white shadow'
                            : isOutOfStock
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-slate-950 text-amber-200 hover:bg-slate-800 shadow-md active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Bag</span>
                          </>
                        ) : addingId === product.id ? (
                          <span>Adding...</span>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
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

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Atelier Experience Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-8 sm:p-14 border border-amber-500/20 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-300">
              The Place Vendôme Salon
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight">
              Bespoke Commissions & Private Viewing
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Experience the pinnacle of French craft. Schedule a private consultation at our Place Vendôme atelier or arrange for our traveling master horologist to visit your private residence.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="px-6 py-3 rounded-full bg-amber-400 text-slate-950 text-xs uppercase tracking-widest font-bold hover:bg-amber-300 transition-colors shadow"
              >
                Inquire With Salon
              </Link>
              <Link
                to="/products"
                className="px-6 py-3 rounded-full border border-amber-400/40 text-amber-200 text-xs uppercase tracking-widest font-semibold hover:bg-white/10 transition-colors"
              >
                Explore Catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
