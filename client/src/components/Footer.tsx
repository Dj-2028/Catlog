import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Clock, ArrowUpRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  const { settings, getWhatsAppUrl } = useStore();
  const storeName = settings?.storeName || 'Shiv Shakti Ply And Hardware';
  const displayPhone = settings?.phone || '7987158644';
  const displayWhatsApp = '9755672433';
  const mapLink = settings?.mapUrl || 'https://share.google/cPLJQiTvGPre2xRWt';

  const categoriesList = [
    'Plywood',
    'Hardware supplies',
    'Paints',
    'Sunmica / decorative laminates',
    'Plumbing supplies',
    'Sanitaryware',
    'Electrical supplies',
    'Electronics',
    'Interior-related materials and supplies',
  ];

  return (
    <footer className="bg-[#121A16] text-[#F4F1EA] border-t border-[#2D3E35] mt-auto">
      {/* Upper features strip */}
      <div className="border-b border-[#2D3E35]/60 bg-[#1A241F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D] shrink-0 font-bold">
                15+
              </div>
              <div>
                <h4 className="font-semibold text-white">15+ Years Experience</h4>
                <p className="text-xs text-[#F4F1EA]/70 mt-0.5">Established hardware & building supplier</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D] shrink-0 font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-white">Comprehensive Range</h4>
                <p className="text-xs text-[#F4F1EA]/70 mt-0.5">Plywood, paints, hardware & fittings</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D] shrink-0 font-bold">
                📍
              </div>
              <div>
                <h4 className="font-semibold text-white">Central Jabalpur Store</h4>
                <p className="text-xs text-[#F4F1EA]/70 mt-0.5">Gwarighat, Narmada Road location</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D] shrink-0 font-bold">
                💬
              </div>
              <div>
                <h4 className="font-semibold text-white">Direct WhatsApp Desk</h4>
                <p className="text-xs text-[#F4F1EA]/70 mt-0.5">Instant quotes and availability info</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Store Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#1E2A24] border border-[#9A6A3A] flex items-center justify-center font-display font-bold text-[#C4925D] text-lg">
                SS
              </div>
              <span className="font-display font-bold text-white text-xl tracking-tight">
                {storeName}
              </span>
            </Link>

            <p className="text-sm text-[#F4F1EA]/80 leading-relaxed max-w-md">
              Established supplier in Jabalpur with 15+ years of experience providing quality plywood, hardware supplies, paints, decorative laminates, plumbing, sanitaryware, electrical supplies, electronics, and interior materials.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E2A24] text-[#C4925D] border border-[#2D3E35] hover:border-[#9A6A3A] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Google Maps</span>
              </a>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/30 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {displayWhatsApp}</span>
              </a>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-4 tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F4F1EA]/80">
              <li>
                <Link to="/" className="hover:text-[#C4925D] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#C4925D] transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#C4925D] transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#C4925D] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C4925D] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C4925D] transition-colors">
                  Visit & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Product Categories */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-4 tracking-wide">
              Product Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#F4F1EA]/80">
              {categoriesList.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="hover:text-[#C4925D] transition-colors flex items-center gap-1"
                  >
                    <span>{cat}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Contact Details */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-4 tracking-wide">
              Store Contact
            </h4>
            <ul className="space-y-3 text-sm text-[#F4F1EA]/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9A6A3A] shrink-0 mt-1" />
                <span className="text-xs leading-relaxed">
                  {settings?.address || 'Narmada Road, Bhim Nagar, Polipather, Gwarighat, Jabalpur, Madhya Pradesh 482001'}
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9A6A3A] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-stone-400">Phone Call</span>
                  <a href={`tel:${displayPhone}`} className="hover:text-[#C4925D] font-mono text-xs font-semibold">
                    {displayPhone}
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-stone-400">WhatsApp Enquiry</span>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#25D366] font-mono text-xs font-semibold"
                  >
                    +91 {displayWhatsApp}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#9A6A3A] shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p>Open daily from 10:00 AM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & staff link */}
        <div className="border-t border-[#2D3E35] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F4F1EA]/60">
          <p>© {CURRENT_YEAR} {storeName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C4925D] transition-colors"
            >
              Google Maps Location
            </a>
            <span>•</span>
            <a href="/admin" className="hover:text-[#C4925D] transition-colors">
              Admin Portal
            </a>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#C4925D] transition-colors">
              Enquiry Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
