import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquareText, Layers, MessageCircle } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openQuoteModal, getProductWhatsAppUrl } = useStore();

  const imgSrc = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80';
  const linkTarget = `/products/${product.slug || product._id}`;

  const availabilityMap: Record<string, { label: string; cls: string }> = {
    in_stock: { label: 'In Stock', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    limited: { label: 'Limited Stock', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    on_order: { label: 'Made to Order', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    out_of_stock: { label: 'Out of Stock', cls: 'bg-stone-100 text-stone-600 border-stone-200' },
  };

  const avail = availabilityMap[product.availability] || availabilityMap.in_stock;

  // Extract up to 2 key specifications to show as clean pills
  const specEntries = Object.entries(product.specifications || {}).slice(0, 2);

  return (
    <div className="group bg-white rounded-2xl border border-[#E7E5E4] hover:border-[#9A6A3A]/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link to={linkTarget} className="relative block aspect-4/3 bg-[#F4F1EA] overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback if image fails to load
            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Brand Badge */}
        {product.brand && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#1E2A24]/90 backdrop-blur-xs text-white text-[11px] font-semibold tracking-wide shadow-xs">
            {product.brand}
          </span>
        )}

        {/* Availability Badge */}
        <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${avail.cls}`}>
          {avail.label}
        </span>
      </Link>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5 font-medium">
            <span className="flex items-center gap-1 text-[#9A6A3A]">
              <Layers className="w-3 h-3" />
              <span>{product.category}</span>
            </span>
            <span className="font-mono text-stone-400 text-[11px]">SKU: {product.serialNo}</span>
          </div>

          {/* Product Title */}
          <Link to={linkTarget} className="block group-hover:text-[#9A6A3A] transition-colors">
            <h3 className="font-display font-bold text-[#1A1A1A] text-base leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          {product.description && (
            <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Key Specifications snippet */}
          {specEntries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#F5F5F4]">
              {specEntries.map(([k, v]) => (
                <span
                  key={k}
                  className="px-2 py-0.5 rounded-md bg-[#FAF9F6] border border-[#E7E5E4] text-[11px] text-stone-600 font-medium"
                >
                  <span className="text-stone-400">{k}:</span> {v}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & CTA Actions */}
        <div className="pt-4 mt-4 border-t border-[#E7E5E4] flex items-center justify-between gap-2">
          <div>
            {product.price > 0 ? (
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-400 block">Indicative Price</span>
                <span className="font-display font-bold text-[#1E2A24] text-lg">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-400 block">Pricing</span>
                <span className="text-xs font-semibold text-[#9A6A3A]">Quote on Request</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={getProductWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white transition-all text-xs font-semibold flex items-center justify-center"
              title={`Enquire on WhatsApp about ${product.name}`}
              aria-label={`Enquire on WhatsApp about ${product.name}`}
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => openQuoteModal({ product, type: 'product' })}
              className="px-2.5 py-2 rounded-xl bg-[#F4F1EA] hover:bg-[#9A6A3A] text-[#1E2A24] hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
              title="Request online quotation"
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quote</span>
            </button>

            <Link
              to={linkTarget}
              className="px-3 py-2 rounded-xl bg-[#1E2A24] hover:bg-[#2D3E35] text-white transition-colors text-xs font-semibold flex items-center gap-1"
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
