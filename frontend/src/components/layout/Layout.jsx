import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import { useCart } from '../../context/CartContext';
import { Check } from 'lucide-react';

export const Layout = () => {
  const { notification } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] selection:bg-slate-950 selection:text-amber-200">
      <Navbar />

      {/* Global Slide-Out Cart Drawer */}
      <CartDrawer />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-950 text-white rounded-2xl shadow-2xl border border-amber-500/30 animate-in slide-in-from-bottom-5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium text-amber-100">{notification}</span>
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
