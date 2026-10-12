import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
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
  const { settings, openQuoteModal, getWhatsAppUrl } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    // 1. Featured Products
    fetchProducts({ limit: 8 })
      .then((res) => {
        if (res.products && res.products.length > 0) {
          setFeaturedProducts(res.products);
        }
      })
      .catch((err) => console.error('Failed to load products', err))
      .finally(() => setLoadingProducts(false));

    // 2. Categories
    fetchCategories(true)
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to load categories', err))
      .finally(() => setLoadingCategories(false));

    // 3. Services
    fetchServices()
      .then((data) => setServices(data))
      .catch((err) => console.error('Failed to load services', err));
  }, []);

  const storeName = settings?.storeName || 'Shiv Shakti Ply And Hardware';
  const displayPhone = settings?.phone || '7987158644';
  const displayWhatsApp = '9755672433';
  const verifiedAddress = settings?.address || 'Narmada Road, Bhim Nagar, Polipather, Gwarighat, Jabalpur, Madhya Pradesh 482001';
  const mapLink = settings?.mapUrl || 'https://share.google/cPLJQiTvGPre2xRWt';
  const mapEmbedUrl = settings?.mapEmbedUrl || 'https://maps.google.com/maps?q=Shiv+Shakti+Ply+And+Hardware+Narmada+Road+Polipather+Gwarighat+Jabalpur&t=&z=15&ie=UTF8&iwloc=&output=embed';

  return (
    <div className="flex flex-col min-h-screen">
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative bg-[#1E2A24] text-white overflow-hidden py-16 sm:py-24 lg:py-28">
        {/* Textural background pattern */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(#9A6A3A_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-[#9A6A3A]/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -top-32 w-80 h-80 rounded-full bg-[#54755f]/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#9A6A3A]/20 border border-[#9A6A3A]/40 text-[#C4925D] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>15+ Years of Experience in Building Materials</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#C4925D] uppercase block">
                  Welcome to
                </span>
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
                  {storeName}
                </h1>
              </div>

              <p className="text-base sm:text-lg text-[#F4F1EA]/90 leading-relaxed max-w-2xl font-normal">
                Your established destination in Jabalpur for quality plywood, hardware supplies, paints, decorative laminates, plumbing, sanitaryware, electrical supplies, electronics, and interior materials.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="px-6 py-3.5 rounded-xl bg-[#9A6A3A] hover:bg-[#7C4D22] text-white text-sm font-semibold transition-all shadow-lg shadow-[#9A6A3A]/25 flex items-center gap-2 active:scale-98"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-sm font-semibold transition-all flex items-center gap-2 active:scale-98"
                >
                  <Phone className="w-4 h-4 text-[#C4925D]" />
                  <span>Contact Us</span>
                </Link>

                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold transition-all shadow-md flex items-center gap-2 active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>

              {/* Verified Trust Markers */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-left max-w-lg">
                <div>
                  <span className="font-display font-bold text-2xl sm:text-3xl text-white block">15+</span>
                  <span className="text-xs text-[#F4F1EA]/75">Years Experience</span>
                </div>
                <div>
                  <span className="font-display font-bold text-2xl sm:text-3xl text-white block">9</span>
                  <span className="text-xs text-[#F4F1EA]/75">Key Categories</span>
                </div>
                <div>
                  <span className="font-display font-bold text-2xl sm:text-3xl text-white block">Jabalpur</span>
                  <span className="text-xs text-[#F4F1EA]/75">Gwarighat Location</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl aspect-4/3 bg-stone-900 group">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
                  alt="Shiv Shakti Ply And Hardware Building Materials"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121A16] via-[#121A16]/40 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-[#1E2A24]/95 backdrop-blur-md border border-white/15 text-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C4925D]">
                      Verified Retail Store
                    </span>
                    <span className="text-xs text-white/70">Gwarighat, Jabalpur</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-white">
                    Plywood, Hardware, Paints & Sanitaryware
                  </h4>
                  <p className="text-xs text-[#F4F1EA]/75 mt-1">
                    Serving builders, contractors, carpenters, and homeowners across Jabalpur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. PRODUCT CATEGORIES ================= */}
      <section className="py-20 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block mb-2">
                Product & Material Departments
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E2A24] tracking-tight">
                Explore Product Categories
              </h2>
              <p className="text-sm text-stone-600 mt-2 max-w-xl">
                Browse our complete selection of hardware, building materials, paints, sanitaryware, and electricals.
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9A6A3A] hover:text-[#7C4D22] transition-colors group"
            >
              <span>View All 9 Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
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

      {/* ================= 3. ABOUT US SECTION (HOMEPAGE) ================= */}
      <section className="py-20 bg-white border-y border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Left */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-stone-900 border border-[#E7E5E4] shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80"
                  alt="Shiv Shakti Ply And Hardware Store"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121A16]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-[#1E2A24]/90 backdrop-blur-md text-white border border-white/10">
                  <span className="text-xs font-semibold text-[#C4925D] uppercase tracking-wider block mb-1">
                    Established Local Business
                  </span>
                  <h4 className="font-display font-bold text-lg text-white">
                    Shiv Shakti Ply And Hardware
                  </h4>
                  <p className="text-xs text-[#F4F1EA]/80 mt-1">
                    Gwarighat, Narmada Road, Jabalpur, Madhya Pradesh
                  </p>
                </div>
              </div>
            </div>

            {/* Content Right */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block mb-2">
                  About Our Business
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E2A24] tracking-tight">
                  15+ Years of Dependable Material Supply in Jabalpur
                </h2>
              </div>

              <p className="text-base text-stone-600 leading-relaxed font-normal">
                Shiv Shakti Ply And Hardware is an established hardware, plywood, and building-materials store situated on Narmada Road in Gwarighat, Jabalpur. With over 15 years of continuous experience, we cater to homeowners, carpentry workshops, and construction professionals across the city.
              </p>

              <p className="text-sm text-stone-600 leading-relaxed">
                We provide a comprehensive selection of paints, hardware supplies, plywood, sunmica and decorative laminates, plumbing fittings, sanitaryware, electrical supplies, electronics, and interior materials under one roof, backed by honest guidance and prompt customer service.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E7E5E4]">
                  <CheckCircle2 className="w-5 h-5 text-[#9A6A3A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E2A24]">
                      15+ Years Experience
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Verified local track record in Jabalpur
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E7E5E4]">
                  <CheckCircle2 className="w-5 h-5 text-[#9A6A3A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E2A24]">
                      All Core Supplies
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Plywood, hardware, paints & sanitaryware
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/about"
                  className="px-5 py-3 rounded-xl bg-[#1E2A24] hover:bg-[#2D3E35] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={`tel:${displayPhone}`}
                  className="px-5 py-3 rounded-xl border border-[#E7E5E4] hover:border-[#9A6A3A] text-[#1E2A24] text-xs font-semibold inline-flex items-center gap-2 transition-colors bg-white"
                >
                  <Phone className="w-3.5 h-3.5 text-[#9A6A3A]" />
                  <span>Call {displayPhone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. WHY CHOOSE US ================= */}
      <section className="py-20 bg-[#1E2A24] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C4925D] block mb-2">
              Verified Strengths
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Why Choose Shiv Shakti Ply And Hardware
            </h2>
            <p className="text-sm text-[#F4F1EA]/80 mt-3">
              Built on 15+ years of verified local experience and dependable customer service in Jabalpur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#25342C] border border-[#34483E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                15+ Years Industry Experience
              </h3>
              <p className="text-sm text-[#F4F1EA]/80 leading-relaxed">
                Over 15 years of established presence in Jabalpur. Practical knowledge of building materials, hardware fittings, and suitable plywood grades for local projects.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#25342C] border border-[#34483E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                All Major Categories Under One Roof
              </h3>
              <p className="text-sm text-[#F4F1EA]/80 leading-relaxed">
                Save time and coordination hassles by sourcing your plywood, hardware supplies, paints, laminates, plumbing, sanitaryware, and electricals from a single store.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#25342C] border border-[#34483E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Prompt Assistance & WhatsApp Enquiries
              </h3>
              <p className="text-sm text-[#F4F1EA]/80 leading-relaxed">
                Reach us directly via phone or WhatsApp at 9755672433 for product availability, material questions, and quick order enquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. FEATURED CATALOG ITEMS ================= */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-[#FAF9F6] border-b border-[#E7E5E4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block mb-2">
                  Sample Catalog Highlights
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E2A24] tracking-tight">
                  Featured Products & Supplies
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  Sample catalogue items representing our core retail product categories.
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9A6A3A] hover:text-[#7C4D22] transition-colors group"
              >
                <span>View Full Catalog</span>
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
                {featuredProducts.slice(0, 8).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= 6. SERVICES SECTION ================= */}
      {services.length > 0 && (
        <section className="py-20 bg-white border-b border-[#E7E5E4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block mb-2">
                  Store Services
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E2A24] tracking-tight">
                  Material Support & Consultation
                </h2>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9A6A3A] hover:text-[#7C4D22] transition-colors group"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((svc) => (
                <ServiceCard key={svc._id} service={svc} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= 7. VISIT OUR STORE SECTION ================= */}
      <section className="py-20 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block mb-2">
              Store Location & Directions
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1E2A24] tracking-tight">
              Visit Our Store in Jabalpur
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Conveniently located on Narmada Road in Gwarighat, Jabalpur. Drop by to view materials in person.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Store Information Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E7E5E4] p-8 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#1E2A24] mb-1">
                    {storeName}
                  </h3>
                  <span className="text-xs font-semibold text-[#9A6A3A] uppercase tracking-wider">
                    Hardware, Plywood & Building Materials
                  </span>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E2A24] mb-1">
                        Verified Address
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {verifiedAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E2A24] mb-1">
                        Store Timings
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600">
                        Opens daily from 10:00 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E2A24] mb-1">
                        Phone Contact
                      </h4>
                      <a
                        href={`tel:${displayPhone}`}
                        className="font-mono text-sm font-semibold text-[#1E2A24] hover:text-[#9A6A3A] transition-colors"
                      >
                        {displayPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F5F5F4] flex flex-col sm:flex-row gap-3">
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#1E2A24] hover:bg-[#2D3E35] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Shiv Shakti Ply And Hardware Gwarighat Jabalpur')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl border border-[#E7E5E4] hover:border-[#9A6A3A] text-[#1E2A24] text-xs font-semibold flex items-center justify-center gap-2 transition-colors bg-[#FAF9F6]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#9A6A3A]" />
                  <span>Get Driving Directions</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Maps */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E7E5E4] overflow-hidden shadow-xs min-h-[380px] relative">
              <iframe
                title="Shiv Shakti Ply And Hardware Location Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. CONTACT SECTION (HOMEPAGE) ================= */}
      <section className="py-20 bg-gradient-to-br from-[#1E2A24] to-[#121A16] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C4925D] block">
                Get In Touch
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                Have a Material Requirement or Need a Price Enquiry?
              </h2>
              <p className="text-base text-[#F4F1EA]/85 leading-relaxed max-w-xl">
                Contact Shiv Shakti Ply And Hardware directly for product availability, hardware specifications, and project quotations.
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`tel:${displayPhone}`}
                  className="p-5 rounded-2xl bg-[#25342C] border border-[#34483E] hover:border-[#9A6A3A] transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#9A6A3A]/20 text-[#C4925D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                      Direct Phone Call
                    </span>
                    <span className="font-mono text-base font-bold text-white group-hover:text-[#C4925D] transition-colors">
                      {displayPhone}
                    </span>
                  </div>
                </a>

                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-[#25342C] border border-[#34483E] hover:border-[#25D366] transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                      WhatsApp Enquiry Desk
                    </span>
                    <span className="font-mono text-base font-bold text-[#25D366] group-hover:underline">
                      +91 {displayWhatsApp}
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-[#25342C]/90 border border-[#34483E] backdrop-blur-md space-y-6">
              <h3 className="font-display font-bold text-xl text-white">
                Fast Enquiry & Quotes
              </h3>
              <p className="text-xs sm:text-sm text-[#F4F1EA]/80 leading-relaxed">
                Click below to send a pre-filled enquiry on WhatsApp or submit a quotation request for your construction or interior project.
              </p>

              <div className="space-y-3">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Message</span>
                </a>

                <button
                  type="button"
                  onClick={() => openQuoteModal({ type: 'quote' })}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-stone-100 text-[#1E2A24] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Request Online Quote</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
