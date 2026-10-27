import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, Filter, ShoppingBag, X, ChevronLeft, ChevronRight, SlidersHorizontal, 
  Heart, Eye, Grid, Grid3X3, LayoutGrid, List, Check, Sparkles, ArrowUpDown 
} from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import QuickViewModal from '../components/common/QuickViewModal';

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addingId, setAddingId] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid-3'); // 'grid-4', 'grid-3', 'grid-2', 'list'

  // URL State
  const search = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'featured';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';

  const [searchInput, setSearchInput] = useState(search);
  const [customMin, setCustomMin] = useState(minPrice);
  const [customMax, setCustomMax] = useState(maxPrice);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    productApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);

        let categoryId = null;
        if (categorySlug && categories.length > 0) {
          const matched = categories.find((c) => c.slug === categorySlug);
          if (matched) categoryId = matched.id;
        }

        const res = await productApi.getProducts({
          search: search || undefined,
          categoryId: categoryId || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          page,
          size: 24,
          sortBy: sortBy === 'featured' ? undefined : sortBy,
        });

        let fetchedList = res.content || [];

        // Client-side in-stock filter if requested
        if (inStockOnly) {
          fetchedList = fetchedList.filter((p) => p.stockQuantity > 0);
        }

        // Client-side sorting for custom luxury options
        if (sortBy === 'price-desc') {
          fetchedList = [...fetchedList].sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortBy === 'price-asc') {
          fetchedList = [...fetchedList].sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === 'name-asc') {
          fetchedList = [...fetchedList].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'name-desc') {
          fetchedList = [...fetchedList].sort((a, b) => b.name.localeCompare(a.name));
        }

        setProducts(fetchedList);
        setTotalPages(res.totalPages || 1);
        setTotalElements(fetchedList.length);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchParams, categories]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value !== undefined && value !== null && value !== '') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== 'page') {
      next.set('page', '0');
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const applyPriceRange = (min, max) => {
    const next = new URLSearchParams(searchParams);
    if (min) next.set('minPrice', min); else next.delete('minPrice');
    if (max) next.set('maxPrice', max); else next.delete('maxPrice');
    next.set('page', '0');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setCustomMin('');
    setCustomMax('');
    setSearchParams({});
  };

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
      console.error('Error adding item to bag:', err);
    } finally {
      setAddingId(null);
    }
  };

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Editorial Luxury Header */}
      <div className="text-center max-w-3xl mx-auto py-6 border-b border-amber-900/10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-800">
          Maison Vendôme Paris
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-slate-950 mt-2 tracking-tight">
          {activeCategory ? activeCategory.name : 'Les Collections Maison'}
        </h1>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          {activeCategory 
            ? activeCategory.description 
            : 'Discover hand-finished horology, artisan leather goods, and rare objects crafted by master artisans with timeless distinction.'}
        </p>
      </div>

      {/* Main Filter & Control Bar */}
      <div className="bg-white rounded-2xl border border-amber-900/10 p-4 shadow-sm space-y-4">
        
        {/* Top Row: Categories & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Category Tabs (Desktop) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => updateParam('category', '')}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap ${
                !categorySlug
                  ? 'bg-slate-900 text-amber-100 shadow-sm'
                  : 'bg-amber-100/40 text-slate-700 hover:bg-amber-100'
              }`}
            >
              All Creations
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => updateParam('category', c.slug)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap ${
                  categorySlug === c.slug
                    ? 'bg-slate-900 text-amber-100 shadow-sm'
                    : 'bg-amber-100/40 text-slate-700 hover:bg-amber-100'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[260px] lg:w-72">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or material..."
              className="w-full pl-9 pr-8 py-2 rounded-full border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 bg-slate-50/50"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); updateParam('search', ''); }}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Second Row: Refinement Filters, Sorting, and View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          
          {/* Left: Quick Price Chips & In-Stock Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold mr-1">Price:</span>
            {[
              { label: 'All', min: '', max: '' },
              { label: 'Under $500', min: '', max: '500' },
              { label: '$500 — $1,000', min: '500', max: '1000' },
              { label: '$1,000 — $2,500', min: '1000', max: '2500' },
              { label: '$2,500+', min: '2500', max: '' },
            ].map((p, idx) => {
              const active = minPrice === p.min && maxPrice === p.max;
              return (
                <button
                  key={idx}
                  onClick={() => applyPriceRange(p.min, p.max)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    active
                      ? 'border-amber-800 bg-amber-900 text-white'
                      : 'border-slate-200 text-slate-600 hover:border-slate-400 bg-white'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}

            {/* In-Stock Toggle */}
            <button
              onClick={() => updateParam('inStock', inStockOnly ? '' : 'true')}
              className={`ml-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                inStockOnly
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 text-slate-600 hover:border-slate-400 bg-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-emerald-600' : 'bg-slate-300'}`}></span>
              In Stock Only
            </button>
          </div>

          {/* Right: Sorting & Grid View Switcher */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => updateParam('sortBy', e.target.value)}
                className="bg-transparent focus:outline-none text-xs font-medium text-slate-800 cursor-pointer"
              >
                <option value="featured">Curated (Featured)</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="name-asc">Title: A to Z</option>
                <option value="name-desc">Title: Z to A</option>
              </select>
            </div>

            {/* Grid Layout Switcher */}
            <div className="hidden sm:flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
              <button
                onClick={() => setViewMode('grid-4')}
                className={`p-1.5 transition-colors ${viewMode === 'grid-4' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                title="4-Column Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid-3')}
                className={`p-1.5 transition-colors ${viewMode === 'grid-3' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                title="3-Column Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid-2')}
                className={`p-1.5 transition-colors ${viewMode === 'grid-2' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                title="2-Column Grid"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Active Filters Summary Bar */}
      {(search || categorySlug || minPrice || maxPrice || inStockOnly) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Applied Refinements:</span>
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/70 text-slate-800 border border-amber-900/10">
              Keyword: "{search}"
              <button onClick={() => updateParam('search', '')}><X className="w-3 h-3 hover:text-rose-600" /></button>
            </span>
          )}
          {activeCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/70 text-slate-800 border border-amber-900/10">
              Category: {activeCategory.name}
              <button onClick={() => updateParam('category', '')}><X className="w-3 h-3 hover:text-rose-600" /></button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/70 text-slate-800 border border-amber-900/10">
              Price: ${minPrice || '0'} — ${maxPrice || '∞'}
              <button onClick={() => applyPriceRange('', '')}><X className="w-3 h-3 hover:text-rose-600" /></button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              In Stock Only
              <button onClick={() => updateParam('inStock', '')}><X className="w-3 h-3 hover:text-rose-600" /></button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-rose-600 hover:text-rose-700 underline font-medium ml-2"
          >
            Clear All Refinements
          </button>
        </div>
      )}

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Displaying {products.length} Exceptional Creations</span>
        <span className="uppercase tracking-wider font-semibold text-amber-900/70">Maison Guarantee • Insured Delivery</span>
      </div>

      {/* Main Products Grid */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-normal text-slate-900">No creations matched your criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms, removing price constraints, or selecting a different category.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-full bg-slate-900 text-amber-100 text-xs font-semibold uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            Reset All Refinements
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* Detailed List View */
        <div className="space-y-4">
          {products.map((product) => {
            const inWishlist = isInWishlist(product.id);
            const isOutOfStock = product.stockQuantity <= 0;
            const isAdded = addedIds.has(product.id);

            return (
              <div 
                key={product.id}
                className="bg-white rounded-2xl border border-amber-900/10 p-5 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-all group"
              >
                <div className="relative w-full sm:w-48 h-48 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                    <span className="absolute bottom-2 left-2 bg-slate-900/80 text-amber-300 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold backdrop-blur-xs">
                      Low Stock
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <span className="text-[11px] uppercase tracking-widest text-amber-800/80 font-semibold">
                    {product.category?.name || 'Maison Creation'}
                  </span>
                  <Link to={`/products/${product.id}`} className="block">
                    <h3 className="font-serif text-xl text-slate-900 hover:text-amber-800 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">
                    {product.description}
                  </p>
                  <div className="text-xs text-slate-500 pt-1 flex items-center justify-center sm:justify-start gap-4">
                    <span>★ 4.9 (Master Atelier)</span>
                    <span>•</span>
                    <span className={product.stockQuantity > 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} pieces in reserve` : 'Sold Out'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end justify-between gap-4 flex-shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                  <span className="font-serif text-2xl text-slate-900">
                    ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(product)}
                      className="p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className={`p-2.5 rounded-lg border transition-colors ${
                        inWishlist
                          ? 'border-rose-300 bg-rose-50 text-rose-600'
                          : 'border-slate-200 text-slate-600 hover:text-rose-600'
                      }`}
                      title="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={isOutOfStock || addingId === product.id}
                      className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
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
                          {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid Views (2, 3, or 4 columns) */
        <div className={`grid gap-6 ${
          viewMode === 'grid-4' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
            : viewMode === 'grid-2'
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}>
          {products.map((product) => {
            const inWishlist = isInWishlist(product.id);
            const isOutOfStock = product.stockQuantity <= 0;
            const isAdded = addedIds.has(product.id);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-amber-900/10 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-amber-900/20 transition-all duration-300 relative"
              >
                {/* Image Container with Hover Actions */}
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  <Link to={`/products/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </Link>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.price > 2000 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/85 text-amber-300 backdrop-blur-md">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        Grand Piece
                      </span>
                    )}
                    {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-900/80 text-amber-100 backdrop-blur-md">
                        {product.stockQuantity} Left
                      </span>
                    )}
                  </div>

                  {/* Top Right Wishlist Toggle */}
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

                  {/* Hover Quick View Pill */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-950/85 text-amber-100 text-xs uppercase tracking-wider font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-md flex items-center gap-1.5 hover:bg-slate-900 shadow-lg"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Quick View
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Category */}
                    <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-amber-900/70 mb-1">
                      {product.category?.name || 'Maison Creation'}
                    </div>

                    {/* Title */}
                    <Link to={`/products/${product.id}`} className="block">
                      <h3 className="font-serif text-lg text-slate-900 group-hover:text-amber-800 transition-colors font-normal leading-snug">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Micro Description */}
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Add to Bag */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="font-serif text-xl text-slate-950">
                      ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={isOutOfStock || addingId === product.id}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs ${
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
                          {isOutOfStock ? 'Out' : 'Bag'}
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

export default ProductListPage;
