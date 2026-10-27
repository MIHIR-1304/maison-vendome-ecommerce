import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Filter, ExternalLink, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Alert } from '../../components/common/Alert';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await orderApi.updateOrderStatus(orderId, newStatus);
      setMessage(`Order #${orderId} status successfully transitioned to ${newStatus}`);
      fetchOrders();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.error || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = statusFilter === 'ALL'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  if (loading && orders.length === 0) {
    return <LoadingSpinner text="Retrieving consignment records across microservices mesh..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-900/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-amber-800 mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Maison Logistics Registry</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-slate-950">
            Order Fulfillment & Consignments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage payment verification, stock allocations, and dispatch updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-white border border-amber-900/15 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Statuses ({orders.length})</option>
            <option value="PAID">PAID</option>
            <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
            <option value="FULFILLED">FULFILLED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="PAYMENT_FAILED">PAYMENT_FAILED</option>
          </select>
        </div>
      </div>

      {message && <Alert type="success" message={message} />}

      <div className="bg-white rounded-2xl border border-amber-900/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-amber-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">Consignment Ref</th>
                <th className="py-3.5 px-6">Patron</th>
                <th className="py-3.5 px-6">Destination</th>
                <th className="py-3.5 px-6">Settlement</th>
                <th className="py-3.5 px-6">Current State</th>
                <th className="py-3.5 px-6">Fulfillment Action</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No consignments found matching this filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      Patron #{order.userId}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {order.city}, {order.country}
                    </td>
                    <td className="py-4 px-6 font-serif font-bold text-slate-950 font-mono">
                      ${Number(order.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6">
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
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        {order.status === 'PAID' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'FULFILLED')}
                            disabled={updatingId === order.id}
                            className="px-2.5 py-1 rounded bg-slate-900 text-amber-200 text-[10px] uppercase font-bold tracking-wider hover:bg-slate-800 transition-colors"
                          >
                            Mark Fulfilled
                          </button>
                        )}
                        {['PENDING_PAYMENT', 'PAID'].includes(order.status) && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                            disabled={updatingId === order.id}
                            className="px-2.5 py-1 rounded border border-rose-300 text-rose-700 text-[10px] uppercase font-bold tracking-wider hover:bg-rose-50 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-amber-900 hover:text-amber-700 font-semibold"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminOrdersPage;
