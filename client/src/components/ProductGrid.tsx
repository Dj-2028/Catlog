import React from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './Skeleton';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  emptyMessage = 'No products match your current filters.',
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#E7E5E4] p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center mx-auto mb-4">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="font-display font-bold text-xl text-[#1E2A24] mb-2">
          No Products Found
        </h3>
        <p className="text-sm text-stone-500 mb-6 leading-relaxed">
          {emptyMessage}
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-6 py-2.5 rounded-xl bg-[#1E2A24] hover:bg-[#2D3E35] text-white text-sm font-semibold transition-colors"
          >
            Clear Search & Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
