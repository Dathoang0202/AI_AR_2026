import { fetchApi } from '@/lib/api-client';
import { ApiResponse } from '@/types';

export interface RentalItemResponse {
  id: number;
  name: string;
  category: string;
  pricePerDay: number;
  availabilityStatus: string;
}

export interface RentalProviderResponse {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  isDemoData: boolean;
  items: RentalItemResponse[];
}

export async function getRentalProviders(city?: string): Promise<ApiResponse<RentalProviderResponse[]>> {
  const query = city ? `?city=${encodeURIComponent(city)}` : '';
  return fetchApi<RentalProviderResponse[]>(`/rentals${query}`, { method: 'GET' });
}

export async function getRentalProviderById(id: number): Promise<ApiResponse<RentalProviderResponse>> {
  return fetchApi<RentalProviderResponse>(`/rentals/${id}`, { method: 'GET' });
}
