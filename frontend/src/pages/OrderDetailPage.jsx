import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, ShieldCheck, CreditCard } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
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
        setError(err.response?.data?.error || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Retrieving order snapshot..." />;
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Alert type="error" message={error || 'Order not found'} />
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
          <ChevronLeft className="w-4 h-4" /> Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/orders" className="p-1.5 rounded-full hover:bg-sand-100 text-slate-500">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
              Order {order.orderNumber}
            </h1>
          </div>
          <p className="text-xs text-slate-500 ml-9 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="ml-9 sm:ml-0">
          <Badge status={order.status} className="text-sm px-3 py-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Shipping Address */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>Shipping Destination</span>
          </div>
          <p className="text-sm font-bold text-slate-800">{order.customerName}</p>
          <p className="text-xs text-slate-600">{order.shippingAddress}</p>
          <p className="text-xs text-slate-600">{order.city}, {order.postalCode}</p>
          <p className="text-xs text-slate-600">{order.country}</p>
        </div>

        {/* Customer Contact */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Customer Account</span>
          </div>
          <p className="text-sm font-bold text-slate-800">{order.customerEmail}</p>
          <p className="text-xs text-slate-500">User ID: #{order.userId}</p>
          <p className="text-xs text-slate-500">Status: {order.status}</p>
        </div>

        {/* Payment Reference */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <CreditCard className="w-4 h-4 text-brand-600" />
            <span>Payment Session</span>
          </div>
          <p className="text-xs font-mono text-slate-700 truncate">
            {order.paymentSessionId || 'Session ID pending'}
          </p>
          {order.paymentId && (
            <p className="text-[11px] font-mono text-emerald-700 truncate">
              Payment ID: {order.paymentId}
            </p>
          )}
        </div>

      </div>

      {/* Immutable Purchased Line Items */}
      <div className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-sand-200 bg-sand-50/50">
          <h3 className="text-sm font-bold text-slate-900">Purchased Items Snapshot</h3>
        </div>

        <div className="divide-y divide-sand-100">
          {order.items?.map((item) => (
            <div key={item.id} className="p-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-sm text-slate-900">{item.productName}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  ${Number(item.unitPrice).toFixed(2)} &times; {item.quantity} {item.quantity === 1 ? 'unit' : 'units'}
                </p>
              </div>
              <span className="font-bold text-sm text-slate-950">
                ${Number(item.totalPrice).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="p-6 bg-sand-50/70 border-t border-sand-200 space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">${Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span className="font-semibold text-slate-900">
              {Number(order.shippingFee) === 0 ? 'FREE' : `$${Number(order.shippingFee).toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Taxes</span>
            <span className="font-semibold text-slate-900">${Number(order.tax).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-slate-950 pt-3 border-t border-sand-200">
            <span>Grand Total</span>
            <span className="text-xl text-brand-950">${Number(order.totalAmount).toFixed(2)} USD</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderDetailPage;
