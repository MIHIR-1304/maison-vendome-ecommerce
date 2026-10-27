import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, ShoppingBag, ArrowLeft, RefreshCw } from 'lucide-react';

export const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-8">
      
      <div className="w-20 h-20 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
        <XCircle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          Payment Cancelled
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
          Checkout Was Not Completed
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Your transaction was cancelled and no charge was processed. Any temporarily reserved items have been safely released back to our inventory catalogue.
        </p>
      </div>

      {sessionId && (
        <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 text-xs font-mono text-slate-500 max-w-sm mx-auto truncate">
          Session ID: {sessionId}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/cart"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-950 text-white font-bold text-sm hover:bg-brand-900 transition-colors shadow-md"
        >
          <ShoppingBag className="w-4 h-4" />
          Review Cart & Retry
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white border border-sand-300 text-slate-800 font-semibold text-sm hover:bg-sand-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Catalogue
        </Link>
      </div>

    </div>
  );
};

export default PaymentCancelPage;
