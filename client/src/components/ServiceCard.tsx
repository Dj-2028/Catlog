import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Service } from '../types';
import { useStore } from '../context/StoreContext';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { openQuoteModal } = useStore();

  const iconMap: Record<string, string> = {
    saw: '🪚',
    consult: '🤝',
    cabinet: '🗄️',
    truck: '🚛',
    delivery: '📦',
    support: '🛠️',
  };

  const icon = iconMap[service.icon || ''] || '🛠️';
  const imageUrl = service.image?.url;

  return (
    <div className="bg-white rounded-3xl border border-[#E7E5E4] hover:border-[#9A6A3A]/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      {/* Optional Service Cover Image */}
      {imageUrl && (
        <div className="relative aspect-16/9 overflow-hidden bg-[#F4F1EA]">
          <img
            src={imageUrl}
            alt={service.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-[#1E2A24]/90 backdrop-blur-md flex items-center justify-center text-xl shadow-xs">
            {icon}
          </div>
        </div>
      )}

      <div className="p-7 flex-1 flex flex-col justify-between">
        <div>
          {!imageUrl && (
            <div className="w-12 h-12 rounded-2xl bg-[#F4F1EA] border border-[#E7E5E4] flex items-center justify-center text-2xl mb-4">
              {icon}
            </div>
          )}

          <h3 className="font-display font-bold text-[#1E2A24] text-xl mb-2.5 group-hover:text-[#9A6A3A] transition-colors">
            {service.title}
          </h3>

          <p className="text-sm text-stone-600 leading-relaxed mb-5">
            {service.shortDescription || service.description}
          </p>

          {/* Highlights bullets */}
          {service.highlights && service.highlights.length > 0 && (
            <div className="space-y-2 mb-6 pt-4 border-t border-[#F5F5F4]">
              {service.highlights.slice(0, 3).map((hl, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-[#9A6A3A] shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-[#E7E5E4] flex items-center justify-between">
          <button
            type="button"
            onClick={() => openQuoteModal({ service, type: 'service' })}
            className="w-full py-3 px-4 rounded-xl bg-[#1E2A24] hover:bg-[#2D3E35] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-98"
          >
            <span>{service.ctaLabel || 'Get Service Enquiry'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C4925D]" />
          </button>
        </div>
      </div>
    </div>
  );
};
