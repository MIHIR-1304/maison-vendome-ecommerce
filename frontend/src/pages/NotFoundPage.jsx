import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <span className="font-serif text-7xl font-extrabold text-brand-950">404</span>
      <h2 className="font-serif text-2xl font-bold text-slate-800">Page Not Found</h2>
      <p className="text-sm text-slate-500 leading-relaxed">
        The destination you are seeking does not exist or has been relocated within our catalogue.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-950 text-white font-bold text-xs hover:bg-brand-900 transition-colors shadow-md"
        >
          <Home className="w-4 h-4" />
          Return to Storefront
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
