import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, ShoppingBag } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';

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
    return <LoadingSpinner text="Retrieving your orders..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-sand-200 pb-6">
        <h1 className="font-serif text-3xl font-bold text-brand-950">
          Order History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review previous purchases, tracking and immutable transaction receipts
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-sand-200 p-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-sand-100 flex items-center justify-center text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-900">No Orders Placed Yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You have not placed any orders yet. Discover our latest collections and curated designs.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-950 text-white font-bold text-xs hover:bg-brand-900 shadow-sm"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-sand-200 p-6 shadow-2xs hover:border-sand-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {order.orderNumber}
                  </span>
                  <Badge status={order.status} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span>&middot;</span>
                  <span>{order.items?.length || 0} line {order.items?.length === 1 ? 'item' : 'items'}</span>
                  <span>&middot;</span>
                  <span>Delivered to: {order.city}, {order.country}</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-0 border-sand-100">
                <div className="text-left md:text-right">
                  <p className="text-xs text-slate-400">Total Amount</p>
                  <p className="text-base font-extrabold text-slate-900">
                    ${Number(order.totalAmount).toFixed(2)}
                  </p>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sand-50 hover:bg-sand-100 border border-sand-300 text-xs font-semibold text-brand-950 transition-colors"
                >
                  View Details
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
