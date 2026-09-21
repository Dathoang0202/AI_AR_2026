import { fetchApi } from '@/lib/api-client';
import {
  ApiResponse,
  OutfitPreferenceRequest,
  OutfitRecommendationResponse,
  CulturalValidationRequest,
  CulturalValidationResponse,
  CreateOutfitRequest,
  OutfitResponse,
} from '@/types';

export async function recommendOutfit(
  payload: OutfitPreferenceRequest
): Promise<ApiResponse<OutfitRecommendationResponse[]>> {
  return fetchApi<OutfitRecommendationResponse[]>('/outfits/recommend', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function validateCulturalOutfit(
  payload: CulturalValidationRequest
): Promise<ApiResponse<CulturalValidationResponse>> {
  return fetchApi<CulturalValidationResponse>('/outfits/validate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function saveOutfit(
  payload: CreateOutfitRequest
): Promise<ApiResponse<OutfitResponse>> {
  return fetchApi<OutfitResponse>('/outfits', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getUserOutfits(): Promise<ApiResponse<OutfitResponse[]>> {
  return fetchApi<OutfitResponse[]>('/outfits', {
    method: 'GET',
  });
}

export async function getOutfitById(id: number): Promise<ApiResponse<OutfitResponse>> {
  return fetchApi<OutfitResponse>(`/outfits/${id}`, {
    method: 'GET',
  });
}

export async function updateOutfit(
  id: number,
  payload: CreateOutfitRequest
): Promise<ApiResponse<OutfitResponse>> {
  return fetchApi<OutfitResponse>(`/outfits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteOutfit(id: number): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/outfits/${id}`, {
    method: 'DELETE',
  });
}
