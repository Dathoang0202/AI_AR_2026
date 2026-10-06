import { fetchApi } from '@/lib/api-client';
import { ApiResponse, CulturalSource } from '@/types';

export interface AssistantRequest {
  message: string;
  conversationId?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export interface AssistantResponse {
  answer: string;
  conversationId: string;
  sources: CulturalSource[];
  suggestedActions: string[];
}

export async function sendAssistantChat(payload: AssistantRequest, signal?: AbortSignal): Promise<ApiResponse<AssistantResponse>> {
  return fetchApi<AssistantResponse>('/assistant/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
    signal,
  });
}
