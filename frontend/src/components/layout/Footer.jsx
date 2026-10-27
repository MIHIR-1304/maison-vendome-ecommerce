import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-brand-950 text-slate-300 mt-24 border-t border-brand-900">
      
      {/* Value Proposition Highlights */}
      <div className="border-b border-brand-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <Truck className="w-6 h-6 text-brand-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Complimentary Delivery</h4>
                <p className="text-xs text-slate-400 mt-0.5">Free standard shipping on orders over $150</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-brand-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Guaranteed Authentic</h4>
                <p className="text-xs text-slate-400 mt-0.5">Direct from certified artisans and master craftspeople</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <RotateCcw className="w-6 h-6 text-brand-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">30-Day Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">Hassle-free return policy with pre-paid label</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <Clock className="w-6 h-6 text-brand-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Secure Microservices</h4>
                <p className="text-xs text-slate-400 mt-0.5">Isolated resilient services and Stripe test checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              A U R A
            </span>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Curated everyday modern luxury. Built with an enterprise Java Spring Boot 3.3 microservices mesh, PostgreSQL, Docker Compose, and modern React 18.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Microservices Platform &copy; {new Date().getFullYear()} AURA Inc. All rights reserved.
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Catalogue</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?category=audio-electronics" className="hover:text-white transition-colors">Audio & Tech</Link></li>
              <li><Link to="/products?category=minimalist-timepieces" className="hover:text-white transition-colors">Watches</Link></li>
              <li><Link to="/products?category=leather-carry" className="hover:text-white transition-colors">Carry & Travel</Link></li>
              <li><Link to="/products?category=workspace-studio" className="hover:text-white transition-colors">Workspace</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">Account Settings</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><span className="text-slate-500 cursor-not-allowed">Shipping Rates</span></li>
              <li><span className="text-slate-500 cursor-not-allowed">Privacy Policy</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Architecture</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><span className="text-emerald-400 font-mono">User Service</span> (:8081)</li>
              <li><span className="text-emerald-400 font-mono">Product Service</span> (:8082)</li>
              <li><span className="text-emerald-400 font-mono">Cart Service</span> (:8083)</li>
              <li><span className="text-emerald-400 font-mono">Order Service</span> (:8084)</li>
              <li><span className="text-emerald-400 font-mono">Payment Service</span> (:8085)</li>
              <li><span className="text-emerald-400 font-mono">Notification Service</span> (:8086)</li>
              <li><span className="text-brand-300 font-mono">NGINX Gateway</span> (:8080)</li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
