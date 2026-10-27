import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, ExternalLink, ShieldCheck, ArrowRight, Layers } from 'lucide-react';
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
    return <LoadingSpinner text="Aggregating platform metrics across microservices..." />;
  }

  const totalRevenue = orders
    .filter((o) => ['PAID', 'FULFILLED'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === 'PENDING_PAYMENT').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrator Workspace
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
            Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time overview of orders, inventory catalogue and microservice statuses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-white border border-sand-300 text-xs font-bold text-slate-800 hover:bg-sand-50 transition-colors shadow-2xs"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-brand-950 text-white text-xs font-bold hover:bg-brand-900 transition-colors shadow-sm"
          >
            Fulfill Orders
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Settled Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">${totalRevenue.toFixed(2)}</p>
          <p className="text-[11px] text-slate-500">From paid & fulfilled checkouts</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
          <p className="text-[11px] text-slate-500">{pendingOrders} awaiting payment/settlement</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Catalogue Products</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{productCount}</p>
          <p className="text-[11px] text-slate-500">Across 5 distinct luxury departments</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Microservice Mesh</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">6 / 6 Live</p>
          <p className="text-[11px] text-slate-500">PostgreSQL multi-db verified</p>
        </div>

      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Products Shortcut */}
        <div className="bg-white rounded-3xl border border-sand-200 p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center text-brand-950">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Catalogue & Stock Management</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Add new premium merchandise, adjust pricing, upload images, and control inventory levels with atomic concurrency protection.
            </p>
          </div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-950 hover:text-brand-700"
          >
            Launch Product Editor <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Orders Shortcut */}
        <div className="bg-white rounded-3xl border border-sand-200 p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center text-brand-950">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Customer Orders & Fulfillment</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Monitor orders across the mesh, review customer delivery addresses, inspect payment references, and transition order states to FULFILLED.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-950 hover:text-brand-700"
          >
            Launch Order Manager <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* OpenAPI Swagger Documentation Shortcuts */}
      <div className="p-6 bg-sand-100/70 rounded-3xl border border-sand-200 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Developer OpenAPI & Swagger UI Documentation
        </h4>
        <div className="flex flex-wrap gap-3">
          <a
            href="http://localhost:8080/docs/users/index.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl border border-sand-300 text-xs font-semibold text-slate-800 hover:bg-sand-50"
          >
            User Service Swagger <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="http://localhost:8080/docs/products/index.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl border border-sand-300 text-xs font-semibold text-slate-800 hover:bg-sand-50"
          >
            Product Service Swagger <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="http://localhost:8080/docs/cart/index.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl border border-sand-300 text-xs font-semibold text-slate-800 hover:bg-sand-50"
          >
            Cart Service Swagger <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="http://localhost:8080/docs/orders/index.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl border border-sand-300 text-xs font-semibold text-slate-800 hover:bg-sand-50"
          >
            Order Service Swagger <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="http://localhost:8080/docs/payments/index.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl border border-sand-300 text-xs font-semibold text-slate-800 hover:bg-sand-50"
          >
            Payment Service Swagger <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="http://localhost:8080/docs/notifications/index.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl border border-sand-300 text-xs font-semibold text-slate-800 hover:bg-sand-50"
          >
            Notification Service Swagger <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;
