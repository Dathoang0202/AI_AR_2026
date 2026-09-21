package com.vietphucstudio.service.ai;

import com.vietphucstudio.dto.AssistantRequest;
import com.vietphucstudio.dto.AssistantResponse;

public interface AiProvider {
    AssistantResponse generateResponse(AssistantRequest request);
}
