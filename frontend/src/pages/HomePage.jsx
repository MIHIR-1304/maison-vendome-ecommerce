import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Cpu, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          productApi.getProducts({ size: 4, sortBy: 'newest' }),
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

  const handleQuickAdd = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAddingId(productId);
      await addToCart(productId, 1);
    } catch (err) {
      alert(err.message || 'Please log in to add items');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-radial from-sand-100 to-[#FAF9F5] border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-950 text-white text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-brand-300" />
                <span>Autumn Collection 2026</span>
              </div>
              
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-brand-950 leading-[1.1]">
                Uncompromising <br className="hidden sm:inline" />
                <span className="italic font-normal">Everyday Elegance.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Precision engineered sound, artisan full-grain leather, and timeless horology. Handpicked quality backed by an autonomous microservices mesh.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-brand-950 text-white font-semibold text-sm hover:bg-brand-900 shadow-lg hover:shadow-xl transition-all"
                >
                  Explore Catalogue
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products?category=audio-electronics"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-white border border-sand-300 text-slate-800 font-semibold text-sm hover:bg-sand-50 transition-colors"
                >
                  High-Fidelity Audio
                </Link>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border border-sand-200 aspect-[4/5] bg-sand-200">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
                  alt="Aura Studio Headphones"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent flex items-end p-8">
                  <div className="text-white space-y-1">
                    <span className="text-xs uppercase font-semibold text-brand-300 tracking-wider">Featured Masterpiece</span>
                    <h3 className="font-serif text-2xl font-bold">Aura Studio ANC Headphones</h3>
                    <p className="text-sm text-slate-300">$299.00 USD &middot; Beryllium Drivers</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Curated Departments</span>
            <h2 className="font-serif text-3xl font-bold text-brand-950 mt-1">Shop by Category</h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-950">
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group p-6 rounded-2xl bg-white border border-sand-200 hover:border-brand-300 hover:shadow-md transition-all text-center flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 mx-auto rounded-full bg-sand-100 group-hover:bg-brand-50 flex items-center justify-center text-brand-800 transition-colors mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-sm text-slate-800 group-hover:text-brand-950">{cat.name}</h4>
              </div>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Handcrafted Excellence</span>
            <h2 className="font-serif text-3xl font-bold text-brand-950 mt-1">Trending Essentials</h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-950">
            Browse complete catalogue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving catalogue..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group flex flex-col bg-white rounded-2xl border border-sand-200 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="relative aspect-square overflow-hidden bg-sand-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold bg-white/90 backdrop-blur-xs rounded-full text-slate-800 shadow-xs">
                      {product.category.name}
                    </span>
                  )}
                  <button
                    onClick={(e) => handleQuickAdd(e, product.id)}
                    disabled={addingId === product.id || product.stockQuantity === 0}
                    className="absolute bottom-3 right-3 p-2.5 rounded-full bg-brand-950 text-white hover:bg-brand-800 shadow-md transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                    title="Quick Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-sand-100 flex items-center justify-between">
                    <span className="font-bold text-slate-950 text-base">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <span className={`text-xs font-semibold ${product.stockQuantity > 5 ? 'text-emerald-700' : product.stockQuantity > 0 ? 'text-amber-700' : 'text-rose-700'}`}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Microservices Architecture Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-800/80 border border-brand-700 text-brand-200 text-xs font-mono font-medium">
              <Cpu className="w-3.5 h-3.5 text-brand-300" />
              <span>Full Microservices Mesh Architecture</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Engineered with Scalable Isolation.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every domain—identity, catalogue, cart, orders, payment, and notifications—is operated as an independent, stateful Java 21 Spring Boot service with atomic database locking, preventing overselling under high concurrency.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">Java 21 & Spring Boot 3.3</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">Stripe Checkout Session</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">NGINX Path Routing</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">PostgreSQL Isolated DBs</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
