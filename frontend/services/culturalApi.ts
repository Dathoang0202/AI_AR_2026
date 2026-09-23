import { fetchApi } from '@/lib/api-client';
import { ApiResponse } from '@/types';

export interface CulturalSourceResponse {
  id: number;
  title: string;
  publisher?: string;
  url?: string;
}

export interface CulturalItemResponse {
  id: number;
  name: string;
  category: string;
  region?: string;
  historicalPeriod?: string;
  description: string;
  significance?: string;
  imageUrl?: string;
  sources: CulturalSourceResponse[];
}

export async function getCulturalItems(category?: string, signal?: AbortSignal): Promise<ApiResponse<CulturalItemResponse[]>> {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return fetchApi<CulturalItemResponse[]>(`/cultural-items${query}`, { method: 'GET', signal });
}

export async function getCulturalItemById(id: number, signal?: AbortSignal): Promise<ApiResponse<CulturalItemResponse>> {
  return fetchApi<CulturalItemResponse>(`/cultural-items/${id}`, { method: 'GET', signal });
}

export async function searchCulturalItems(query: string): Promise<ApiResponse<CulturalItemResponse[]>> {
  return fetchApi<CulturalItemResponse[]>(`/cultural-items/search?query=${encodeURIComponent(query)}`, { method: 'GET' });
}
