import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Filter, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';
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
      setMessage(`Order #${orderId} updated to ${newStatus}`);
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
    return <LoadingSpinner text="Retrieving orders across microservices mesh..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-950">
            Order Fulfillment & Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor payment transitions, customer deliveries, and dispatch notifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-white border border-sand-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
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

      <div className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-50/80 border-b border-sand-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-6">Order Ref</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Destination</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Current Status</th>
                <th className="py-4 px-6">Fulfillment Action</th>
                <th className="py-4 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 font-medium">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-sand-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono font-bold text-slate-900 block">{order.orderNumber}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{order.customerName}</p>
                    <p className="text-[11px] text-slate-500">{order.customerEmail}</p>
                  </td>

                  <td className="py-4 px-6 text-slate-600">
                    <p className="truncate max-w-[150px]">{order.shippingAddress}</p>
                    <p className="text-[11px] text-slate-400">{order.city}, {order.country}</p>
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>

                  <td className="py-4 px-6">
                    <Badge status={order.status} />
                  </td>

                  <td className="py-4 px-6">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-xs font-semibold bg-sand-50 border border-sand-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                      <option value="PAID">PAID</option>
                      <option value="FULFILLED">FULFILLED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-950"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminOrdersPage;
