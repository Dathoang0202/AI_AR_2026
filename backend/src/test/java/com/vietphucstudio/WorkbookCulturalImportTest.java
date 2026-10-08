package com.vietphucstudio;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "vietphuc.ai.api-key=")
@AutoConfigureMockMvc
class WorkbookCulturalImportTest {
    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;

    @Test
    void apiPreservesAllMissingWorkbookRecordsAndTheirSources() throws Exception {
        JsonNode expected;
        try (var input = getClass().getResourceAsStream("/workbook-cultural-items.json")) {
            assertNotNull(input);
            expected = mapper.readTree(input);
        }
        var response = mvc.perform(get("/api/v1/cultural-items")).andExpect(status().isOk()).andReturn();
        JsonNode items = mapper.readTree(response.getResponse().getContentAsByteArray()).get("data");
        assertEquals(35, items.size());
        Map<String, JsonNode> byName = new HashMap<>();
        items.forEach(item -> assertNull(byName.put(item.get("name").asText(), item), "Duplicate catalog name"));
        assertEquals(23, expected.size());
        for (JsonNode row : expected) {
            JsonNode actual = byName.get(row.get("name").asText());
            assertNotNull(actual, row.get("name").asText());
            assertEquals(row.get("category"), actual.get("category"));
            assertEquals(row.get("Item_type"), actual.get("itemType"));
            assertEquals(row.get("usage_category"), actual.get("usageCategory"));
            assertEquals(row.get("region"), actual.get("region"));
            // Preserve the workbook fixture verbatim; the sourced V9 correction is intentional.
            if (row.get("name").asText().equals("Áo Trấn Thủ")) {
                assertEquals("Thế kỷ XX (từ năm 1946)", actual.get("historicalPeriod").asText());
                assertTrue(actual.get("sources").toString().contains("chu-va-nghia-ao-tran-thu-527498"));
            } else assertEquals(row.get("historical_period"), actual.get("historicalPeriod"));
            assertEquals(row.get("description"), actual.get("description"));
            assertEquals(row.get("significance"), actual.get("significance"));
            String name = row.get("name").asText();
            if (name.equals("Áo Yếm")) {
                assertEquals("/images/museum/ao-yem-color.jpg", actual.get("imageUrl").asText());
                assertTrue(actual.get("sources").toString().contains("Two_girls_sitting_near_the_tank"));
            } else if (name.equals("Hoàng Bào")) {
                assertEquals("/images/museum/hoang-bao-photo.jpg", actual.get("imageUrl").asText());
                assertTrue(actual.get("sources").toString().contains("Bao_Dai_imperial_robe_private_collection_EDAV"));
            } else if (name.equals("Mũ Cánh Chuồn (Phốc Đầu / Ô Sa)")) {
                assertEquals("/images/museum/canh-chuon-photo.jpg", actual.get("imageUrl").asText());
                assertTrue(actual.get("sources").toString().contains("Official_hat,_Nguyen_dynasty"));
            } else {
                String image = actual.path("imageUrl").asText();
                assertTrue(image.startsWith("/images/museum/"), name);
                assertTrue(java.nio.file.Files.isRegularFile(java.nio.file.Path.of("../frontend/public" + image)), image);
            }
            assertEquals(row.get("source_title"), actual.get("sources").get(0).get("title"));
            assertEquals(row.get("source_url"), actual.get("sources").get(0).get("url"));
            var detail = mvc.perform(get("/api/v1/cultural-items/" + actual.get("id").asLong()))
                    .andExpect(status().isOk()).andReturn();
            assertEquals(actual, mapper.readTree(detail.getResponse().getContentAsByteArray()).get("data"));
        }
        var garments = mvc.perform(get("/api/v1/cultural-items?category=GARMENT")).andReturn();
        var accessories = mvc.perform(get("/api/v1/cultural-items?category=ACCESSORY")).andReturn();
        assertEquals(22, mapper.readTree(garments.getResponse().getContentAsByteArray()).get("data").size());
        assertEquals(13, mapper.readTree(accessories.getResponse().getContentAsByteArray()).get("data").size());
        var rentals = mvc.perform(get("/api/v1/rentals")).andExpect(status().isOk()).andReturn();
        JsonNode providers = mapper.readTree(rentals.getResponse().getContentAsByteArray()).get("data");
        assertEquals(10, providers.size());
        JsonNode vStyle = null;
        for (JsonNode provider : providers) {
            assertFalse(provider.has("isDemoData"));
            if (provider.get("name").asText().equals("V'style - Việt Cổ Phục Cách Tân")) vStyle = provider;
        }
        assertNotNull(vStyle);
        assertEquals("300.000 - 600.000 VNĐ", vStyle.get("items").get(0).get("priceDisplay").asText());
        assertEquals(3, providers.findValuesAsText("city").stream().distinct().count());
    }

    @Test
    void upgradePreservesExistingIdsPhotosAndCustomRecordsAndAvoidsAliases() throws SQLException {
        String url = "jdbc:h2:mem:workbook_" + UUID.randomUUID() + ";DB_CLOSE_DELAY=-1;MODE=PostgreSQL";
        Flyway.configure().dataSource(url, "sa", "").target("7").load().migrate();
        Map<Long, String> before;
        try (Connection connection = DriverManager.getConnection(url, "sa", ""); var statement = connection.createStatement()) {
            statement.executeUpdate("INSERT INTO cultural_items (id, name, category, description) VALUES "
                    + "(90, 'Áo Viên Lĩnh', 'GARMENT', 'Existing curated description'), "
                    + "(91, 'Custom collection', 'ACCESSORY', 'Keep this record')");
            statement.executeUpdate("INSERT INTO cultural_sources (cultural_item_id, title, url) "
                    + "VALUES (90, 'Custom source', 'https://example.org/custom')");
            before = snapshot(connection);
        }
        Flyway latest = Flyway.configure().dataSource(url, "sa", "").load();
        assertEquals(7, latest.migrate().migrationsExecuted);
        latest.validate();
        try (Connection connection = DriverManager.getConnection(url, "sa", ""); var statement = connection.createStatement()) {
            Map<Long, String> after = snapshot(connection);
            before.forEach((id, value) -> assertEquals(value, after.get(id)));
            assertEquals(36, after.size());
            try (var rows = statement.executeQuery("SELECT COUNT(*) FROM cultural_items WHERE name LIKE 'Áo Viên Lĩnh%'")) {
                assertTrue(rows.next()); assertEquals(1, rows.getInt(1));
            }
            try (var rows = statement.executeQuery("SELECT COUNT(*) FROM cultural_sources WHERE cultural_item_id = 90 AND title = 'Custom source'")) {
                assertTrue(rows.next()); assertEquals(1, rows.getInt(1));
            }
            try (var rows = statement.executeQuery("SELECT COUNT(*) FROM cultural_items WHERE id > 91")) {
                assertTrue(rows.next()); assertEquals(22, rows.getInt(1));
            }
        }
        assertEquals(0, latest.migrate().migrationsExecuted);
    }

    @Test
    void v9UpgradeCorrectsImportedPeriodButPreservesCustomMetadata() throws SQLException {
        for (boolean custom : new boolean[]{false, true}) {
            String url = "jdbc:h2:mem:period_" + UUID.randomUUID() + ";DB_CLOSE_DELAY=-1;MODE=PostgreSQL";
            Flyway.configure().dataSource(url, "sa", "").target("8").load().migrate();
            try (var connection = DriverManager.getConnection(url, "sa", ""); var statement = connection.createStatement()) {
                if (custom) statement.executeUpdate("UPDATE cultural_items SET historical_period = 'Curated period', image_url = '/custom.jpg' WHERE name = 'Áo Trấn Thủ'");
                Flyway latest = Flyway.configure().dataSource(url, "sa", "").load();
                assertEquals(6, latest.migrate().migrationsExecuted);
                latest.validate();
                try (var rows = statement.executeQuery("SELECT historical_period, image_url FROM cultural_items WHERE name = 'Áo Trấn Thủ'")) {
                    assertTrue(rows.next());
                    assertEquals(custom ? "Curated period" : "Thế kỷ XX (từ năm 1946)", rows.getString(1));
                    if (custom) assertEquals("/custom.jpg", rows.getString(2));
                }
                assertEquals(0, latest.migrate().migrationsExecuted);
            }
        }
    }

    private Map<Long, String> snapshot(Connection connection) throws SQLException {
        Map<Long, String> snapshot = new HashMap<>();
        try (var statement = connection.createStatement(); var rows = statement.executeQuery(
                "SELECT id, name, description, significance, image_url FROM cultural_items")) {
            while (rows.next()) snapshot.put(rows.getLong("id"), rows.getString("name") + "|" + rows.getString("description")
                    + "|" + rows.getString("significance") + "|" + rows.getString("image_url"));
        }
        return snapshot;
    }
}
