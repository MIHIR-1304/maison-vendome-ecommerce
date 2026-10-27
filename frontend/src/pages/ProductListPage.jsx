import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ShoppingBag, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);

  // Search and Filter State derived from URL
  const search = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [searchInput, setSearchInput] = useState(search);
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
          size: 12,
          sortBy,
        });

        setProducts(res.content || []);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);
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

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-sand-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">The Collection</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950 mt-1">
            Store Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {totalElements} meticulously crafted luxury goods
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-sand-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          {searchInput && (
            <button
              type="button"
              onClick={() => { setSearchInput(''); updateParam('search', ''); }}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-sand-200 shadow-xs">
        
        {/* Category Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => updateParam('category', '')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              !categorySlug ? 'bg-brand-950 text-white' : 'bg-sand-100 text-slate-700 hover:bg-sand-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                categorySlug === cat.slug ? 'bg-brand-950 text-white' : 'bg-sand-100 text-slate-700 hover:bg-sand-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-sand-300 text-xs font-semibold text-slate-700 bg-sand-50"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter & Refine
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-medium text-slate-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => updateParam('sortBy', e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-sand-50 border border-sand-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="newest">Featured & Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Mobile Filter Drawer / Expandable */}
      {filterDrawerOpen && (
        <div className="lg:hidden p-5 bg-white rounded-2xl border border-sand-200 space-y-4 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Categories</h4>
            <button onClick={clearAllFilters} className="text-xs text-brand-600 font-semibold hover:underline">
              Reset Filters
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { updateParam('category', ''); setFilterDrawerOpen(false); }}
              className={`px-3 py-1 rounded-full text-xs font-medium ${!categorySlug ? 'bg-brand-950 text-white' : 'bg-sand-100 text-slate-700'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { updateParam('category', cat.slug); setFilterDrawerOpen(false); }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${categorySlug === cat.slug ? 'bg-brand-950 text-white' : 'bg-sand-100 text-slate-700'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <LoadingSpinner text="Searching catalogue..." />
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-sand-200 p-8 space-y-4">
          <p className="font-serif text-2xl font-bold text-slate-800">No matching products found</p>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            We couldn't find anything matching your search criteria. Try removing filters or adjusting terms.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 rounded-full bg-brand-950 text-white text-xs font-semibold hover:bg-brand-900 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-8">
          <button
            onClick={() => updateParam('page', String(page - 1))}
            disabled={page === 0}
            className="p-2.5 rounded-full border border-sand-300 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sand-50"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-semibold text-slate-600 px-3">
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={() => updateParam('page', String(page + 1))}
            disabled={page >= totalPages - 1}
            className="p-2.5 rounded-full border border-sand-300 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sand-50"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

export default ProductListPage;
