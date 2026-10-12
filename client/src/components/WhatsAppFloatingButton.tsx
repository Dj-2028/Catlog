import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const { getWhatsAppUrl } = useStore();

  const handleOpen = () => {
    // Opens WhatsApp with the prompt pre-filled enquiry message:
    // “Hello Shiv Shakti Ply And Hardware, I would like to enquire about your products. Please share the details.”
    window.open(getWhatsAppUrl(), '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Enquire on WhatsApp"
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="font-semibold text-xs tracking-wide pr-1 hidden sm:inline">
          Chat on WhatsApp
        </span>
      </button>
    </div>
  );
};
