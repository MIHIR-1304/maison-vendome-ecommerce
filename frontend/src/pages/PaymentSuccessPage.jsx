import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, Home } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../api/paymentApi';
import { useCart } from '../context/CartContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();

    const fetchDetails = async () => {
      try {
        if (orderId) {
          const ord = await orderApi.getOrderById(orderId);
          setOrder(ord);
        } else if (sessionId) {
          const payment = await paymentApi.getPaymentBySession(sessionId);
          if (payment && payment.orderId) {
            const ord = await orderApi.getOrderById(payment.orderId);
            setOrder(ord);
          }
        }
      } catch (err) {
        console.warn('Could not fetch final order snapshot:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [sessionId, orderId]);

  if (loading) {
    return <LoadingSpinner text="Confirming payment with banking provider..." />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-8">
      
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Payment Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
          Thank you for your order!
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Your payment has been successfully authorized and confirmed. An order receipt has been dispatched to your email.
        </p>
      </div>

      {order && (
        <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 text-left space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-sand-200 pb-3">
            <div>
              <p className="text-xs text-slate-500 font-medium">Order Reference</p>
              <p className="text-sm font-bold font-mono text-slate-900">{order.orderNumber}</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400">Recipient</p>
              <p className="font-semibold text-slate-800 mt-0.5">{order.customerName}</p>
              <p className="text-slate-500">{order.customerEmail}</p>
            </div>
            <div>
              <p className="text-slate-400">Delivering To</p>
              <p className="font-semibold text-slate-800 mt-0.5">{order.shippingAddress}</p>
              <p className="text-slate-500">{order.city}, {order.postalCode}</p>
            </div>
          </div>

          <div className="border-t border-sand-200 pt-3 flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-600">Total Charged</span>
            <span className="text-lg font-bold text-slate-950">${Number(order.totalAmount).toFixed(2)} USD</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-950 text-white font-bold text-sm hover:bg-brand-900 transition-colors shadow-md"
        >
          <Package className="w-4 h-4" />
          View Order History
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white border border-sand-300 text-slate-800 font-semibold text-sm hover:bg-sand-50 transition-colors"
        >
          <Home className="w-4 h-4" />
          Return to Storefront
        </Link>
      </div>

    </div>
  );
};

export default PaymentSuccessPage;
