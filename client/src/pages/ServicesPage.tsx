import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { fetchServices } from '../services/services';
import type { Service } from '../types';
import { useStore } from '../context/StoreContext';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { openQuoteModal } = useStore();

  useEffect(() => {
    document.title = 'Store Services | Custom Cutting, Hardware Consultation & Delivery';
    fetchServices()
      .then((data) => setServices(data))
      .catch((err) => console.error('Failed to load services', err))
      .finally(() => setLoading(false));
  }, []);

  const iconMap: Record<string, string> = {
    saw: '🪚',
    consult: '🤝',
    cabinet: '🗄️',
    truck: '🚛',
    delivery: '📦',
    support: '🛠️',
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A6A3A] block mb-2">
            Professional Value-Add Services
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#1E2A24] tracking-tight mb-4">
            Workshop & Job-Site Services
          </h1>
          <p className="text-base text-stone-600 leading-relaxed font-normal">
            Beyond supplying raw materials, we provide in-house dimension cutting, expert hardware scheduling, and dedicated site logistics for construction projects.
          </p>
        </div>

        {loading ? (
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-stone-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {services.map((svc, idx) => {
              const icon = iconMap[svc.icon || ''] || '🛠️';
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={svc._id}
                  className="bg-white rounded-3xl border border-[#E7E5E4] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 items-center"
                >
                  {/* Service Visual */}
                  <div
                    className={`lg:col-span-5 relative aspect-16/10 lg:aspect-auto lg:h-full bg-[#1E2A24] overflow-hidden ${
                      isEven ? 'lg:order-2' : ''
                    }`}
                  >
                    {svc.image?.url ? (
                      <img
                        src={svc.image.url}
                        alt={svc.title}
                        className="w-full h-full object-cover min-h-[260px] opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[260px] flex items-center justify-center text-7xl bg-[#25342C]">
                        {icon}
                      </div>
                    )}
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-[#1E2A24]/90 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20">
                      {icon}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className={`lg:col-span-7 p-8 sm:p-12 space-y-5 ${isEven ? 'lg:order-1' : ''}`}>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A6A3A] block mb-1">
                        Service #{idx + 1}
                      </span>
                      <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1E2A24]">
                        {svc.title}
                      </h2>
                    </div>

                    <p className="text-sm text-stone-600 leading-relaxed">
                      {svc.description || svc.shortDescription}
                    </p>

                    {/* Highlights */}
                    {svc.highlights && svc.highlights.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {svc.highlights.map((hl, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                            <CheckCircle2 className="w-4 h-4 text-[#9A6A3A] shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => openQuoteModal({ service: svc, type: 'service' })}
                        className="px-6 py-3.5 rounded-xl bg-[#1E2A24] hover:bg-[#2D3E35] text-white text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-md active:scale-98"
                      >
                        <span>{svc.ctaLabel || 'Get Service Enquiry'}</span>
                        <ArrowRight className="w-4 h-4 text-[#C4925D]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
