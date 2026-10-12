import { request } from './api';
import type { Product, ProductsResponse, ProductFiltersData } from '../types';

export interface ProductQueryParams {
  q?: string;
  category?: string;
  brand?: string;
  availability?: string;
  featured?: boolean | string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name' | 'name_desc';
}

export async function fetchProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.category && params.category !== 'All') query.set('category', params.category);
  if (params.brand && params.brand !== 'All') query.set('brand', params.brand);
  if (params.availability && params.availability !== 'All') query.set('availability', params.availability);
  if (params.featured) query.set('featured', 'true');
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.sort) query.set('sort', params.sort);

  const qs = query.toString();
  return request<ProductsResponse>(`/products${qs ? `?${qs}` : ''}`);
}

export async function fetchProductById(idOrSlug: string): Promise<Product> {
  return request<Product>(`/products/${idOrSlug}`);
}

export async function fetchProductFilters(): Promise<ProductFiltersData> {
  return request<ProductFiltersData>('/products/filters');
}
