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
}

const defaultSettings: StoreSettings = {
  storeName: 'Shree Hardware & Plywood',
  tagline: 'Quality Materials. Reliable Hardware. Built for Every Project.',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'sales@shreehardwareply.com',
  address: 'Plot 42, Industrial Area, Katangi Road, Jabalpur, Madhya Pradesh 482002',
};

const StoreContext = createContext<StoreContextValue>({
  settings: defaultSettings,
  loadingSettings: true,
  quoteModal: { isOpen: false },
  openQuoteModal: () => {},
  closeQuoteModal: () => {},
  getWhatsAppUrl: () => '',
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
          document.title = `${data.storeName} | Quality Hardware & Plywood Materials`;
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

  const getWhatsAppUrl = (customText?: string) => {
    const rawNumber = settings?.whatsapp || '919876543210';
    const cleanNumber = rawNumber.replace(/\D/g, '');
    const defaultText = `Hello! I would like to enquire about your products and services at ${settings?.storeName || 'your store'}.`;
    const message = customText || defaultText;
    return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`;
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
