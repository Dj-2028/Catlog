import React, { createContext, useContext, useEffect, useState } from 'react';
import type { StoreSettings, Product, Service } from '../types';
import { fetchStoreSettings } from '../services/settings';

interface QuoteModalConfig {
  isOpen: boolean;
  product?: Product | null;
  service?: Service | null;
  type?: 'quote' | 'product' | 'service' | 'general';
}

interface StoreContextValue {
  settings: StoreSettings | null;
  loadingSettings: boolean;
  quoteModal: QuoteModalConfig;
  openQuoteModal: (config?: Partial<QuoteModalConfig>) => void;
  closeQuoteModal: () => void;
  getWhatsAppUrl: (message?: string) => string;
  getProductWhatsAppUrl: (productOrCategory: { name?: string; category?: string; serialNo?: string } | string) => string;
}

const defaultSettings: StoreSettings = {
  storeName: 'Shiv Shakti Ply And Hardware',
  tagline: 'Quality Building & Interior Materials | 15+ Years of Experience',
  established: '15+ Years',
  phone: '7987158644',
  alternatePhone: '',
  whatsapp: '9755672433',
  email: '',
  address: 'Narmada Road, Bhim Nagar, Polipather, Gwarighat, Jabalpur, Madhya Pradesh 482001',
  businessHours: ['Open daily from 10:00 AM'],
  mapUrl: 'https://share.google/cPLJQiTvGPre2xRWt',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Shiv+Shakti+Ply+And+Hardware+Narmada+Road+Polipather+Gwarighat+Jabalpur&t=&z=15&ie=UTF8&iwloc=&output=embed',
};

const StoreContext = createContext<StoreContextValue>({
  settings: defaultSettings,
  loadingSettings: true,
  quoteModal: { isOpen: false },
  openQuoteModal: () => {},
  closeQuoteModal: () => {},
  getWhatsAppUrl: () => '',
  getProductWhatsAppUrl: () => '',
});

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings | null>(defaultSettings);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [quoteModal, setQuoteModal] = useState<QuoteModalConfig>({ isOpen: false });

  useEffect(() => {
    fetchStoreSettings()
      .then((data) => {
        if (data && data.storeName) {
          setSettings(data);
          document.title = `${data.storeName} | 15+ Years Experience | Jabalpur`;
        }
      })
      .catch((err) => {
        console.warn('Could not load store settings, using defaults:', err);
      })
      .finally(() => {
        setLoadingSettings(false);
      });
  }, []);

  const openQuoteModal = (config?: Partial<QuoteModalConfig>) => {
    setQuoteModal({
      isOpen: true,
      product: config?.product || null,
      service: config?.service || null,
      type: config?.type || (config?.product ? 'product' : config?.service ? 'service' : 'quote'),
    });
  };

  const closeQuoteModal = () => {
    setQuoteModal({ isOpen: false });
  };

  const getCleanWhatsAppNumber = () => {
    const rawNumber = settings?.whatsapp || '9755672433';
    const digitsOnly = rawNumber.replace(/\D/g, '');
    if (digitsOnly.length === 10) return `91${digitsOnly}`;
    if (digitsOnly.startsWith('91')) return digitsOnly;
    return digitsOnly || '919755672433';
  };

  const getWhatsAppUrl = (customText?: string) => {
    const cleanNumber = getCleanWhatsAppNumber();
    const defaultText = `Hello Shiv Shakti Ply And Hardware, I would like to enquire about your products. Please share the details.`;
    const message = customText || defaultText;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  const getProductWhatsAppUrl = (item: { name?: string; category?: string; serialNo?: string } | string) => {
    const cleanNumber = getCleanWhatsAppNumber();
    let message = '';
    if (typeof item === 'string') {
      message = `Hello Shiv Shakti Ply And Hardware, I would like to enquire about ${item}. Please share the details.`;
    } else {
      const parts: string[] = [];
      if (item.category) parts.push(item.category);
      if (item.name) parts.push(item.name);
      const label = parts.length > 0 ? parts.join(' - ') : 'your products';
      message = `Hello Shiv Shakti Ply And Hardware, I would like to enquire about ${label}. Please share the details.`;
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        loadingSettings,
        quoteModal,
        openQuoteModal,
        closeQuoteModal,
        getWhatsAppUrl,
        getProductWhatsAppUrl,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
