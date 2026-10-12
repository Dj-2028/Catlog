import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ExternalLink,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { submitEnquiry } from '../services/enquiries';

export const Contact: React.FC = () => {
  const { settings, getWhatsAppUrl } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Enquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storeName = settings?.storeName || 'Shiv Shakti Ply And Hardware';
  const displayPhone = settings?.phone || '7987158644';
  const displayWhatsApp = '9755672433';
  const verifiedAddress = settings?.address || 'Narmada Road, Bhim Nagar, Polipather, Gwarighat, Jabalpur, Madhya Pradesh 482001';
  const mapLink = settings?.mapUrl || 'https://share.google/cPLJQiTvGPre2xRWt';
  const mapEmbedUrl = settings?.mapEmbedUrl || 'https://maps.google.com/maps?q=Shiv+Shakti+Ply+And+Hardware+Narmada+Road+Polipather+Gwarighat+Jabalpur&t=&z=15&ie=UTF8&iwloc=&output=embed';

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
        type: 'general',
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        message: `${subject ? `[${subject}] ` : ''}${message.trim()}`,
        sourcePage: '/contact',
      });
      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit contact enquiry. Please call or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block">
            Store Contact & Location
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#1E2A24] tracking-tight">
            Contact {storeName}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
            Visit our retail store in Gwarighat, Jabalpur or connect with us directly by phone or WhatsApp for quotes and product availability.
          </p>
        </div>

        {/* Contact Info Cards & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E7E5E4] p-8 shadow-xs space-y-6">
              <h3 className="font-display font-bold text-xl text-[#1E2A24] border-b border-[#F5F5F4] pb-4">
                Store Location & Contacts
              </h3>

              <div className="space-y-6 text-sm">
                {/* Physical Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1E2A24] text-xs uppercase tracking-wider mb-1">
                      Store Address
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {verifiedAddress}
                    </p>
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#9A6A3A] hover:text-[#7C4D22] mt-2"
                    >
                      <span>Open on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Phone Contact */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1E2A24] text-xs uppercase tracking-wider mb-1">
                      Phone Call Enquiries
                    </h4>
                    <a
                      href={`tel:${displayPhone}`}
                      className="text-sm sm:text-base font-bold text-[#1E2A24] hover:text-[#9A6A3A] font-mono block"
                    >
                      {displayPhone}
                    </a>
                    <span className="text-xs text-stone-500">Available during business hours</span>
                  </div>
                </div>

                {/* WhatsApp Contact */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1E2A24] text-xs uppercase tracking-wider mb-1">
                      WhatsApp Contact & Enquiry Desk
                    </h4>
                    <p className="text-xs text-stone-500 mb-2">
                      Send your material requirements, photos, or measurements for quick details.
                    </p>
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp (+91 {displayWhatsApp})</span>
                    </a>
                  </div>
                </div>

                {/* Store Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1E2A24] text-xs uppercase tracking-wider mb-1">
                      Store Hours
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600">
                      Open daily from 10:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E7E5E4] p-8 sm:p-10 shadow-xs">
            <h3 className="font-display font-bold text-2xl text-[#1E2A24] mb-2">
              Send an Online Enquiry
            </h3>
            <p className="text-sm text-stone-600 mb-6">
              Fill in your details below and we will get back to you with material information and estimates.
            </p>

            {success ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-2xl text-[#1E2A24]">
                  Enquiry Submitted!
                </h4>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Thank you for contacting Shiv Shakti Ply And Hardware. We will review your message and reach out shortly.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-[#1E2A24] transition-colors"
                  >
                    Send Another Message
                  </button>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-xl bg-[#25D366] text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Also WhatsApp Us</span>
                  </a>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#9A6A3A] focus:ring-1 focus:ring-[#9A6A3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#9A6A3A] focus:ring-1 focus:ring-[#9A6A3A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rajesh@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#9A6A3A] focus:ring-1 focus:ring-[#9A6A3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Product Category Interest
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#9A6A3A] focus:ring-1 focus:ring-[#9A6A3A]"
                    >
                      <option value="Product Enquiry">General Product Enquiry</option>
                      <option value="Plywood">Plywood</option>
                      <option value="Hardware supplies">Hardware supplies</option>
                      <option value="Paints">Paints</option>
                      <option value="Sunmica / decorative laminates">Sunmica / decorative laminates</option>
                      <option value="Plumbing supplies">Plumbing supplies</option>
                      <option value="Sanitaryware">Sanitaryware</option>
                      <option value="Electrical supplies">Electrical supplies</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Interior-related materials and supplies">Interior-related materials and supplies</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Your Requirement or Message
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your material requirements, approximate sheet sizes, or fittings needed..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#9A6A3A] focus:ring-1 focus:ring-[#9A6A3A]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#1E2A24] hover:bg-[#2D3E35] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
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
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Embedded Google Maps Section */}
        <div className="bg-white rounded-3xl border border-[#E7E5E4] overflow-hidden shadow-xs p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-xl text-[#1E2A24]">
                Store Location Map
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {verifiedAddress}
              </p>
            </div>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E2A24] text-white text-xs font-semibold hover:bg-[#2D3E35] transition-colors"
            >
              <span>Open in Google Maps App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full h-96 rounded-2xl overflow-hidden border border-[#E7E5E4]">
            <iframe
              title="Shiv Shakti Ply And Hardware Google Maps Location"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
