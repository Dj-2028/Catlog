import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // Curated category placeholder images based on name
  const getCategoryImage = (name: string, fallback?: string | null) => {
    if (fallback) return fallback;
    const lower = name.toLowerCase();
    if (lower.includes('plywood')) return 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80';
    if (lower.includes('lock') || lower.includes('handle')) return 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80';
    if (lower.includes('laminate') || lower.includes('veneer')) return 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80';
    if (lower.includes('hinge') || lower.includes('channel')) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
    if (lower.includes('cabinet') || lower.includes('kitchen')) return 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80';
    if (lower.includes('adhesive')) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
    if (lower.includes('screw') || lower.includes('fastener')) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
    return 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80';
  };

  const image = getCategoryImage(category.name, category.coverImage);

  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="group relative rounded-2xl overflow-hidden bg-stone-900 border border-[#E7E5E4] hover:border-[#9A6A3A] transition-all duration-300 flex flex-col justify-end p-6 aspect-4/3 shadow-xs hover:shadow-xl"
    >
      {/* Background Image with dark overlay */}
      <img
        src={image}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-70 group-hover:opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#121A16] via-[#121A16]/50 to-transparent" />

      {/* Foreground Content */}
      <div className="relative z-10 flex items-end justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#C4925D] block mb-1">
            {category.productCount !== undefined ? `${category.productCount} Products` : 'Catalog'}
          </span>
          <h3 className="font-display font-bold text-white text-lg sm:text-xl group-hover:text-[#F4F1EA] transition-colors leading-tight">
            {category.name}
          </h3>
        </div>

        <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#9A6A3A] group-hover:border-[#9A6A3A] transition-all shrink-0">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};
