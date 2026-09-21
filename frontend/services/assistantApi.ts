import { fetchApi } from '@/lib/api-client';
import { ApiResponse, CulturalSource } from '@/types';

export interface AssistantRequest {
  message: string;
  conversationId?: string;
}

export interface AssistantResponse {
  answer: string;
  conversationId: string;
  sources: CulturalSource[];
  suggestedActions: string[];
}

export async function sendAssistantChat(payload: AssistantRequest): Promise<ApiResponse<AssistantResponse>> {
  return fetchApi<AssistantResponse>('/assistant/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
