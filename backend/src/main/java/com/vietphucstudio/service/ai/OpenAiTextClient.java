package com.vietphucstudio.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vietphucstudio.dto.AssistantRequest.ChatTurn;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class OpenAiTextClient {
    private static final Logger log = LoggerFactory.getLogger(OpenAiTextClient.class);
    private static final URI RESPONSES_URL = URI.create("https://api.openai.com/v1/responses");

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String apiKey;
    private final String model;

    public OpenAiTextClient(ObjectMapper objectMapper,
                            @Value("${vietphuc.ai.api-key:}") String apiKey,
                            @Value("${vietphuc.ai.model:gpt-5.4-mini}") String model) {
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    }

    public Optional<String> generate(String instructions, List<ChatTurn> history, String question) {
        if (apiKey == null || apiKey.isBlank()) return Optional.empty();

        List<Map<String, String>> input = new ArrayList<>();
        for (ChatTurn turn : history) {
            input.add(Map.of("role", turn.getRole(), "content", turn.getContent()));
        }
        input.add(Map.of("role", "user", "content", question));

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", model);
        payload.put("instructions", instructions);
        payload.put("input", input);
        payload.put("max_output_tokens", 700);
        payload.put("store", false);

        try {
            HttpRequest request = HttpRequest.newBuilder(RESPONSES_URL)
                    .timeout(Duration.ofSeconds(25))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("AI service returned HTTP {}", response.statusCode());
                return Optional.empty();
            }
            JsonNode body = objectMapper.readTree(response.body());
            if (!"completed".equals(body.path("status").asText())) return Optional.empty();
            StringBuilder answer = new StringBuilder();
            for (JsonNode item : body.path("output")) {
                if (!"message".equals(item.path("type").asText())) continue;
                for (JsonNode content : item.path("content")) {
                    if ("output_text".equals(content.path("type").asText())) {
                        if (!answer.isEmpty()) answer.append("\n");
                        answer.append(content.path("text").asText());
                    }
                }
            }
            return answer.toString().isBlank() ? Optional.empty() : Optional.of(answer.toString().trim());
        } catch (IOException e) {
            log.warn("AI service unavailable: {}", e.getClass().getSimpleName());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return Optional.empty();
    }
}
