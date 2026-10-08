package com.vietphucstudio.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vietphucstudio.dto.AssistantRequest.ChatTurn;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class GeminiTextClient {
    private static final Logger log = LoggerFactory.getLogger(GeminiTextClient.class);
    private final ObjectMapper mapper;
    private final HttpClient client;
    private final String apiKey;
    private final URI endpoint;

    @Autowired
    public GeminiTextClient(ObjectMapper mapper,
                            @Value("${vietphuc.ai.api-key:}") String apiKey,
                            @Value("${vietphuc.ai.model:gemini-3.1-flash-lite}") String model) {
        this(mapper, apiKey, HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build(),
                endpointFor(model));
    }

    // Package-private transport injection keeps production credentials on Google's endpoint.
    GeminiTextClient(ObjectMapper mapper, String apiKey, HttpClient client, URI endpoint) {
        this.mapper = mapper;
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.client = client;
        this.endpoint = endpoint;
    }

    private static URI endpointFor(String model) {
        if (model == null || !model.matches("[a-zA-Z0-9._-]+")) {
            throw new IllegalArgumentException("GEMINI_MODEL must be a model ID, not a URL");
        }
        return URI.create("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent");
    }

    public Optional<String> generate(String instructions, List<ChatTurn> history, String question) {
        if (apiKey.isBlank()) return Optional.empty();
        List<Map<String, Object>> contents = new ArrayList<>();
        for (ChatTurn turn : history) {
            contents.add(content("assistant".equals(turn.getRole()) ? "model" : "user", turn.getContent()));
        }
        contents.add(content("user", question));
        Map<String, Object> payload = Map.of(
                "systemInstruction", Map.of("parts", List.of(Map.of("text", instructions))),
                "contents", contents,
                "generationConfig", Map.of("maxOutputTokens", 4096));
        try {
            HttpRequest request = HttpRequest.newBuilder(endpoint)
                    .timeout(Duration.ofSeconds(90))
                    .header("x-goog-api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(payload)))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("Gemini returned HTTP {}; using museum knowledge fallback", response.statusCode());
                return Optional.empty();
            }
            JsonNode body = mapper.readTree(response.body());
            if (body == null || body.path("promptFeedback").hasNonNull("blockReason")) return Optional.empty();
            JsonNode candidate = body.path("candidates").path(0);
            // Do not display blocked or truncated completions as complete answers.
            if (!"STOP".equals(candidate.path("finishReason").asText())) return Optional.empty();
            StringBuilder answer = new StringBuilder();
            for (JsonNode part : candidate.path("content").path("parts")) {
                if (part.path("thought").asBoolean(false) || !part.path("text").isTextual()) continue;
                if (!answer.isEmpty()) answer.append("\n");
                answer.append(part.path("text").asText());
            }
            return answer.toString().isBlank() ? Optional.empty() : Optional.of(answer.toString().trim());
        } catch (IOException e) {
            // Never log request headers, keys, prompts or the provider's raw error body.
            log.warn("Gemini unavailable: {}; using museum knowledge fallback", e.getClass().getSimpleName());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return Optional.empty();
    }

    private Map<String, Object> content(String role, String text) {
        return Map.of("role", role, "parts", List.of(Map.of("text", text)));
    }
}
