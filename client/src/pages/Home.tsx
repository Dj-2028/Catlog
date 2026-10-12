import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle2, ChevronRight, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { fetchProducts } from '../services/products';
import { fetchCategories } from '../services/categories';
import { fetchServices } from '../services/services';
import type { Product, Category, Service } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { ServiceCard } from '../components/ServiceCard';
import { ProductCardSkeleton } from '../components/Skeleton';

export const Home: React.FC = () => {
  const { settings, openQuoteModal } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    // 1. Featured Products
    fetchProducts({ featured: true, limit: 8 })
      .then((res) => {
        if (res.products && res.products.length > 0) {
          setFeaturedProducts(res.products);
        } else {
          // If no featured items explicitly flagged, fallback to newest products
          fetchProducts({ limit: 8 }).then((fallback) => setFeaturedProducts(fallback.products));
        }
      })
      .catch((err) => console.error('Failed to load featured products', err))
      .finally(() => setLoadingProducts(false));

    // 2. Categories
    fetchCategories(true)
      .then((data) => setCategories(data.slice(0, 6)))
      .catch((err) => console.error('Failed to load categories', err))
      .finally(() => setLoadingCategories(false));

    // 3. Services
    fetchServices()
      .then((data) => setServices(data.slice(0, 3)))
      .catch((err) => console.error('Failed to load services', err))
      .finally(() => setLoadingServices(false));
  }, []);

  const storeName = settings?.storeName || 'Shree Hardware & Plywood';

  return (
    <div className="flex flex-col min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-[#1E2A24] text-white overflow-hidden py-20 lg:py-28">
        {/* Subtle textural background pattern */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(#9A6A3A_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-[#9A6A3A]/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -top-32 w-80 h-80 rounded-full bg-[#54755f]/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#9A6A3A]/20 border border-[#9A6A3A]/40 text-[#C4925D] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premier Architectural Hardware & Timber Solutions</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
                Quality Materials.{' '}
                <span className="text-[#C4925D]">Reliable Hardware.</span> Built for Every Project.
              </h1>

              <p className="text-base sm:text-lg text-[#F4F1EA]/85 leading-relaxed max-w-2xl font-normal">
                {settings?.tagline ||
                  'Premium plywood, architectural hardware fittings, designer laminates, and interior solutions for homes, offices, modular cabinetry and construction projects.'}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="px-6 py-3.5 rounded-xl bg-[#9A6A3A] hover:bg-[#7C4D22] text-white text-sm font-semibold transition-all shadow-lg shadow-[#9A6A3A]/25 flex items-center gap-2 active:scale-98"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/services"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <span>Our Services</span>
                </Link>

                <button
                  type="button"
                  onClick={() => openQuoteModal({ type: 'quote' })}
                  className="px-6 py-3.5 rounded-xl bg-[#FAF9F6] hover:bg-[#F4F1EA] text-[#1E2A24] text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Request Quote</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-left max-w-lg">
                <div>
                  <span className="font-display font-bold text-2xl text-white block">25+</span>
                  <span className="text-xs text-[#F4F1EA]/70">Years in Timber</span>
                </div>
                <div>
                  <span className="font-display font-bold text-2xl text-white block">100%</span>
                  <span className="text-xs text-[#F4F1EA]/70">Genuine BWP / ISI</span>
                </div>
                <div>
                  <span className="font-display font-bold text-2xl text-white block">1,500+</span>
                  <span className="text-xs text-[#F4F1EA]/70">Running SKUs</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl aspect-4/3 bg-stone-900 group">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
                  alt="Quality Timber & Plywood Warehouse"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121A16] via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-[#1E2A24]/90 backdrop-blur-md border border-white/15 text-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C4925D]">
                      Authorized Stockist
                    </span>
                    <span className="text-xs text-white/70">Jabalpur & Central India</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-white">
                    Century Club Prime, Green Platinum & Godrej Locks
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BRAND PARTNERS STRIP ================= */}
      <section className="bg-white border-y border-[#E7E5E4] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-stone-400 mb-6">
            Authorized Stockist & Distributors for India's Leading Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm font-display font-bold text-stone-400">
            <span className="hover:text-[#1E2A24] transition-colors">CENTURYPLY</span>
            <span className="hover:text-[#1E2A24] transition-colors">GREENPLY</span>
            <span className="hover:text-[#1E2A24] transition-colors">GODREJ ARCHITECTURAL</span>
            <span className="hover:text-[#1E2A24] transition-colors">HAFELE</span>
            <span className="hover:text-[#1E2A24] transition-colors">HETTICH</span>
            <span className="hover:text-[#1E2A24] transition-colors">DORMA</span>
            <span className="hover:text-[#1E2A24] transition-colors">FEVICOL</span>
            <span className="hover:text-[#1E2A24] transition-colors">EBCO</span>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="py-20 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block mb-2">
                Our Categories
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E2A24] tracking-tight">
                Explore Materials & Hardware
              </h2>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9A6A3A] hover:text-[#7C4D22] transition-colors group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-4/3 rounded-2xl bg-stone-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <CategoryCard key={cat._id} category={cat} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS SECTION ================= */}
      <section className="py-20 bg-white border-y border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block mb-2">
                Catalog Highlights
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E2A24] tracking-tight">
                Featured Materials & Fittings
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9A6A3A] hover:text-[#7C4D22] transition-colors group"
            >
              <span>View Full Catalog ({featuredProducts.length}+)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="py-20 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block mb-2">
                In-House Support
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E2A24] tracking-tight">
                Expert Services for Builders & Carpenters
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9A6A3A] hover:text-[#7C4D22] transition-colors group"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingServices ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-72 rounded-3xl bg-stone-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((svc) => (
                <ServiceCard key={svc._id} service={svc} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-20 bg-[#1E2A24] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C4925D] block mb-2">
              Why Choose {storeName}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Built on Trust, Precision, and Genuine Quality
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#25342C] border border-[#34483E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Guaranteed Genuine Quality
              </h3>
              <p className="text-sm text-[#F4F1EA]/80 leading-relaxed">
                Every board comes with manufacturer barcode labels and BIS/ISI certification. We never supply duplicate or sub-standard non-waterproof boards.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#25342C] border border-[#34483E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D]">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Bulk Supply & Fast Dispatch
              </h3>
              <p className="text-sm text-[#F4F1EA]/80 leading-relaxed">
                Dedicated loading crew and transport fleet ensuring sheets reach your building site without corner chips or face scratches.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#25342C] border border-[#34483E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Hardware Consultation Desk
              </h3>
              <p className="text-sm text-[#F4F1EA]/80 leading-relaxed">
                Take the guesswork out of kitchen and door fittings. Our technical specialists calculate weight capacities and suggest matching lock finishes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROJECT QUOTE CTA BANNER ================= */}
      <section className="py-16 bg-[#F4F1EA] border-t border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#1E2A24] to-[#2D3E35] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C4925D]">
                Planning a Renovation or Commercial Build?
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Send your material list for an itemized estimate
              </h3>
              <p className="text-sm text-[#F4F1EA]/80">
                Architects, interior contractors, and home-builders get custom wholesale slabs and delivery schedules.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                type="button"
                onClick={() => openQuoteModal({ type: 'quote' })}
                className="px-6 py-3.5 rounded-xl bg-[#9A6A3A] hover:bg-[#7C4D22] text-white text-sm font-semibold transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Request Quotation</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#C4925D]" />
                  <span>Call {settings.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
