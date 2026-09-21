package com.vietphucstudio.controller;

import com.vietphucstudio.dto.ApiResponse;
import com.vietphucstudio.dto.AssistantRequest;
import com.vietphucstudio.dto.AssistantResponse;
import com.vietphucstudio.service.AssistantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/assistant")
public class AssistantController {

    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AssistantResponse>> chat(@Valid @RequestBody AssistantRequest request) {
        AssistantResponse response = assistantService.processChat(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
