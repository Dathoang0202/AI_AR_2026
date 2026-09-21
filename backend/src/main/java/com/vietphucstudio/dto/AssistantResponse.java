package com.vietphucstudio.dto;

import com.vietphucstudio.dto.CulturalValidationResponse.CulturalSourceDto;
import java.util.List;

public class AssistantResponse {

    private String answer;
    private String conversationId;
    private List<CulturalSourceDto> sources;
    private List<String> suggestedActions;

    public AssistantResponse() {}

    public AssistantResponse(String answer, String conversationId, List<CulturalSourceDto> sources, List<String> suggestedActions) {
        this.answer = answer;
        this.conversationId = conversationId;
        this.sources = sources;
        this.suggestedActions = suggestedActions;
    }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public List<CulturalSourceDto> getSources() { return sources; }
    public void setSources(List<CulturalSourceDto> sources) { this.sources = sources; }

    public List<String> getSuggestedActions() { return suggestedActions; }
    public void setSuggestedActions(List<String> suggestedActions) { this.suggestedActions = suggestedActions; }
}
