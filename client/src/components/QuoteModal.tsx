import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Send, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { submitEnquiry } from '../services/enquiries';

export const QuoteModal: React.FC = () => {
  const { quoteModal, closeQuoteModal, settings, getWhatsAppUrl } = useStore();
  const { isOpen, product, service, type = 'quote' } = quoteModal;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill fields whenever the modal opens or the product/service changes
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError(null);
      if (product) {
        setMessage(`Hello, I would like to request price quotation and availability for "${product.name}" (${product.serialNo}).`);
      } else if (service) {
        setMessage(`Hello, I would like to enquire about your "${service.title}" service.`);
      } else {
        setMessage('');
      }
    }
  }, [isOpen, product, service]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await submitEnquiry({
        type,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        quantity: quantity.trim() || undefined,
        message: message.trim() || undefined,
        product: product?._id,
        productName: product ? `${product.name} (${product.serialNo})` : undefined,
        service: service?._id,
        serviceTitle: service?.title,
        sourcePage: window.location.pathname,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit enquiry. Please try calling us directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const itemName = product ? product.name : service ? service.title : 'Materials';
    const text = `Hello ${settings?.storeName || 'Store'}!\n\nI am interested in: *${itemName}*${quantity ? `\nEstimated Quantity: ${quantity}` : ''}\n\n${message || 'Please share pricing, available sheet sizes, and delivery timeline.'}\n\nMy Name: ${name || 'Customer'}\nContact: ${phone || ''}`;
    window.open(getWhatsAppUrl(text), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E7E5E4] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#1E2A24] text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C4925D] block">
              {product ? 'Product Quotation' : service ? 'Service Enquiry' : 'Material Quotation'}
            </span>
            <h3 className="font-display font-bold text-lg text-white">
              {product ? product.name : service ? service.title : 'Request a Project Quote'}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeQuoteModal}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h4 className="font-display font-bold text-2xl text-[#1E2A24]">
                Enquiry Received!
              </h4>
              <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Our material specialist will review your requirement and call you at{' '}
                <span className="font-mono font-medium text-[#1E2A24]">{phone}</span> shortly.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Also Send on WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={closeQuoteModal}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1E2A24] text-sm font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Preselected product / service summary card */}
              {(product || service) && (
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E7E5E4] flex items-center gap-3">
                  {product?.images?.[0]?.url && (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-[#E7E5E4]"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold text-[#9A6A3A] uppercase tracking-wider block">
                      Selected Item
                    </span>
                    <h5 className="text-xs font-bold text-[#1E2A24] truncate">
                      {product ? product.name : service?.title}
                    </h5>
                    {product?.brand && (
                      <span className="text-[11px] text-stone-500">Brand: {product.brand}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Patel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E4] bg-white text-sm text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#9A6A3A] focus:ring-1 focus:ring-[#9A6A3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E4] bg-white text-sm text-[#1A1A1A] placeholder-stone-400 font-mono focus:outline-none focus:border-[#9A6A3A] focus:ring-1 focus:ring-[#9A6A3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Email Address <span className="text-stone-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E4] bg-white text-sm text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#9A6A3A] focus:ring-1 focus:ring-[#9A6A3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Quantity / Project Size
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 50 sheets / 20 pairs"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E4] bg-white text-sm text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#9A6A3A] focus:ring-1 focus:ring-[#9A6A3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Message / Specifications Needed
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Thickness required, delivery location, preferred brands, or specific sizes..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E4] bg-white text-sm text-[#1A1A1A] placeholder-stone-400 resize-none focus:outline-none focus:border-[#9A6A3A] focus:ring-1 focus:ring-[#9A6A3A]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-5 rounded-xl bg-[#1E2A24] hover:bg-[#2D3E35] disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C4925D]" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#C4925D]" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  title="Enquire on WhatsApp directly"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
