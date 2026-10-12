import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProducts, fetchProductFilters } from '../services/products';
import { fetchCategories } from '../services/categories';
import type { Product, Category, ProductFiltersData, Pagination } from '../types';
import { ProductGrid } from '../components/ProductGrid';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const currentCategory = searchParams.get('category') || 'All';
  const currentBrand = searchParams.get('brand') || 'All';
  const currentAvailability = searchParams.get('availability') || 'All';
  const currentSearch = searchParams.get('q') || '';
  const currentSort = (searchParams.get('sort') as any) || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, totalPages: 1, totalCount: 0 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtersData, setFiltersData] = useState<ProductFiltersData>({ brands: [], availability: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Local search input
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Fetch categories & facets once
  useEffect(() => {
    fetchCategories(true).then(setCategories).catch(console.error);
    fetchProductFilters().then(setFiltersData).catch(console.error);
  }, []);

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Fetch products when filters/URL change
  useEffect(() => {
    setLoading(true);
    fetchProducts({
      q: currentSearch,
      category: currentCategory,
      brand: currentBrand,
      availability: currentAvailability,
      sort: currentSort,
      page: currentPage,
      limit: 12,
    })
      .then((res) => {
        setProducts(res.products || []);
        setPagination(res.pagination || { page: 1, totalPages: 1, totalCount: 0 });
      })
      .catch((err) => {
        console.error('Failed to load products', err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [currentCategory, currentBrand, currentAvailability, currentSearch, currentSort, currentPage]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'All') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1'); // reset page on filter change
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('q', searchInput.trim());
  };

  const resetAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters =
    currentCategory !== 'All' || currentBrand !== 'All' || currentAvailability !== 'All' || Boolean(currentSearch);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block mb-2">
            Catalog & Inventory
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1E2A24] tracking-tight">
              Materials & Hardware Catalog
            </h1>
            <span className="text-xs font-medium text-stone-500 font-mono">
              Showing {pagination.totalCount} product{pagination.totalCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Search & Mobile Filter Toggle Bar */}
        <div className="bg-white rounded-2xl border border-[#E7E5E4] p-4 mb-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search product, SKU, brand, or material..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-xs sm:text-sm text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#9A6A3A] focus:ring-1 focus:ring-[#9A6A3A]"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateParam('q', '');
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1E2A24] text-white text-xs font-semibold hover:bg-[#2D3E35] transition-colors"
            >
              Go
            </button>
          </form>

          {/* Quick Category Chips for quick access */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1">
            <button
              type="button"
              onClick={() => updateParam('category', 'All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                currentCategory === 'All'
                  ? 'bg-[#1E2A24] text-white'
                  : 'bg-[#F4F1EA] text-[#1E2A24] hover:bg-stone-200'
              }`}
            >
              All Categories
            </button>
            {categories.slice(0, 5).map((c) => (
              <button
                key={c._id}
                type="button"
                onClick={() => updateParam('category', c.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  currentCategory === c.name
                    ? 'bg-[#1E2A24] text-white'
                    : 'bg-[#F4F1EA] text-[#1E2A24] hover:bg-stone-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 rounded-xl border border-[#E7E5E4] text-xs font-semibold text-[#1E2A24] flex items-center gap-1.5 bg-[#F4F1EA]"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters {hasActiveFilters ? '(Active)' : ''}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 whitespace-nowrap hidden sm:inline">Sort:</span>
              <select
                value={currentSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-xs text-[#1E2A24] font-medium focus:outline-none focus:border-[#9A6A3A]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="name">Name (A–Z)</option>
                <option value="name_desc">Name (Z–A)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout with Sidebar Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-white rounded-3xl border border-[#E7E5E4] p-6 shadow-xs sticky top-28">
            <div className="flex items-center justify-between border-b border-[#F5F5F4] pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#9A6A3A]" />
                <h3 className="font-display font-bold text-base text-[#1E2A24]">Filters</h3>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-[#9A6A3A] hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                Category
              </h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => updateParam('category', 'All')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    currentCategory === 'All'
                      ? 'bg-[#1E2A24] text-white'
                      : 'text-stone-700 hover:bg-[#FAF9F6]'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => updateParam('category', c.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      currentCategory === c.name
                        ? 'bg-[#1E2A24] text-white'
                        : 'text-stone-700 hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    {c.productCount !== undefined && (
                      <span className="font-mono text-[10px] opacity-70 ml-2">({c.productCount})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            {filtersData.brands.length > 0 && (
              <div className="pt-4 border-t border-[#F5F5F4]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Brand
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => updateParam('brand', 'All')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentBrand === 'All'
                        ? 'bg-[#1E2A24] text-white'
                        : 'text-stone-700 hover:bg-[#FAF9F6]'
                    }`}
                  >
                    All Brands
                  </button>
                  {filtersData.brands.map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => updateParam('brand', b.name)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        currentBrand === b.name
                          ? 'bg-[#1E2A24] text-white'
                          : 'text-stone-700 hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                      <span className="font-mono text-[10px] opacity-70 ml-2">({b.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Filter */}
            <div className="pt-4 border-t border-[#F5F5F4]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                Availability
              </h4>
              <div className="space-y-1.5">
                {[
                  { value: 'All', label: 'All Items' },
                  { value: 'in_stock', label: 'In Stock' },
                  { value: 'limited', label: 'Limited Stock' },
                  { value: 'on_order', label: 'Made to Order' },
                ].map((av) => (
                  <button
                    key={av.value}
                    type="button"
                    onClick={() => updateParam('availability', av.value)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentAvailability === av.value
                        ? 'bg-[#1E2A24] text-white'
                        : 'text-stone-700 hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {av.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={products}
              loading={loading}
              emptyMessage={
                hasActiveFilters
                  ? 'No materials match your filter combination. Try clearing some filters or searching for a different keyword.'
                  : 'No products are currently available in the catalog.'
              }
              onResetFilters={hasActiveFilters ? resetAllFilters : undefined}
            />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => updateParam('page', String(pagination.page - 1))}
                  className="p-2.5 rounded-xl border border-[#E7E5E4] bg-white text-stone-600 disabled:opacity-40 hover:bg-stone-50"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => updateParam('page', String(pNum))}
                      className={`w-10 h-10 rounded-xl text-xs font-bold font-mono transition-colors ${
                        pagination.page === pNum
                          ? 'bg-[#1E2A24] text-white'
                          : 'bg-white border border-[#E7E5E4] text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => updateParam('page', String(pagination.page + 1))}
                  className="p-2.5 rounded-xl border border-[#E7E5E4] bg-white text-stone-600 disabled:opacity-40 hover:bg-stone-50"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#F5F5F4] mb-4">
                <h3 className="font-display font-bold text-lg text-[#1E2A24]">Filters</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-stone-400 mb-2">Category</h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      updateParam('category', 'All');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                      currentCategory === 'All' ? 'bg-[#1E2A24] text-white' : 'text-stone-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => {
                        updateParam('category', c.name);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        currentCategory === c.name ? 'bg-[#1E2A24] text-white' : 'text-stone-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-xs font-bold uppercase text-stone-400 mb-2">Availability</h4>
                <div className="space-y-1">
                  {['All', 'in_stock', 'limited', 'on_order'].map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        updateParam('availability', av);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        currentAvailability === av ? 'bg-[#1E2A24] text-white' : 'text-stone-700'
                      }`}
                    >
                      {av === 'All' ? 'All' : av.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F5F5F4] flex gap-2">
              <button
                type="button"
                onClick={() => {
                  resetAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#E7E5E4] text-xs font-semibold text-stone-600"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1E2A24] text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
