import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Search, FileText, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const { settings, openQuoteModal } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'Services', path: '/services' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const storeName = settings?.storeName || 'Shree Hardware & Plywood';

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-[#1E2A24] text-[#F4F1EA] text-xs py-2 px-4 border-b border-[#2D3E35]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[#C4925D] font-medium tracking-wide">
              ★ Authorized Timber & Architectural Hardware Distributors
            </span>
            <span className="sm:hidden text-[#C4925D] font-medium">
              ★ Premium Plywood & Hardware
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#F4F1EA]/80">
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1.5 hover:text-[#C4925D] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#9A6A3A]" />
                <span className="font-mono">{settings.phone}</span>
              </a>
            )}
            <span className="hidden md:inline text-white/30">|</span>
            <a
              href="/admin"
              className="hover:text-white transition-colors text-[11px] text-white/60"
            >
              Staff Portal
            </a>
          </div>
        </div>
      </div>

      {/* Main sticky navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E7E5E4] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-[#1E2A24] border border-[#9A6A3A]/40 flex items-center justify-center font-display font-bold text-[#C4925D] text-xl shadow-xs group-hover:scale-105 transition-transform duration-300">
                SH
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-[#1E2A24] text-lg sm:text-xl tracking-tight leading-none group-hover:text-[#9A6A3A] transition-colors">
                  {storeName}
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-[#9A6A3A] uppercase mt-0.5">
                  Timber • Fittings • Interior Materials
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-[#1E2A24] bg-[#F4F1EA] font-semibold'
                        : 'text-[#1A1A1A]/80 hover:text-[#1E2A24] hover:bg-[#F4F1EA]/60'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl border border-[#E7E5E4] hover:border-[#9A6A3A] text-[#1A1A1A]/70 hover:text-[#1E2A24] bg-white transition-colors"
                title="Search products"
                aria-label="Search catalog"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => openQuoteModal({ type: 'quote' })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E2A24] hover:bg-[#2D3E35] text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-98"
              >
                <FileText className="w-4 h-4 text-[#C4925D]" />
                <span>Get a Quote</span>
              </button>
            </div>

            {/* Mobile hamburger menu button */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg border border-[#E7E5E4] text-[#1A1A1A]/70"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg border border-[#E7E5E4] text-[#1A1A1A] hover:bg-stone-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-[#E7E5E4] bg-white px-4 py-3 shadow-inner">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-stone-400 absolute left-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name, brand (Century, Godrej...), SKU, or category..."
                  className="w-full pl-12 pr-28 py-3 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-sm text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#9A6A3A] focus:ring-1 focus:ring-[#9A6A3A]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 rounded-lg bg-[#1E2A24] text-white text-xs font-semibold hover:bg-[#2D3E35] transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E7E5E4] bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#F4F1EA] text-[#1E2A24] font-semibold'
                        : 'text-stone-700 hover:bg-[#FAF9F6]'
                    }`
                  }
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </NavLink>
              ))}
            </nav>

            <div className="pt-2 border-t border-[#F5F5F4] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openQuoteModal({ type: 'quote' });
                }}
                className="w-full py-3 rounded-xl bg-[#1E2A24] text-white font-semibold text-center text-sm shadow-xs flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#C4925D]" />
                <span>Request a Quote</span>
              </button>
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="w-full py-2.5 rounded-xl border border-[#E7E5E4] text-[#1E2A24] font-medium text-center text-sm flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#9A6A3A]" />
                  <span>Call {settings.phone}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
