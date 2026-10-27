import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Watch, Briefcase, Headphones, Gem } from 'lucide-react';

const CATEGORY_CARDS = [
  {
    id: 'horlogerie',
    title: 'Haute Horlogerie',
    subtitle: 'Grand Complications & Tourbillons',
    link: '/products?category=haute-horlogerie',
    linkText: 'Explore All Timepieces',
    badge: 'Flagship Atelier',
    items: [
      {
        name: 'Tourbillon Grand Complication',
        img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop',
        category: 'haute-horlogerie',
      },
      {
        name: 'Skeleton Chronograph in 18k Rose Gold',
        img: 'https://images.unsplash.com/photo-1547996160-71dfabb1d8a4?q=80&w=400&auto=format&fit=crop',
        category: 'haute-horlogerie',
      },
      {
        name: 'Perpetual Calendar Celestial',
        img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=400&auto=format&fit=crop',
        category: 'haute-horlogerie',
      },
      {
        name: 'Sub-Aquatic Automatic 300m',
        img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400&auto=format&fit=crop',
        category: 'haute-horlogerie',
      },
    ],
  },
  {
    id: 'maroquinerie',
    title: 'Maroquinerie d’Exception',
    subtitle: 'Hand-Stitched Full-Grain Leather',
    link: '/products?category=maroquinerie',
    linkText: 'Discover Leather Creations',
    badge: 'Artisan Craft',
    items: [
      {
        name: 'Heritage Weekender Duffle',
        img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop',
        category: 'maroquinerie',
      },
      {
        name: 'Vendôme Executive Folio Briefcase',
        img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop',
        category: 'maroquinerie',
      },
      {
        name: 'Saddle Leather Carryall Tote',
        img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=400&auto=format&fit=crop',
        category: 'maroquinerie',
      },
      {
        name: 'Bespoke Cardholder & Billfold',
        img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop',
        category: 'maroquinerie',
      },
    ],
  },
  {
    id: 'acoustics',
    title: 'Acoustic Artistry & Studio',
    subtitle: 'Planar Transducers & Analog Tubes',
    link: '/products?category=acoustic-studio',
    linkText: 'Immerse in Audiophile Gear',
    badge: 'Pure Fidelity',
    items: [
      {
        name: 'Planar Magnetic Studio Reference',
        img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop',
        category: 'acoustic-studio',
      },
      {
        name: 'Hand-Wired Vacuum Tube Amplifier',
        img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400&auto=format&fit=crop',
        category: 'acoustic-studio',
      },
      {
        name: 'Direct Stream Hi-Res Master DAC',
        img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400&auto=format&fit=crop',
        category: 'acoustic-studio',
      },
      {
        name: 'Walnut Near-Field Reference Monitors',
        img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=400&auto=format&fit=crop',
        category: 'acoustic-studio',
      },
    ],
  },
  {
    id: 'objets',
    title: "Objets d'Art & Living",
    subtitle: 'Sculptural Marble & Extrait de Parfum',
    link: '/products?category=fragrance-objets',
    linkText: 'Curate Your Sanctuary',
    badge: 'Maison Scents',
    items: [
      {
        name: 'Carrara Marble Monolith Catchall',
        img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=400&auto=format&fit=crop',
        category: 'fragrance-objets',
      },
      {
        name: 'Extrait de Parfum Place Vendôme',
        img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400&auto=format&fit=crop',
        category: 'fragrance-objets',
      },
      {
        name: 'Hand-Cut Crystal Decanter Set',
        img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop',
        category: 'fragrance-objets',
      },
      {
        name: 'Black Amber Atelier Candle',
        img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop',
        category: 'fragrance-objets',
      },
    ],
  },
];

export default function SmartCategoryGrids() {
  return (
    <section className="py-8 bg-gradient-to-b from-sand-100/40 to-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-amber-800 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Departments & Atelier Curations</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-slate-950 font-normal mt-1">
              Explore by Specialty Salon
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-amber-900 hover:text-amber-700 transition-colors group"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Amazon-Style 4-in-1 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_CARDS.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-amber-900/10 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Card Title & Badge */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-slate-950 group-hover:text-amber-800 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-1">
                  {card.subtitle}
                </p>

                {/* 2x2 Sub-tiles grid (Amazon signature format) */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {card.items.map((item, idx) => (
                    <Link
                      key={idx}
                      to={`/products?category=${item.category}`}
                      className="group/item block"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 relative border border-slate-100 group-hover/item:border-amber-400 transition-colors">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover object-center group-hover/item:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="block text-[11px] text-slate-700 font-medium mt-1.5 line-clamp-1 group-hover/item:text-amber-800">
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom Deep Link */}
              <div className="pt-3 border-t border-slate-100">
                <Link
                  to={card.link}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-700 transition-colors"
                >
                  <span>{card.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
