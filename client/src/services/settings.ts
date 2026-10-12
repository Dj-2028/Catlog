import { request } from './api';
import type { StoreSettings } from '../types';

export async function fetchStoreSettings(): Promise<StoreSettings> {
  return request<StoreSettings>('/settings');
}
