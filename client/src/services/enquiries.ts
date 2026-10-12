import { request } from './api';
import type { EnquiryPayload } from '../types';

export async function submitEnquiry(payload: EnquiryPayload): Promise<{ message: string; id?: string }> {
  return request<{ message: string; id?: string }>('/enquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
