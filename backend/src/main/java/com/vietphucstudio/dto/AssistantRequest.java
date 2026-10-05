package com.vietphucstudio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class AssistantRequest {

    @NotBlank(message = "Message cannot be empty")
    @Size(max = 2000)
    private String message;

    private String conversationId;
    private List<ChatTurn> history;

    public AssistantRequest() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public List<ChatTurn> getHistory() { return history; }
    public void setHistory(List<ChatTurn> history) { this.history = history; }

    public static class ChatTurn {
        private String role;
        private String content;

        public ChatTurn() {}
        public ChatTurn(String role, String content) {
            this.role = role;
            this.content = content;
        }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}
