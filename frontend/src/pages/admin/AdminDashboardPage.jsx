import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, ExternalLink, ShieldCheck, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { productApi } from '../../api/productApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminMetrics = async () => {
      try {
        setLoading(true);
        const [ordersData, productsData] = await Promise.all([
          orderApi.getOrders(),
          productApi.getProducts({ size: 1 })
        ]);
        setOrders(ordersData || []);
        setProductCount(productsData.totalElements || 0);
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminMetrics();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Aggregating Maison Vendôme metrics across microservices mesh..." />;
  }

  const totalRevenue = orders
    .filter((o) => ['PAID', 'FULFILLED'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === 'PENDING_PAYMENT').length;
  const fulfilledOrders = orders.filter((o) => o.status === 'FULFILLED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-900/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-800" /> Maison Director Suite
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-slate-950">
            Maison Atelier Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time oversight of consignment transactions, inventory archives, and microservices mesh health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 rounded-full bg-white border border-amber-900/15 text-xs font-semibold uppercase tracking-wider text-slate-800 hover:bg-amber-50 transition-colors shadow-xs"
          >
            Manage Catalogue
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-full bg-slate-950 text-amber-200 text-xs font-semibold uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-sm"
          >
            Fulfill Consignments
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Settled Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-2xl font-medium text-slate-950 font-mono">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500">From paid & fulfilled client consignments</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Consignments</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-2xl font-medium text-slate-950 font-mono">{orders.length}</p>
          <p className="text-[11px] text-slate-500">{pendingOrders} awaiting payment settlement</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Archived Creations</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-2xl font-medium text-slate-950 font-mono">{productCount}</p>
          <p className="text-[11px] text-slate-500">Curated across 5 specialty salons</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dispatched Orders</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-2xl font-medium text-slate-950 font-mono">{fulfilledOrders}</p>
          <p className="text-[11px] text-slate-500">White-glove courier fulfilled</p>
        </div>

      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
          <div>
            <h3 className="font-serif text-lg font-medium text-slate-950">Recent Client Consignments</h3>
            <p className="text-xs text-slate-500">Review status updates and Stripe / Mock settlement references</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs uppercase tracking-wider font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No client orders recorded in the registry yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
                  <span className="text-slate-400 ml-2">• Customer #{order.userId}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Destination: {order.city}, {order.country}
                  </p>
                </div>
                <div className="flex items-center gap-4">
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
                  <span className="font-serif font-medium text-slate-900 font-mono text-sm">
                    ${Number(order.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboardPage;
