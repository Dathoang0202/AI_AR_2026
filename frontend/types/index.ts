export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface OutfitPreferenceRequest {
  occasion: string;
  region: string;
  preferredColors?: string[];
  style?: string;
  rentalIntent?: string;
}

export interface OutfitRecommendationResponse {
  name: string;
  primaryGarment: string;
  garments: string[];
  accessories: string[];
  colors: string[];
  culturalContext: string;
  historicalPeriod: string;
  stylingAdvice: string;
}

export interface CulturalValidationRequest {
  garment: string;
  color?: string;
  occasion?: string;
  region?: string;
  accessories?: string[];
}

export interface CulturalSource {
  title: string;
  publisher: string;
  url: string;
}

export interface CulturalValidationResponse {
  status: 'COMPLIANT' | 'CAUTION' | 'NON_COMPLIANT';
  issues: string[];
  notes: string[];
  sources: CulturalSource[];
}

export interface CreateOutfitRequest {
  name: string;
  occasion: string;
  region: string;
  style: string;
  primaryGarment: string;
  colors?: string[];
  accessories?: string[];
  culturalNotes?: string;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
}

export interface OutfitResponse {
  id: number;
  userId: number;
  name: string;
  occasion: string;
  region: string;
  style: string;
  primaryGarment: string;
  colors: string[];
  accessories: string[];
  culturalNotes?: string;
  status: string;
  visibility: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
  createdAt: string;
  updatedAt: string;
}
