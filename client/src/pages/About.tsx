import React from 'react';
import { ShieldCheck, Award, Truck, Users, CheckCircle2, Building2, Wrench } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const About: React.FC = () => {
  const { settings } = useStore();
  const storeName = settings?.storeName || 'Shree Hardware & Plywood';

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block">
            About {storeName}
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#1E2A24] tracking-tight">
            A Trusted Destination for Quality Plywood, Hardware & Interior Materials
          </h1>
          <p className="text-base text-stone-600 leading-relaxed font-normal">
            Supplying architects, interior contractors, furniture workshops, and homeowners with certified building materials since {settings?.established || '1998'}.
          </p>
        </div>

        {/* Story & Background Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-4/3 rounded-3xl overflow-hidden bg-stone-900 border border-[#E7E5E4] shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80"
              alt="Timber Warehouse"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121A16] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-[#1E2A24]/90 backdrop-blur-md text-white border border-white/10">
              <span className="text-xs font-semibold text-[#C4925D] uppercase tracking-wider block mb-1">
                Central India Timber Distribution
              </span>
              <h4 className="font-display font-bold text-lg text-white">
                Direct Mill Sourcing & Certified Stockists
              </h4>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1E2A24]">
              Our Heritage & Commitment
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              {settings?.about ||
                'Founded with a mission to bring transparency and uncompromised quality to the timber and building materials sector, we maintain strict quality standards across our entire inventory.'}
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              In an industry where non-waterproof boards are often misrepresented as marine plywood, our promise is absolute integrity: every sheet of BWP marine plywood, HDHMR board, and architectural mortise lock comes from verified manufacturers with authentic BIS/ISI certification and warranty support.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E7E5E4]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E2A24] text-sm">Wholesale Yard</h4>
                  <p className="text-xs text-stone-500">Ready Stock of 8x4 Sheets</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] text-[#9A6A3A] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E2A24] text-sm">Authorized Dealer</h4>
                  <p className="text-xs text-stone-500">Century, Godrej, Greenply</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Pillars */}
        <div className="bg-white rounded-3xl border border-[#E7E5E4] p-8 sm:p-14 shadow-xs space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A]">
              Core Standards
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1E2A24]">
              Why Builders, Architects & Carpenters Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
            <div className="space-y-2.5 p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4]">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/15 text-[#9A6A3A] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1E2A24]">
                Quality Products
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Only grade-tested timber, BWP 710 marine plywood, and corrosion-resistant SS 304 hardware fittings.
              </p>
            </div>

            <div className="space-y-2.5 p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4]">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/15 text-[#9A6A3A] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1E2A24]">
                Trusted Brands
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Direct partnerships with CenturyPly, Greenply, Godrej, Dorma, Hafele, Hettich, and Fevicol.
              </p>
            </div>

            <div className="space-y-2.5 p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4]">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/15 text-[#9A6A3A] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1E2A24]">
                Competitive Pricing
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tiered volume discounts for commercial turn-key projects, residential builders, and workshops.
              </p>
            </div>

            <div className="space-y-2.5 p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4]">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/15 text-[#9A6A3A] flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1E2A24]">
                Expert Guidance
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hardware scheduling, shutter weight calculation, and correct adhesive selection for high-heat zones.
              </p>
            </div>

            <div className="space-y-2.5 p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4]">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/15 text-[#9A6A3A] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1E2A24]">
                Wide Product Range
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                From raw commercial plywood to high-end biometric door locks and imported fluted laminates.
              </p>
            </div>

            <div className="space-y-2.5 p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E4]">
              <div className="w-10 h-10 rounded-xl bg-[#9A6A3A]/15 text-[#9A6A3A] flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1E2A24]">
                Local Delivery Support
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Dedicated vehicle fleet trained in handling large 8x4 boards to prevent edge and corner transit damage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
