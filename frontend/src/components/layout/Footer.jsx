import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Award, Mail, Check, Sparkles, MapPin, Phone, Clock, CreditCard } from 'lucide-react';

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
    <footer className="bg-slate-950 text-slate-300 mt-28 border-t border-amber-900/20 font-sans">
      
      {/* 4 Pillars of Maison Savoir-Faire */}
      <div className="border-b border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 text-amber-300">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-medium text-amber-100 tracking-wide">White-Glove Delivery</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Complimentary insured courier delivery with signature confirmation on all global orders.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 text-amber-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-medium text-amber-100 tracking-wide">Certified Authenticity</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Every creation is certified by master horologists and artisan leatherworkers with archival records.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 text-amber-300">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-medium text-amber-100 tracking-wide">Bespoke Presentation</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Delivered in our signature wooden presentation box with hand-tied grosgrain ribbon and bespoke card.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 text-amber-300">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-medium text-amber-100 tracking-wide">30-Day Private Returns</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Complimentary home collection and dedicated concierge assistance for seamless exchanges.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand Heritage Manifesto */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-amber-500/40 flex items-center justify-center bg-slate-900 text-amber-300 font-serif font-bold text-sm">
                MV
              </div>
              <span className="font-serif text-2xl tracking-[0.2em] font-normal text-amber-100 uppercase">
                Maison Vendôme
              </span>
            </div>
            
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Founded at Place Vendôme, Paris, Maison Vendôme embodies the zenith of Haute Horlogerie, artisan Maroquinerie, and bespoke objets d'art. Powered by an enterprise microservices mesh ensuring peerless reliability and transaction security.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400/80" />
                <span>12 Place Vendôme, 75001 Paris, France</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400/80" />
                <span>Concierge Salon: +33 (0)1 42 68 00 00</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400/80" />
                <span>Private Consultations: Mon — Sat, 10:00 — 19:00 CET</span>
              </div>
            </div>
          </div>

          {/* Column 2: Worldwide Flagships */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              Maison Boutiques
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <span className="text-slate-200 block font-medium">Paris • Place Vendôme</span>
                <span className="text-[11px] text-slate-500">Flagship & Horology Atelier</span>
              </li>
              <li>
                <span className="text-slate-200 block font-medium">New York • 720 Fifth Ave</span>
                <span className="text-[11px] text-slate-500">Maroquinerie Salon</span>
              </li>
              <li>
                <span className="text-slate-200 block font-medium">London • 14 New Bond St</span>
                <span className="text-[11px] text-slate-500">Mayfair Private Suite</span>
              </li>
              <li>
                <span className="text-slate-200 block font-medium">Tokyo • Ginza 6</span>
                <span className="text-[11px] text-slate-500">Acoustic & Objets Gallery</span>
              </li>
              <li>
                <Link to="/products" className="text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 pt-1 font-medium">
                  Book Boutique Appointment →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
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
                  VIP Patron Account
                </Link>
              </li>
              <li>
                <Link to="/products?category=haute-horlogerie" className="hover:text-amber-200 transition-colors">
                  Master Horological Servicing
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Certificate of Authenticity Archiving</span>
              </li>
              <li>
                <span className="text-slate-500">Bespoke Monogramming Service</span>
              </li>
            </ul>
          </div>

          {/* Column 4: VIP Newsletter Invitation */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              The Salon Register
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive privileged access to novelty private viewings, trunk exhibitions, and private commissions.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>You are registered with the Maison Vendôme Circle. Welcome.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-amber-400/90 text-slate-950 rounded-md hover:bg-amber-300 transition-colors flex items-center justify-center font-medium text-xs"
                    aria-label="Subscribe"
                  >
                    Join
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  By joining, you accept our Privacy Policy. Discretion guaranteed.
                </p>
              </form>
            )}

            {/* Currency Selector */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-500">Currency:</span>
              <div className="flex gap-1">
                {['USD', 'EUR', 'GBP'].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-2 py-1 text-[10px] font-semibold rounded border transition-colors ${
                      currency === curr
                        ? 'border-amber-400/60 bg-amber-400/10 text-amber-200'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Payment Badges & Copyright */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>&copy; {new Date().getFullYear()} Maison Vendôme Paris. All rights reserved.</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Savoir-Faire & Ethics</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy & Discretion</span>
          </div>

          {/* Secure Payment Badges */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-400/80" />
              Encrypted Checkout:
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">STRIPE</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">APPLE PAY</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">VISA</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">MASTERCARD</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">AMEX</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
