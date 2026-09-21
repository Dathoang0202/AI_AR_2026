package com.vietphucstudio.dto;

import jakarta.validation.constraints.NotBlank;

public class AssistantRequest {

    @NotBlank(message = "Message cannot be empty")
    private String message;

    private String conversationId;

    public AssistantRequest() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }
}
