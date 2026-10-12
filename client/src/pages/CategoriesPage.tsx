import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../services/categories';
import type { Category } from '../types';
import { CategoryCard } from '../components/CategoryCard';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Product Categories | Shiv Shakti Ply And Hardware';
    fetchCategories(true)
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to load categories', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block mb-2">
            Retail Departments
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1E2A24] tracking-tight mb-3">
            Product & Service Categories
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Browse our core departments: Paints, Hardware supplies, Plywood, Sunmica / decorative laminates, Plumbing supplies, Sanitaryware, Electrical supplies, Electronics, and Interior-related materials.
          </p>
        </div>

        {loading ? (
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
    </div>
  );
};
