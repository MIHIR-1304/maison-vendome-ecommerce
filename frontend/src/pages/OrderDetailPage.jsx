import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, ShieldCheck, CreditCard, Sparkles, Package } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Alert } from '../components/common/Alert';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderApi.getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load order dossier');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Retrieving Maison Vendôme consignment snapshot..." />;
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Alert type="error" message={error || 'Consignment record not found'} />
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
          <ChevronLeft className="w-4 h-4" /> Return to Consignments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-900/10">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/orders" className="p-2 rounded-full hover:bg-amber-100/50 text-slate-500 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold block">
                Consignment Dossier
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-slate-950">
                {order.orderNumber}
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 ml-12 mt-1">
            Registered on {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="ml-12 sm:ml-0">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            order.status === 'PAID'
              ? 'bg-emerald-100 text-emerald-800'
              : order.status === 'FULFILLED'
                ? 'bg-blue-100 text-blue-800'
                : order.status === 'PENDING_PAYMENT'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Shipping Destination */}
        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <MapPin className="w-4 h-4 text-amber-700" />
            <span>Courier Destination</span>
          </div>
          <p className="text-sm font-serif font-medium text-slate-900">{order.customerName}</p>
          <p className="text-xs text-slate-600">{order.shippingAddress}</p>
          <p className="text-xs text-slate-600">{order.city}, {order.postalCode}</p>
          <p className="text-xs text-slate-600">{order.country}</p>
        </div>

        {/* Patron Account */}
        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Patron Credentials</span>
          </div>
          <p className="text-sm font-serif font-medium text-slate-900">{order.customerEmail}</p>
          <p className="text-xs text-slate-500">Patron Registry ID: #{order.userId}</p>
          <p className="text-xs text-slate-500">Maison VIP Client Tier</p>
        </div>

        {/* Payment Reference */}
        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <CreditCard className="w-4 h-4 text-amber-700" />
            <span>Settlement Ledger</span>
          </div>
          <p className="text-lg font-serif font-medium text-slate-900 font-mono">
            ${Number(order.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500">Payment Reference: {order.paymentSessionId || 'Secured Provider'}</p>
          <p className="text-[11px] text-emerald-700 font-semibold">White-Glove Delivery Included</p>
        </div>

      </div>

      {/* Order Line Items Snapshot */}
      <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-medium text-slate-950 border-b border-amber-900/10 pb-3">
          Acquired Creations ({order.items?.length || 0})
        </h3>

        <div className="divide-y divide-slate-100">
          {(order.items || []).map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=300&q=80'}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <Link
                    to={`/products/${item.productId}`}
                    className="font-serif font-medium text-slate-900 hover:text-amber-800 text-sm line-clamp-1"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    Qty: {item.quantity} × ${Number(item.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <span className="font-serif font-medium text-slate-950 font-mono text-base">
                ${Number(item.lineTotal || item.unitPrice * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-amber-900/10 flex justify-between items-baseline">
          <span className="font-serif text-base font-normal text-slate-900">Total Settled</span>
          <span className="font-serif text-2xl font-normal text-amber-900 font-mono">
            ${Number(order.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

    </div>
  );
};

export default OrderDetailPage;
