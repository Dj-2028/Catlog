export interface ProductImage {
  url: string;
  public_id: string;
}

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  serialNo: string;
  brand?: string;
  category: string;
  price: number;
  availability: 'in_stock' | 'limited' | 'on_order' | 'out_of_stock';
  description?: string;
  specifications?: Record<string, string>;
  images: ProductImage[];
  isPublished: boolean;
  isFeatured: boolean;
  dateAdded?: string;
}

export interface Category {
  _id: string;
  name: string;
  productCount?: number;
  coverImage?: string | null;
  dateAdded?: string;
}

export interface Service {
  _id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  icon?: string;
  image?: {
    url?: string;
    public_id?: string;
  };
  highlights?: string[];
  ctaLabel?: string;
  isActive: boolean;
  order?: number;
  createdAt?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline?: string;
  about?: string;
  established?: string;
  phone?: string;
  alternatePhone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  gstin?: string;
  businessHours?: string[];
  mapEmbedUrl?: string;
  mapUrl?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface ProductFiltersData {
  brands: { name: string; count: number }[];
  availability: { value: string; count: number }[];
  categories: { name: string; count: number }[];
}

export interface Pagination {
  page: number;
  totalPages: number;
  totalCount: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface EnquiryPayload {
  type?: 'product' | 'service' | 'quote' | 'general';
  name: string;
  phone: string;
  email?: string;
  product?: string;
  productName?: string;
  service?: string;
  serviceTitle?: string;
  quantity?: string;
  message?: string;
  sourcePage?: string;
}
