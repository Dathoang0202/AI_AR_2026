import { fetchApi } from '@/lib/api-client';
import { ApiResponse, AuthResponse } from '@/types';

export async function registerUser(payload: {
  username: string;
  email: string;
  password: string;
  fullName: string;
}): Promise<ApiResponse<AuthResponse>> {
  return fetchApi<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: {
  usernameOrEmail: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  return fetchApi<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
