import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();
  const storeName = settings?.storeName || 'Shree Hardware & Plywood';

  return (
    <footer className="bg-[#121A16] text-[#F4F1EA] border-t border-[#2D3E35] mt-auto">
      {/* Upper features strip */}
      <div className="border-b border-[#2D3E35]/60 bg-[#1A241F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D] shrink-0 font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-white">100% Genuine Brands</h4>
                <p className="text-xs text-[#F4F1EA]/70 mt-0.5">CenturyPly, Greenply, Godrej, Hafele</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D] shrink-0 font-bold">
                🪚
              </div>
              <div>
                <h4 className="font-semibold text-white">Custom Sheet Cutting</h4>
                <p className="text-xs text-[#F4F1EA]/70 mt-0.5">Precision panel saw cutting on order</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D] shrink-0 font-bold">
                🚛
              </div>
              <div>
                <h4 className="font-semibold text-white">Job-Site Delivery</h4>
                <p className="text-xs text-[#F4F1EA]/70 mt-0.5">Protected transport for 8x4 boards</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/20 border border-[#9A6A3A]/30 flex items-center justify-center text-[#C4925D] shrink-0 font-bold">
                📋
              </div>
              <div>
                <h4 className="font-semibold text-white">Contractor & B2B Rates</h4>
                <p className="text-xs text-[#F4F1EA]/70 mt-0.5">Bulk volume discounts & test reports</p>
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
                SH
              </div>
              <span className="font-display font-bold text-white text-xl tracking-tight">
                {storeName}
              </span>
            </Link>

            <p className="text-sm text-[#F4F1EA]/80 leading-relaxed max-w-md">
              {settings?.about
                ? settings.about.slice(0, 220) + '...'
                : 'Your trusted partner for premium BWP Marine plywood, commercial boards, architectural hardware fittings, designer laminates, and building materials.'}
            </p>

            {settings?.gstin && (
              <div className="flex items-center gap-2 text-xs text-[#C4925D] bg-[#1E2A24] px-3 py-1.5 rounded-lg border border-[#2D3E35] inline-flex">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>GSTIN: {settings.gstin}</span>
              </div>
            )}
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F4F1EA]/80">
              <li>
                <Link to="/" className="hover:text-[#C4925D] transition-colors flex items-center gap-1.5">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#C4925D] transition-colors flex items-center gap-1.5">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#C4925D] transition-colors flex items-center gap-1.5">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#C4925D] transition-colors flex items-center gap-1.5">
                  Store Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C4925D] transition-colors flex items-center gap-1.5">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C4925D] transition-colors flex items-center gap-1.5">
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Categories */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-4 tracking-wide">
              Major Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F4F1EA]/80">
              <li>
                <Link to="/products?category=Plywood" className="hover:text-[#C4925D] transition-colors flex items-center gap-1">
                  <span>Marine & BWP Plywood</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/products?category=Door+Locks+%26+Handles" className="hover:text-[#C4925D] transition-colors flex items-center gap-1">
                  <span>Digital Locks & Handles</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/products?category=MDF+%26+HDF+Boards" className="hover:text-[#C4925D] transition-colors flex items-center gap-1">
                  <span>HDHMR & MDF Boards</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/products?category=Hinges+%26+Drawer+Channels" className="hover:text-[#C4925D] transition-colors flex items-center gap-1">
                  <span>Concealed Hinges & Slides</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/products?category=Laminates+%26+Veneers" className="hover:text-[#C4925D] transition-colors flex items-center gap-1">
                  <span>Decorative Laminates</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/products?category=Adhesives+%26+Sealants" className="hover:text-[#C4925D] transition-colors flex items-center gap-1">
                  <span>Fevicol & Adhesives</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Details */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-4 tracking-wide">
              Store Contact
            </h4>
            <ul className="space-y-3 text-sm text-[#F4F1EA]/80">
              {settings?.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#9A6A3A] shrink-0 mt-1" />
                  <span className="text-xs leading-relaxed">{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#9A6A3A] shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-[#C4925D] font-mono text-xs">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#9A6A3A] shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-[#C4925D] text-xs">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.businessHours && settings.businessHours.length > 0 && (
                <li className="flex items-start gap-2.5 pt-1">
                  <Clock className="w-4 h-4 text-[#9A6A3A] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    {settings.businessHours.map((h, i) => (
                      <p key={i}>{h}</p>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom copyright & staff link */}
        <div className="border-t border-[#2D3E35] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F4F1EA]/60">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/admin" className="hover:text-[#C4925D] transition-colors">
              Admin Dashboard
            </a>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#C4925D] transition-colors">
              Quotation Request
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
