package com.vietphucstudio.service.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vietphucstudio.dto.AssistantRequest.ChatTurn;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

class GeminiTextClientTest {
    private final ObjectMapper mapper = new ObjectMapper();
    private final AtomicInteger calls = new AtomicInteger();
    private HttpServer server;
    private String requestBody;
    private String requestKey;
    private String requestQuery;
    private String reply;
    private int status;

    @BeforeEach
    void startServer() throws Exception {
        status = 200;
        reply = """
                {"candidates":[{"finishReason":"STOP","content":{"parts":[
                {"thought":true,"text":"Internal reasoning"},
                {"text":"Áo Nhật Bình là lễ phục."},{"text":"Bạn muốn biết thêm gì?"}]}}]}
                """;
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/generate", exchange -> {
            calls.incrementAndGet();
            requestBody = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            requestKey = exchange.getRequestHeaders().getFirst("x-goog-api-key");
            requestQuery = exchange.getRequestURI().getQuery();
            byte[] bytes = reply.getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(status, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.close();
        });
        server.start();
    }

    @AfterEach
    void stopServer() { server.stop(0); }

    private GeminiTextClient client(String key) {
        return new GeminiTextClient(mapper, key, HttpClient.newHttpClient(),
                URI.create("http://127.0.0.1:" + server.getAddress().getPort() + "/generate"));
    }

    @Test
    void sendsVietnameseContextAndHistoryAndReadsOnlyVisibleAnswer() throws Exception {
        var result = client("test-key").generate("Chỉ dùng tư liệu xác thực",
                List.of(new ChatTurn("user", "Áo Nhật Bình?"), new ChatTurn("assistant", "Một loại lễ phục.")),
                "Nó thuộc thời kỳ nào?");
        assertEquals("Áo Nhật Bình là lễ phục.\nBạn muốn biết thêm gì?", result.orElseThrow());
        var body = mapper.readTree(requestBody);
        assertEquals("Chỉ dùng tư liệu xác thực", body.at("/systemInstruction/parts/0/text").asText());
        assertEquals("user", body.at("/contents/0/role").asText());
        assertEquals("model", body.at("/contents/1/role").asText());
        assertEquals("Nó thuộc thời kỳ nào?", body.at("/contents/2/parts/0/text").asText());
        assertEquals("test-key", requestKey);
        assertNull(requestQuery);
        assertFalse(requestBody.contains("test-key"));
    }

    @Test
    void missingKeyDoesNotSendARequest() {
        assertTrue(client(" ").generate("instructions", List.of(), "question").isEmpty());
        assertEquals(0, calls.get());
    }

    @Test
    void authenticationQuotaAndServerFailuresAllowKnowledgeFallback() {
        for (int failure : new int[]{400, 401, 403, 429, 503}) {
            status = failure;
            reply = "{\"error\":{\"message\":\"sensitive upstream details\"}}";
            assertTrue(client("test-key").generate("instructions", List.of(), "question").isEmpty());
        }
    }

    @Test
    void blockedTruncatedEmptyAndMalformedRepliesAllowKnowledgeFallback() {
        for (String invalid : List.of("not json", "null", "{}",
                "{\"promptFeedback\":{\"blockReason\":\"SAFETY\"}}",
                "{\"candidates\":[{\"finishReason\":\"MAX_TOKENS\",\"content\":{\"parts\":[{\"text\":\"partial\"}]}}]}",
                "{\"candidates\":[{\"finishReason\":\"STOP\",\"content\":{\"parts\":[{\"thought\":true,\"text\":\"private\"}]}}]}")) {
            reply = invalid;
            assertTrue(client("test-key").generate("instructions", List.of(), "question").isEmpty());
        }
    }

    @Test
    void modelCannotRedirectCredentials() {
        assertThrows(IllegalArgumentException.class,
                () -> new GeminiTextClient(mapper, "test-key", "https://example.org"));
    }
}
