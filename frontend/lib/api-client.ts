import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vietphuc_token');
}

export function setStoredToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vietphuc_token', token);
  }
}

export function removeStoredToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vietphuc_token');
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json() as ApiResponse<T> & { error?: { code: string; message: string } | string };

    if (!res.ok) {
      const message = typeof data.error === 'object' && data.error?.message
        ? data.error.message
        : `Máy chủ từ chối yêu cầu (${res.status}).`;
      return {
        success: false,
        error: {
          code: `HTTP_${res.status}`,
          message,
        },
      };
    }

    return data as ApiResponse<T>;
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err.message || 'Không thể kết nối đến máy chủ backend (port 8080)',
      },
    };
  }
}
