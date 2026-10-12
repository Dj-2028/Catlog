import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MessageCircle,
  FileText,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Package,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { fetchProductById, fetchProducts } from '../services/products';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { settings, openQuoteModal, getWhatsAppUrl } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        setActiveImageIdx(0);
        document.title = `${data.name} | ${settings?.storeName || 'Store'}`;

        // Fetch related products from same category
        if (data.category) {
          fetchProducts({ category: data.category, limit: 4 }).then((res) => {
            setRelatedProducts(res.products.filter((p) => p._id !== data._id).slice(0, 4));
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load product details', err);
        setError('Product not found or has been removed from catalog.');
      })
      .finally(() => setLoading(false));
  }, [id, settings]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-7 aspect-4/3 bg-stone-200 rounded-3xl" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-6 bg-stone-200 rounded-lg w-1/3" />
            <div className="h-10 bg-stone-200 rounded-lg w-4/5" />
            <div className="h-4 bg-stone-200 rounded-lg w-1/2" />
            <div className="h-28 bg-stone-200 rounded-xl w-full" />
            <div className="h-12 bg-stone-200 rounded-xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-[#1E2A24] mb-2">Product Not Found</h2>
        <p className="text-sm text-stone-500 mb-6">{error || 'Unable to display product.'}</p>
        <Link
          to="/products"
          className="px-6 py-2.5 rounded-xl bg-[#1E2A24] text-white text-sm font-semibold inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const availabilityMap: Record<string, { label: string; cls: string }> = {
    in_stock: { label: 'In Stock & Ready for Dispatch', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    limited: { label: 'Limited Stock Available', cls: 'bg-amber-50 text-amber-800 border-amber-300' },
    on_order: { label: 'Made to Order / Pre-order', cls: 'bg-blue-50 text-blue-800 border-blue-300' },
    out_of_stock: { label: 'Currently Out of Stock', cls: 'bg-stone-100 text-stone-700 border-stone-300' },
  };

  const avail = availabilityMap[product.availability] || availabilityMap.in_stock;
  const currentImage = product.images?.[activeImageIdx]?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80';

  const handleWhatsAppEnquiry = () => {
    const categoryInfo = product.category ? `[${product.category}] ` : '';
    const message = `Hello Shiv Shakti Ply And Hardware, I would like to enquire about ${categoryInfo}${product.name} (SKU: ${product.serialNo}). Please share the details.`;
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-[#1E2A24]">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link to="/products" className="hover:text-[#1E2A24]">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#1E2A24]"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[#1E2A24] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-white border border-[#E7E5E4] shadow-sm">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.brand && (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-[#1E2A24]/90 backdrop-blur-xs text-white text-xs font-semibold tracking-wider uppercase shadow-sm">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIdx === idx
                        ? 'border-[#9A6A3A] scale-102 ring-2 ring-[#9A6A3A]/20'
                        : 'border-[#E7E5E4] hover:border-stone-400 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality assurance box */}
            <div className="p-5 rounded-2xl bg-[#F4F1EA] border border-[#E7E5E4] flex items-center gap-4 text-xs text-[#1E2A24]">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/20 text-[#9A6A3A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold">100% Guaranteed Genuine Timber Product</h4>
                <p className="text-stone-600">
                  Backed by manufacturer test certificates. Direct stock dispatch from authorized wholesale yards.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Product Meta & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E7E5E4] p-6 sm:p-8 shadow-xs space-y-6">
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs font-medium text-stone-500 border-b border-[#F5F5F4] pb-4">
                <span className="flex items-center gap-1.5 text-[#9A6A3A]">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{product.category}</span>
                </span>
                <span className="font-mono text-stone-400">SKU: {product.serialNo}</span>
              </div>

              {/* Title & Brand */}
              <div>
                {product.brand && (
                  <span className="text-xs font-bold text-[#9A6A3A] uppercase tracking-wider block mb-1">
                    {product.brand}
                  </span>
                )}
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E2A24] leading-snug">
                  {product.name}
                </h1>
              </div>

              {/* Availability Pill */}
              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${avail.cls}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{avail.label}</span>
                </span>
              </div>

              {/* Price / Quote Info */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4]">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                  Indicative Unit Price
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  {product.price > 0 ? (
                    <>
                      <span className="font-display font-bold text-3xl text-[#1E2A24]">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-stone-500">/ unit (taxes extra where applicable)</span>
                    </>
                  ) : (
                    <span className="font-display font-bold text-2xl text-[#9A6A3A]">
                      Quotation on Request
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                  Bulk contractor volume discounts available for architects, interior designers, and carpentry workshops.
                </p>
              </div>

              {/* Description Snippet */}
              {product.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Product Overview
                  </h4>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Primary Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => openQuoteModal({ product, type: 'product' })}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#1E2A24] hover:bg-[#2D3E35] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <FileText className="w-4 h-4 text-[#C4925D]" />
                  <span>Request an Itemized Quote</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppEnquiry}
                  className="w-full py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire on WhatsApp</span>
                </button>

                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="w-full py-2.5 px-6 rounded-xl border border-[#E7E5E4] hover:bg-stone-50 text-[#1E2A24] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#9A6A3A]" />
                    <span>Call Store: {settings.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-white rounded-3xl border border-[#E7E5E4] p-8 mb-16 shadow-xs">
            <h3 className="font-display font-bold text-2xl text-[#1E2A24] mb-6 tracking-tight">
              Technical Specifications & Dimensions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2.5 border-b border-[#F5F5F4] text-sm"
                >
                  <span className="font-medium text-stone-500">{key}</span>
                  <span className="font-semibold text-[#1E2A24] text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products in the same category */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#9A6A3A] block mb-1">
                  Similar Items
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1E2A24]">
                  More from {product.category}
                </h3>
              </div>
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-semibold text-[#9A6A3A] hover:underline"
              >
                View all in category
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
