import { request } from './api';
import type { Service } from '../types';

export async function fetchServices(): Promise<Service[]> {
  return request<Service[]>('/services');
}

export async function fetchServiceById(idOrSlug: string): Promise<Service> {
  return request<Service>(`/services/${idOrSlug}`);
}
