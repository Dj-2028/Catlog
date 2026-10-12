import React from 'react';
import { ShieldCheck, Award, Users, Building2, Phone, MessageCircle, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const About: React.FC = () => {
  const { settings, getWhatsAppUrl } = useStore();
  const displayPhone = settings?.phone || '7987158644';
  const displayWhatsApp = '9755672433';
  const verifiedAddress = settings?.address || 'Narmada Road, Bhim Nagar, Polipather, Gwarighat, Jabalpur, Madhya Pradesh 482001';

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block">
            About Our Business
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#1E2A24] tracking-tight">
            15+ Years of Service in Jabalpur
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            Shiv Shakti Ply And Hardware is an established supplier offering quality plywood, hardware supplies, paints, decorative laminates, plumbing, sanitaryware, electrical supplies, electronics, and interior materials.
          </p>
        </div>

        {/* Story & Background Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-4/3 rounded-3xl overflow-hidden bg-stone-900 border border-[#E7E5E4] shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80"
              alt="Shiv Shakti Ply And Hardware Store and Materials"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121A16] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-[#1E2A24]/90 backdrop-blur-md text-white border border-white/10">
              <span className="text-xs font-semibold text-[#C4925D] uppercase tracking-wider block mb-1">
                Gwarighat, Jabalpur
              </span>
              <h4 className="font-display font-bold text-lg text-white">
                Shiv Shakti Ply And Hardware
              </h4>
              <p className="text-xs text-[#F4F1EA]/80 mt-1">
                15+ years serving local builders, carpenters, and homeowners
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1E2A24]">
              Our Business & Background
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Serving the community for over 15 years, Shiv Shakti Ply And Hardware is located on Narmada Road in Gwarighat, Jabalpur. We have grown alongside the city's residential and commercial development, supplying the essential building blocks for homes, modular interiors, renovations, and carpentry work.
            </p>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              We focus on practical material dependability: bringing together hardware fittings, plywood sheets, paints, sanitaryware, plumbing lines, electrical supplies, electronics, and decorative sunmica under one roof so customers and contractors can source everything conveniently with experienced counter advice.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E7E5E4]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E2A24] text-sm">Retail Store</h4>
                  <p className="text-xs text-stone-500">Gwarighat, Jabalpur</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E2A24] text-sm">15+ Years</h4>
                  <p className="text-xs text-stone-500">Established Reputation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Strengths Pillars */}
        <div className="bg-white rounded-3xl border border-[#E7E5E4] p-8 sm:p-14 shadow-xs space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A]">
              Core Strengths
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1E2A24]">
              Why Customers Rely on Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div className="space-y-2.5 p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4]">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/15 text-[#9A6A3A] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1E2A24]">
                15+ Years of Experience
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Extensive practical understanding of plywood varieties, architectural hardware, plumbing fittings, and electrical necessities.
              </p>
            </div>

            <div className="space-y-2.5 p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4]">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/15 text-[#9A6A3A] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1E2A24]">
                Complete Product Selection
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                From structural plywood and door handles to paints, sanitaryware, and electrical wiring, find all required departments in one place.
              </p>
            </div>

            <div className="space-y-2.5 p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4]">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/15 text-[#9A6A3A] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1E2A24]">
                Direct Customer Support
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Direct phone and WhatsApp assistance for product specifications, availability verification, and quick project estimates.
              </p>
            </div>
          </div>
        </div>

        {/* Store Location Summary & Contact Box */}
        <div className="rounded-3xl bg-[#1E2A24] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C4925D]">
              Visit or Contact Us
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Connect with Shiv Shakti Ply And Hardware
            </h3>
            <p className="text-sm text-[#F4F1EA]/80">
              {verifiedAddress}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={`tel:${displayPhone}`}
              className="px-6 py-3.5 rounded-xl bg-white text-[#1E2A24] text-xs font-semibold hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#9A6A3A]" />
              <span>Call {displayPhone}</span>
            </a>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {displayWhatsApp}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
