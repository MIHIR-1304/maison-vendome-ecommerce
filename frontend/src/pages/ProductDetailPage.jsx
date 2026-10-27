import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, ChevronLeft, ShieldCheck, Truck, RotateCcw, Check, 
  AlertCircle, Heart, Sparkles, Star, Award, Compass, ArrowRight 
} from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Alert } from '../components/common/Alert';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productApi.getProductById(id);
        setProduct(data);

        // Fetch related products in the same category
        if (data.category?.id) {
          const relatedRes = await productApi.getProducts({
            categoryId: data.category.id,
            size: 4
          });
          setRelatedProducts((relatedRes.content || []).filter((p) => p.id !== data.id).slice(0, 3));
        }
      } catch (err) {
        setError('Failed to load creation details. The piece may have been archived.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = async () => {
    setError(null);
    try {
      setAdding(true);
      await addItem(product.id, quantity, product);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add item to your shopping bag');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving Maison Vendôme archival records..." />;
  }

  if (error && !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <Alert type="error" message={error} />
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-slate-900 underline underline-offset-4"
        >
          <ChevronLeft className="w-4 h-4" /> Return to Catalogue
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 font-sans">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 uppercase tracking-wider">
        <Link to="/" className="hover:text-slate-900">Maison</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-slate-900">Collections</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link to={`/products?category=${product.category.slug}`} className="hover:text-slate-900">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: High-Res Master Imagery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square rounded-3xl bg-slate-100 overflow-hidden border border-amber-900/10 shadow-lg group">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Top Maison Badge */}
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-slate-950/85 text-amber-200 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Maison Vendôme Certified
            </span>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-colors ${
                inWishlist
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-600'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Sub-Badges Guarantee Row */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-slate-600 pt-2">
            <div className="bg-white/80 border border-amber-900/10 rounded-xl p-3 flex flex-col items-center justify-center gap-1">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <span className="font-medium text-slate-900">Certified Authentic</span>
              <span className="text-[10px] text-slate-400">Master Archivist Sealed</span>
            </div>
            <div className="bg-white/80 border border-amber-900/10 rounded-xl p-3 flex flex-col items-center justify-center gap-1">
              <Truck className="w-5 h-5 text-amber-700" />
              <span className="font-medium text-slate-900">Insured Delivery</span>
              <span className="text-[10px] text-slate-400">White-Glove Courier</span>
            </div>
            <div className="bg-white/80 border border-amber-900/10 rounded-xl p-3 flex flex-col items-center justify-center gap-1">
              <Award className="w-5 h-5 text-amber-700" />
              <span className="font-medium text-slate-900">Atelier Warranty</span>
              <span className="text-[10px] text-slate-400">Lifetime Servicing</span>
            </div>
          </div>
        </div>

        {/* Right Column: Acquisition & Details */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-800 block mb-2">
              {product.category?.name || 'Maison Creation'}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-slate-950 font-normal leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-slate-800">4.9 / 5.0</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">28 Connoisseur Appraisals</span>
            </div>
          </div>

          {/* Pricing & Stock Status */}
          <div className="p-5 rounded-2xl bg-white border border-amber-900/10 shadow-xs space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Acquisition Value</span>
                <span className="font-serif text-3xl sm:text-4xl text-slate-950 font-medium">
                  ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isOutOfStock
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : product.stockQuantity < 10
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {isOutOfStock ? 'Sold Out' : product.stockQuantity < 10 ? `Only ${product.stockQuantity} Pieces In Reserve` : 'Available for Immediate Dispatch'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Includes complimentary customs clearance, bespoke wooden casing, and insured courier dispatch.
            </p>
          </div>

          {error && <Alert type="error" message={error} />}

          {/* Quantity and Add to Bag */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-slate-600 font-semibold">Allocation:</span>
              <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-slate-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  disabled={quantity >= product.stockQuantity || isOutOfStock}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                className={`flex-1 py-4 px-8 rounded-full text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  addedSuccess
                    ? 'bg-emerald-800 text-white'
                    : isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-950 text-amber-100 hover:bg-slate-900 hover:shadow-xl'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Shopping Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {isOutOfStock ? 'Sold Out' : 'Acquire Creation'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-full border transition-colors shadow-xs ${
                  inWishlist
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-slate-300 bg-white text-slate-700 hover:text-rose-600'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Description Snippet */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            {product.description}
          </p>

        </div>
      </div>

      {/* Tabs: Savoir-Faire, Specifications, Delivery */}
      <div className="bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-8 border-b border-slate-200 pb-4 overflow-x-auto text-xs uppercase tracking-widest font-semibold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 -mb-4 transition-colors border-b-2 ${
              activeTab === 'description'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Artisan Notes & Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 -mb-4 transition-colors border-b-2 ${
              activeTab === 'specs'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Savoir-Faire & Specifications
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-3 -mb-4 transition-colors border-b-2 ${
              activeTab === 'delivery'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            White-Glove Delivery & Concierge
          </button>
        </div>

        {/* Tab Content */}
        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif text-xl text-slate-900 font-normal">The Masterpiece in Detail</h3>
              <p>{product.description}</p>
              <p>
                Each creation from Maison Vendôme is inspected individually in our Place Vendôme salon before receiving its archive certification wax seal and presentation case.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-serif text-xl text-slate-900 font-normal">Technical Specifications</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs pt-2">
                <span className="text-slate-400 uppercase tracking-wider font-medium">Archive Reference:</span>
                <span className="font-mono text-slate-800">MV-{product.id}-2026</span>
                <span className="text-slate-400 uppercase tracking-wider font-medium">Origin:</span>
                <span className="text-slate-800">Paris, France / Le Brassus, Switzerland</span>
                <span className="text-slate-400 uppercase tracking-wider font-medium">Department:</span>
                <span className="text-slate-800">{product.category?.name || 'Maison Atelier'}</span>
                <span className="text-slate-400 uppercase tracking-wider font-medium">Reserve Stock:</span>
                <span className="text-slate-800">{product.stockQuantity} units catalogued</span>
                <span className="text-slate-400 uppercase tracking-wider font-medium">Certification:</span>
                <span className="text-slate-800">Guaranteed Place Vendôme Provenance</span>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif text-xl text-slate-900 font-normal">Complimentary White-Glove Courier Service</h3>
              <p>
                All orders are dispatched via dedicated armored courier with continuous satellite tracking and personalized delivery appointments.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                <li>Delivery within 2–4 business days across Europe, North America, and East Asia.</li>
                <li>Signature on personal delivery required with ID verification.</li>
                <li>30-day complimentary private return or exchange arranged by our client salon.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* "You May Also Admire" Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-amber-900/10">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-800">
                Curated Recommendations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-slate-950 font-normal mt-1">
                You May Also Admire
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs uppercase tracking-widest font-semibold text-slate-900 hover:text-amber-800 inline-flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                to={`/products/${rel.id}`}
                className="group bg-white rounded-2xl border border-amber-900/10 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  <img
                    src={rel.imageUrl}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-amber-800/80 font-semibold block">
                    {rel.category?.name || 'Maison Creation'}
                  </span>
                  <h3 className="font-serif text-base text-slate-900 group-hover:text-amber-800 transition-colors truncate">
                    {rel.name}
                  </h3>
                  <span className="font-serif text-sm text-slate-950 block pt-1">
                    ${Number(rel.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
