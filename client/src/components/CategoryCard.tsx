import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import type { Category } from '../types';
import { useStore } from '../context/StoreContext';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { getProductWhatsAppUrl } = useStore();

  const getCategoryDetails = (name: string, fallback?: string | null) => {
    const lower = name.toLowerCase();

    if (lower.includes('paint')) {
      return {
        image: fallback || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
        desc: 'Interior & exterior wall paints, primers, emulsions, and finishes.',
      };
    }
    if (lower.includes('plywood')) {
      return {
        image: fallback || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        desc: 'Commercial MR and boiling waterproof BWP marine plywood sheets.',
      };
    }
    if (lower.includes('sunmica') || lower.includes('laminate')) {
      return {
        image: fallback || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        desc: 'Decorative surface laminates, woodgrain textures, and sunmica sheets.',
      };
    }
    if (lower.includes('plumbing')) {
      return {
        image: fallback || 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
        desc: 'CPVC & UPVC pipes, brass valves, connectors, and drainage fittings.',
      };
    }
    if (lower.includes('sanitaryware') || lower.includes('sanitary')) {
      return {
        image: fallback || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        desc: 'Ceramic wash basins, bathroom fittings, and sanitary essentials.',
      };
    }
    if (lower.includes('electrical')) {
      return {
        image: fallback || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        desc: 'Modular switches, conduit pipes, wiring supplies, and accessories.',
      };
    }
    if (lower.includes('electronic')) {
      return {
        image: fallback || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        desc: 'Electronic installation fittings, control accessories, and supplies.',
      };
    }
    if (lower.includes('interior')) {
      return {
        image: fallback || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        desc: 'Decorative louvers, moulding profiles, edge bands, and interior panels.',
      };
    }
    // Default hardware supplies
    return {
      image: fallback || 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
      desc: 'Door locks, handles, concealed hinges, drawer channels, and fittings.',
    };
  };

  const { image, desc } = getCategoryDetails(category.name, category.coverImage);

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(getProductWhatsAppUrl(category.name), '_blank');
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-[#1E2A24] border border-[#E7E5E4] hover:border-[#9A6A3A] transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl">
      <Link
        to={`/products?category=${encodeURIComponent(category.name)}`}
        className="block relative aspect-16/10 overflow-hidden bg-stone-900"
      >
        {/* Background Image with subtle zoom */}
        <img
          src={image}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121A16] via-[#121A16]/40 to-transparent" />

        {/* Top badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-[#1E2A24]/90 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase text-[#C4925D] border border-white/10">
            {category.productCount !== undefined && category.productCount > 0
              ? `${category.productCount} Items`
              : 'Category'}
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <Link
            to={`/products?category=${encodeURIComponent(category.name)}`}
            className="block group/link"
          >
            <h3 className="font-display font-bold text-[#1E2A24] text-lg sm:text-xl group-hover/link:text-[#9A6A3A] transition-colors leading-snug">
              {category.name}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 mt-4 border-t border-[#F5F5F4] flex items-center justify-between gap-2">
          <Link
            to={`/products?category=${encodeURIComponent(category.name)}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E2A24] hover:text-[#9A6A3A] transition-colors"
          >
            <span>Explore Category</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleWhatsAppEnquiry}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white transition-all text-xs font-semibold"
            title={`Enquire about ${category.name} on WhatsApp`}
            aria-label={`Enquire about ${category.name} on WhatsApp`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
