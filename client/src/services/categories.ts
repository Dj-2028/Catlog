import { request } from './api';
import type { Category } from '../types';

export async function fetchCategories(withCounts: boolean = true): Promise<Category[]> {
  const qs = withCounts ? '?withCounts=1' : '';
  return request<Category[]>(`/categories${qs}`);
}
