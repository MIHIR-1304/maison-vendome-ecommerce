import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderApi.getOrders();
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Retrieving Maison Vendôme consignment archives..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-amber-900/10 pb-6">
        <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-amber-800 block">
          Patron Consignments
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-slate-950 mt-1">
          Vos Commandes & Consignations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your previous acquisitions, serial certifications, and white-glove courier status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-amber-900/10 p-8 space-y-5 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100/60 flex items-center justify-center text-amber-900/60 border border-amber-900/10">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-normal text-slate-900">No Consignments Placed Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              Your patron consignment ledger is empty. Explore our fine horology, artisan leather, and rare salon creations.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 text-amber-200 text-xs uppercase tracking-widest font-semibold hover:bg-slate-800 shadow-md transition-colors"
          >
            Explore Les Collections
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-slate-950">
                    {order.orderNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'Recent'}
                  </span>
                  <span>•</span>
                  <span>Destination: {order.city}, {order.country}</span>
                  <span>•</span>
                  <span>{order.items?.length || 0} Piece(s)</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 border-slate-100 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Settled Amount</span>
                  <span className="font-serif text-xl font-medium text-slate-950 font-mono">
                    ${Number(order.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  className="px-4 py-2.5 rounded-full bg-slate-950 text-amber-200 text-xs uppercase tracking-wider font-semibold hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  <span>View Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default OrderHistoryPage;
