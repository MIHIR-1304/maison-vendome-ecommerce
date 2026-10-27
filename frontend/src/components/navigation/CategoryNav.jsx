import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, Watch, Briefcase, Gem, Headphones, Sparkles, Flame, Gift, 
  Award, ShieldCheck, ChevronRight 
} from 'lucide-react';

export default function CategoryNav({ onOpenAllCategories }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');
  const currentSort = searchParams.get('sortBy');

  const navLinks = [
    {
      label: 'Haute Horlogerie',
      to: '/products?category=haute-horlogerie',
      icon: Watch,
      active: currentCategory === 'haute-horlogerie',
    },
    {
      label: 'Maroquinerie',
      to: '/products?category=maroquinerie',
      icon: Briefcase,
      active: currentCategory === 'maroquinerie',
    },
    {
      label: 'Haute Joaillerie',
      to: '/products?category=joaillerie-accessories',
      icon: Gem,
      active: currentCategory === 'joaillerie-accessories',
    },
    {
      label: 'Acoustics & Studio',
      to: '/products?category=acoustic-studio',
      icon: Headphones,
      active: currentCategory === 'acoustic-studio',
    },
    {
      label: "Objets d'Art",
      to: '/products?category=fragrance-objets',
      icon: Sparkles,
      active: currentCategory === 'fragrance-objets',
    },
    {
      label: 'Bestsellers',
      to: '/products?sortBy=featured',
      icon: Flame,
      active: currentSort === 'featured' && !currentCategory,
      badge: 'Hot',
    },
    {
      label: 'High Complications',
      to: '/products?sortBy=price-desc',
      icon: Award,
      active: currentSort === 'price-desc' && !currentCategory,
    },
    {
      label: 'Gift Salon',
      to: '/products?category=fragrance-objets',
      icon: Gift,
      active: false,
    },
  ];

  return (
    <div className="bg-[#1a2332] text-slate-200 border-b border-amber-900/20 shadow-sm text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 gap-3">
          
          {/* Amazon-style "☰ All" Hamburger Button */}
          <button
            onClick={onOpenAllCategories}
            className="flex items-center gap-2 px-3 py-1 rounded bg-slate-900/80 hover:bg-slate-950 text-amber-200 font-semibold uppercase tracking-wider text-[11px] border border-amber-500/20 transition-all active:scale-95 flex-shrink-0"
            title="Open All Departments & Maison Curations"
          >
            <Menu className="w-4 h-4 text-amber-300" />
            <span>All Departments</span>
          </button>

          {/* Horizontal Department Links (Amazon style) */}
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 flex-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] uppercase tracking-wider font-medium whitespace-nowrap transition-colors ${
                    link.active
                      ? 'bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-amber-400/80" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950 leading-tight">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Utility Links */}
          <div className="hidden lg:flex items-center gap-4 text-[11px] uppercase tracking-wider text-slate-400 flex-shrink-0">
            <Link 
              to="/orders" 
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <span>Consignment Tracking</span>
            </Link>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-amber-300/90 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Paris 75001</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
