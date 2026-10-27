import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, ShieldCheck, Truck, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Alert } from '../components/common/Alert';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productApi.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details. Product may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setError(null);
    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    } catch (err) {
      if (err.message && err.message.includes('sign in')) {
        navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to add item to cart');
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading luxury product specifications..." />;
  }

  if (error && !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <Alert type="error" message={error} />
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
          <ChevronLeft className="w-4 h-4" /> Return to Catalogue
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-slate-900">Catalogue</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link to={`/products?category=${product.category.slug}`} className="hover:text-slate-900">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Product Imagery */}
        <div className="lg:col-span-7">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-sand-100 border border-sand-200 shadow-md">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.category && (
              <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold bg-white/95 backdrop-blur-xs rounded-full text-brand-950 shadow-xs">
                {product.category.name}
              </span>
            )}
          </div>
        </div>

        {/* Product Details & Purchase Controls */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-3xl font-extrabold text-slate-950">
                ${Number(product.price).toFixed(2)}
              </span>
              
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-rose-500' : product.stockQuantity <= 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                <span className={`text-xs font-semibold ${isOutOfStock ? 'text-rose-700' : product.stockQuantity <= 5 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} units available`}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-b border-sand-200 py-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Design & Materials</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {error && <Alert type="error" message={error} />}

          {/* Quantity and Add to Cart Button */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 uppercase">Quantity</span>
              <div className="flex items-center border border-sand-300 rounded-full bg-white px-2 py-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-950 disabled:opacity-30"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold text-slate-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity || isOutOfStock}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-950 disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || adding}
              className={`w-full py-4 rounded-full font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-md ${
                addedSuccess
                  ? 'bg-emerald-700 text-white'
                  : isOutOfStock
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-brand-950 text-white hover:bg-brand-900 hover:shadow-xl'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-5 h-5 text-emerald-300" />
                  Added to Your Cart
                </>
              ) : adding ? (
                <span>Adding to Cart...</span>
              ) : isOutOfStock ? (
                <span>Currently Unavailable</span>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart &middot; ${(Number(product.price) * quantity).toFixed(2)}
                </>
              )}
            </button>
          </div>

          {/* Confidence Assurances */}
          <div className="grid grid-cols-3 gap-3 pt-4 text-center">
            <div className="p-3 bg-white rounded-xl border border-sand-200">
              <Truck className="w-4 h-4 mx-auto text-brand-600 mb-1" />
              <p className="text-[11px] font-semibold text-slate-800">Free Express</p>
              <p className="text-[10px] text-slate-400">On $150+ orders</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-sand-200">
              <ShieldCheck className="w-4 h-4 mx-auto text-brand-600 mb-1" />
              <p className="text-[11px] font-semibold text-slate-800">Authentic</p>
              <p className="text-[10px] text-slate-400">100% Certified</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-sand-200">
              <RotateCcw className="w-4 h-4 mx-auto text-brand-600 mb-1" />
              <p className="text-[11px] font-semibold text-slate-800">30-Day Return</p>
              <p className="text-[10px] text-slate-400">Pre-paid labels</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProductDetailPage;
