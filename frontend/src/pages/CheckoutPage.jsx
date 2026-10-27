import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, MapPin, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../api/paymentApi';
import { Alert } from '../components/common/Alert';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, totalItems, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    shippingAddress: user?.address || '100 Grand Avenue',
    city: user?.city || 'San Francisco',
    postalCode: user?.postalCode || '94105',
    country: user?.country || 'United States',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock Payment Modal State
  const [mockSession, setMockSession] = useState(null);
  const [mockProcessing, setMockProcessing] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !mockSession) {
      navigate('/cart');
    }
  }, [items, mockSession, navigate]);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Submit Order to Order Service (triggers atomic stock reservation)
      const order = await orderApi.checkout({
        shippingAddress: shippingAddress.shippingAddress,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      });

      // 2. Initialize Payment Session in Payment Service
      const session = await paymentApi.createSession(order.id);

      if (session.provider === 'STRIPE' && session.checkoutUrl && session.checkoutUrl.startsWith('http')) {
        // Real Stripe Checkout redirect
        window.location.href = session.checkoutUrl;
      } else {
        // Local Mock Provider UI
        setMockSession({
          ...session,
          orderId: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
        });
        refreshCart();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Checkout failed. Please review stock availability.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockAction = async (outcome) => {
    try {
      setMockProcessing(true);
      await paymentApi.completeMockPayment(mockSession.sessionId, outcome);
      if (outcome === 'PAID') {
        navigate(`/payment/success?session_id=${mockSession.sessionId}&order_id=${mockSession.orderId}`);
      } else {
        navigate(`/payment/cancel?session_id=${mockSession.sessionId}&order_id=${mockSession.orderId}`);
      }
    } catch (err) {
      setError('Mock payment callback failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setMockProcessing(false);
    }
  };

  const isFreeShipping = Number(subtotal) >= 150;
  const shippingFee = isFreeShipping ? 0 : 15;
  const estimatedTax = Number(subtotal) * 0.08;
  const totalAmount = Number(subtotal) + shippingFee + estimatedTax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your shipping destination and finalize payment
        </p>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Mock Payment Simulation Modal / Banner */}
      {mockSession ? (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border-2 border-brand-800 p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
              Local Development Mode
            </span>
            <h2 className="font-serif text-2xl font-bold text-brand-950">
              Simulate Payment Outcome
            </h2>
            <p className="text-xs text-slate-500">
              Stripe credentials not configured. Using isolated local Payment Provider for Order #{mockSession.orderNumber}.
            </p>
          </div>

          <div className="p-4 bg-sand-50 rounded-2xl border border-sand-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Number</span>
              <span className="font-mono font-bold text-slate-900">{mockSession.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Authorized Amount</span>
              <span className="font-bold text-emerald-800 text-base">${Number(mockSession.totalAmount).toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Session ID</span>
              <span className="font-mono truncate max-w-[200px]">{mockSession.sessionId}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleMockAction('PAID')}
              disabled={mockProcessing}
              className="w-full py-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              {mockProcessing ? 'Processing Transaction...' : `Simulate Successful Payment ($${Number(mockSession.totalAmount).toFixed(2)})`}
            </button>

            <button
              onClick={() => handleMockAction('CANCELLED')}
              disabled={mockProcessing}
              className="w-full py-3 rounded-full bg-sand-100 hover:bg-sand-200 text-rose-700 font-semibold text-xs border border-sand-300 flex items-center justify-center gap-2 transition-all"
            >
              <XCircle className="w-4 h-4" />
              Simulate Payment Cancellation / Decline
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Shipping Form */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 space-y-6 shadow-sm">
            
            <div className="flex items-center gap-2.5 pb-4 border-b border-sand-200">
              <MapPin className="w-5 h-5 text-brand-600" />
              <h3 className="font-serif text-xl font-bold text-slate-900">
                1. Delivery Address
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Street Address</label>
                <input
                  type="text"
                  name="shippingAddress"
                  required
                  value={shippingAddress.shippingAddress}
                  onChange={handleInputChange}
                  placeholder="100 Grand Avenue, Apt 4B"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-sand-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="San Francisco"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-sand-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Postal / ZIP Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    placeholder="94105"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-sand-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Country</label>
                <input
                  type="text"
                  name="country"
                  required
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  placeholder="United States"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-sand-50/50"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-sand-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-brand-950 text-white font-bold text-sm hover:bg-brand-900 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Validating Stock & Placing Order...' : 'Continue to Payment & Review'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Checkout Order Summary Review */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 space-y-6 shadow-md">
            <h3 className="font-serif text-xl font-bold text-brand-950 border-b border-sand-200 pb-4">
              Review Bag ({totalItems})
            </h3>

            {/* Line Item Thumbnails */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-sand-100 border border-sand-200"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 line-clamp-1">{item.productName}</p>
                      <p className="text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">${Number(item.lineTotal).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm border-t border-sand-200 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${Number(subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">{isFreeShipping ? 'FREE' : '$15.00'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-900">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-950 pt-2 border-t border-sand-100">
                <span>Total Due</span>
                <span className="text-xl text-brand-950">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-sand-50 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-700 flex-shrink-0" />
              <span>Prices verified against backend database. Stock held securely upon checkout.</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default CheckoutPage;
