package com.vietphucstudio.service;

import com.vietphucstudio.dto.AssistantRequest;
import com.vietphucstudio.dto.AssistantResponse;
import com.vietphucstudio.service.ai.AiProvider;
import org.springframework.stereotype.Service;

@Service
public class AssistantService {

    private final AiProvider aiProvider;

    public AssistantService(AiProvider aiProvider) {
        this.aiProvider = aiProvider;
    }

    public AssistantResponse processChat(AssistantRequest request) {
        return aiProvider.generateResponse(request);
    }
}
