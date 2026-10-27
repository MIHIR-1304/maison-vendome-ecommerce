import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCart } from '../../context/CartContext';
import { Check } from 'lucide-react';

export const Layout = () => {
  const { notification } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] selection:bg-brand-950 selection:text-white">
      <Navbar />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-brand-950 text-white rounded-2xl shadow-2xl border border-brand-800 animate-in slide-in-from-bottom-5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
