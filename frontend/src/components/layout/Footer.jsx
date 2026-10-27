import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Truck, RotateCcw, Award, Mail, Check, Sparkles, 
  MapPin, Phone, Clock, CreditCard, ArrowRight, Globe 
} from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 mt-24 border-t border-amber-900/30 font-sans">
      
      {/* 1. Atelier Guarantees Bar (Minimalist Luxury) */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            
            <div className="flex items-center sm:items-start gap-3.5 justify-center sm:justify-start">
              <div className="p-2.5 rounded-full bg-slate-900 border border-amber-500/20 text-amber-300 flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-semibold text-amber-100 uppercase tracking-wider">
                  White-Glove Courier
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Complimentary worldwide delivery with private armored transit.
                </p>
              </div>
            </div>

            <div className="flex items-center sm:items-start gap-3.5 justify-center sm:justify-start">
              <div className="p-2.5 rounded-full bg-slate-900 border border-amber-500/20 text-amber-300 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-semibold text-amber-100 uppercase tracking-wider">
                  Certified Authenticity
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Individual serial records verified in the Paris atelier register.
                </p>
              </div>
            </div>

            <div className="flex items-center sm:items-start gap-3.5 justify-center sm:justify-start">
              <div className="p-2.5 rounded-full bg-slate-900 border border-amber-500/20 text-amber-300 flex-shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-semibold text-amber-100 uppercase tracking-wider">
                  Signature Packaging
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Lacquered presentation coffret sealed with embossed wax.
                </p>
              </div>
            </div>

            <div className="flex items-center sm:items-start gap-3.5 justify-center sm:justify-start">
              <div className="p-2.5 rounded-full bg-slate-900 border border-amber-500/20 text-amber-300 flex-shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-semibold text-amber-100 uppercase tracking-wider">
                  30-Day Private Returns
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Complimentary home retrieval by dedicated concierge agents.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Le Cercle Privé — VIP Salon Invitation */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-slate-950 to-slate-900/60 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-amber-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Le Cercle Privé • Place Vendôme</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-amber-50 font-normal">
            Request an Invitation to the Private Circle
          </h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            Gain confidential previews of limited-edition grand complications, private trunk exhibitions, and bespoke commissions from our master artisans.
          </p>

          {subscribed ? (
            <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-center gap-2 shadow-inner">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Your request has been registered with the Place Vendôme salon. Discretion assured.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row items-stretch gap-2.5 pt-2">
              <input
                type="email"
                required
                placeholder="Enter your confidential email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-full px-4 py-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-amber-400 text-slate-950 text-xs uppercase tracking-widest font-semibold hover:bg-amber-300 transition-all shadow-md active:scale-95 whitespace-nowrap"
              >
                Join Salon
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 3. Re-Organized 4-Column Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Maison Heritage & Salons */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 flex items-center justify-center font-serif text-xs font-bold">
                MV
              </div>
              <span className="font-serif text-base tracking-[0.2em] font-normal text-amber-100 uppercase">
                Maison Vendôme
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Founded at Place Vendôme in Paris, cultivating the pinnacle of Haute Horlogerie, artisan Maroquinerie, and rare acoustic mastery since 1892.
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
                <span>12 Place Vendôme, 75001 Paris</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
                <span>Concierge: +33 (0)1 42 68 00 00</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
                <span>Atelier Hours: Mon — Sat, 10:00 — 19:00</span>
              </div>
            </div>
          </div>

          {/* Column 2: Les Universes */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 border-b border-slate-800 pb-2">
              The Salons & Universes
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/products?category=haute-horlogerie" className="hover:text-amber-200 transition-colors">
                  Haute Horlogerie & Complications
                </Link>
              </li>
              <li>
                <Link to="/products?category=maroquinerie" className="hover:text-amber-200 transition-colors">
                  Maroquinerie & Artisan Leather
                </Link>
              </li>
              <li>
                <Link to="/products?category=joaillerie-accessories" className="hover:text-amber-200 transition-colors">
                  Haute Joaillerie & Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=acoustic-studio" className="hover:text-amber-200 transition-colors">
                  Acoustic Artistry & Studio
                </Link>
              </li>
              <li>
                <Link to="/products?category=fragrance-objets" className="hover:text-amber-200 transition-colors">
                  Objets d'Art & Maison Fragrance
                </Link>
              </li>
              <li>
                <Link to="/products?sortBy=featured" className="text-amber-400/90 hover:text-amber-300 font-medium transition-colors">
                  Place Vendôme Bestsellers →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Concierge */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 border-b border-slate-800 pb-2">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/orders" className="hover:text-amber-200 transition-colors">
                  Consignment & Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-amber-200 transition-colors">
                  Private Curated Wishlist
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-amber-200 transition-colors">
                  VIP Patron Profile & Privileges
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-amber-200 transition-colors">
                  Review Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-amber-200 transition-colors">
                  Book Private Salon Consultation
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Certificate of Authenticity Lookup</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Savoir-Faire & Boutiques */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 border-b border-slate-800 pb-2">
              Worldwide Boutiques
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div>
                <p className="text-slate-200 font-medium">Paris • Place Vendôme</p>
                <p className="text-[11px] text-slate-500">Flagship Atelier & Vault</p>
              </div>
              <div>
                <p className="text-slate-200 font-medium">New York • 720 Fifth Ave</p>
                <p className="text-[11px] text-slate-500">Private Viewing Salon</p>
              </div>
              <div>
                <p className="text-slate-200 font-medium">London • 14 New Bond St</p>
                <p className="text-[11px] text-slate-500">Mayfair Atelier Suite</p>
              </div>
              <div>
                <p className="text-slate-200 font-medium">Tokyo • Ginza 6</p>
                <p className="text-[11px] text-slate-500">Horology & Acoustic Salon</p>
              </div>
            </div>

            {/* Currency Selector */}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                Settlement Currency:
              </span>
              <div className="flex gap-1">
                {['USD ($)', 'EUR (€)', 'GBP (£)', 'CHF (Fr)'].map((curr) => {
                  const code = curr.split(' ')[0];
                  return (
                    <button
                      key={code}
                      onClick={() => setCurrency(code)}
                      className={`px-2 py-1 text-[10px] font-semibold rounded border transition-colors ${
                        currency === code
                          ? 'border-amber-400/60 bg-amber-400/10 text-amber-200'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {code}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Bottom Footer Strip: Copyright, Legal, Payment Partners */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} Maison Vendôme Paris. All rights reserved.</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Savoir-Faire Code</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Responsible Sourcing</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Confidentiality & Privacy</span>
          </div>

          {/* Secure Payment Badges */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-amber-400/80" />
              Secure Checkout:
            </span>
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">STRIPE</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">APPLE PAY</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">VISA INFINITE</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">MASTERCARD BLACK</span>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;
