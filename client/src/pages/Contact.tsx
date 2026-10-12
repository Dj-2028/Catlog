import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
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
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(err?.message || 'Failed to submit contact enquiry. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const storeName = settings?.storeName || 'Shree Hardware & Plywood';

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block">
            Visit Our Store & Yard
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#1E2A24] tracking-tight">
            Get in Touch with {storeName}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
            Whether you need bulk project quotations, custom sheet cutting estimates, or technical hardware consultation, we are here to assist.
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

              <div className="space-y-5 text-sm">
                {/* Physical Address */}
                {settings?.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1E2A24] text-xs uppercase tracking-wider mb-1">
                        Yard & Showroom Address
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {settings.address}
                      </p>
                    </div>
                  </div>
                )}

                {/* Phones */}
                {settings?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1E2A24] text-xs uppercase tracking-wider mb-1">
                        Phone Enquiries
                      </h4>
                      <div className="space-y-1">
                        <a
                          href={`tel:${settings.phone}`}
                          className="block text-sm font-semibold text-[#1E2A24] hover:text-[#9A6A3A] font-mono"
                        >
                          {settings.phone}
                        </a>
                        {settings.alternatePhone && (
                          <a
                            href={`tel:${settings.alternatePhone}`}
                            className="block text-xs text-stone-500 hover:text-[#9A6A3A] font-mono"
                          >
                            Alt: {settings.alternatePhone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1E2A24] text-xs uppercase tracking-wider mb-1">
                      Direct WhatsApp Desk
                    </h4>
                    <p className="text-xs text-stone-500 mb-2">
                      Send your handwritten material list or drawings for instant review.
                    </p>
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Email */}
                {settings?.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1E2A24] text-xs uppercase tracking-wider mb-1">
                        Email Desk
                      </h4>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-sm font-medium text-[#1E2A24] hover:text-[#9A6A3A]"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Business Hours */}
                {settings?.businessHours && settings.businessHours.length > 0 && (
                  <div className="flex items-start gap-4 pt-2 border-t border-[#F5F5F4]">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1E2A24] text-xs uppercase tracking-wider mb-1">
                        Operational Hours
                      </h4>
                      <div className="space-y-1 text-xs text-stone-600">
                        {settings.businessHours.map((h, i) => (
                          <p key={i}>{h}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-[#E7E5E4] p-8 sm:p-10 shadow-xs">
              <h3 className="font-display font-bold text-2xl text-[#1E2A24] mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                Fill in the form below and our material manager will get back to you within 2 business hours.
              </p>

              {success ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-[#1E2A24]">
                    Message Sent Successfully
                  </h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Thank you! We have received your inquiry and will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#1E2A24] text-white text-xs font-semibold"
                  >
                    Send Another Message
                  </button>
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
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alok Verma"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#9A6A3A]"
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
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-sm text-[#1A1A1A] font-mono focus:outline-none focus:border-[#9A6A3A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alok@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#9A6A3A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Enquiry Type
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#9A6A3A]"
                      >
                        <option value="General Enquiry">General Enquiry</option>
                        <option value="Plywood Bulk Supply">Plywood Bulk Supply</option>
                        <option value="Hardware Consultation">Architectural Hardware</option>
                        <option value="Cutting Estimation">Custom Cutting Estimation</option>
                        <option value="Contractor Partnership">Contractor Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Message & Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project, sheet sizes, quantity, or questions..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7E5E4] bg-[#FAF9F6] text-sm text-[#1A1A1A] resize-none focus:outline-none focus:border-[#9A6A3A]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-xl bg-[#1E2A24] hover:bg-[#2D3E35] disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#C4925D]" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#C4925D]" />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps Location Embed */}
        {settings?.mapEmbedUrl && (
          <div className="bg-white rounded-3xl border border-[#E7E5E4] p-6 shadow-xs overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl text-[#1E2A24]">Find Us on the Map</h3>
                <p className="text-xs text-stone-500">Visit our warehouse and display gallery in person.</p>
              </div>
              {settings.mapUrl && (
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#9A6A3A] hover:underline"
                >
                  Open in Google Maps →
                </a>
              )}
            </div>
            <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#E7E5E4]">
              <iframe
                title="Store Location"
                src={settings.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
