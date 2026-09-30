package com.vietphucstudio;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CulturalMigrationTest {

    @Test
    void freshDatabaseIncludesMuseumImagesAndSources() throws SQLException {
        String url = databaseUrl();
        Flyway flyway = flyway(url);
        assertEquals(6, flyway.migrate().migrationsExecuted);
        flyway.validate();

        try (Connection connection = DriverManager.getConnection(url, "sa", "")) {
            assertEquals(6, count(connection, "SELECT COUNT(*) FROM cultural_items"));
            assertEquals(6, count(connection, "SELECT COUNT(*) FROM cultural_items WHERE image_url IS NOT NULL"));
            assertEquals(6, count(connection, "SELECT COUNT(*) FROM cultural_sources"));
            assertEquals(0, count(connection, "SELECT COUNT(*) FROM cultural_items item WHERE NOT EXISTS "
                    + "(SELECT 1 FROM cultural_sources source WHERE source.cultural_item_id = item.id)"));
        }
        assertEquals(0, flyway.migrate().migrationsExecuted);
    }

    @Test
    void upgradeFromV4PreservesExistingRecordsAndAdditionalSources() throws SQLException {
        String url = databaseUrl();
        Flyway.configure().dataSource(url, "sa", "").target("4").load().migrate();

        try (Connection connection = DriverManager.getConnection(url, "sa", "");
             var statement = connection.createStatement()) {
            statement.executeUpdate("INSERT INTO cultural_items (id, name, category, description) "
                    + "VALUES (5, 'Existing collection record', 'GARMENT', 'Preserve this description')");
            statement.executeUpdate("INSERT INTO cultural_sources (cultural_item_id, title, url) "
                    + "VALUES (1, 'Additional reference', 'https://example.com/reference')");
        }

        Flyway flyway = flyway(url);
        assertEquals(2, flyway.migrate().migrationsExecuted);
        flyway.validate();

        try (Connection connection = DriverManager.getConnection(url, "sa", "")) {
            assertEquals(7, count(connection, "SELECT COUNT(*) FROM cultural_items"));
            assertEquals(1, count(connection, "SELECT COUNT(*) FROM cultural_items WHERE id = 5 "
                    + "AND description = 'Preserve this description' AND image_url IS NULL"));
            assertEquals(1, count(connection, "SELECT COUNT(*) FROM cultural_sources "
                    + "WHERE title = 'Additional reference' AND url = 'https://example.com/reference'"));
            assertEquals(2, count(connection, "SELECT COUNT(*) FROM cultural_items WHERE id > 5 AND image_url IS NOT NULL"));
            assertEquals(7, count(connection, "SELECT COUNT(*) FROM cultural_sources"));
        }
    }

    @Test
    void upgradeKeepsOldOutfitsWithoutInventingTheirMannequinChoice() throws SQLException {
        String url = databaseUrl();
        Flyway.configure().dataSource(url, "sa", "").target("5").load().migrate();
        try (Connection connection = DriverManager.getConnection(url, "sa", ""); var statement = connection.createStatement()) {
            statement.executeUpdate("INSERT INTO users (id, username, email, password, full_name) VALUES (99, 'legacy', 'legacy@example.test', 'test', 'Legacy user')");
            statement.executeUpdate("INSERT INTO outfits (id, user_id, name, occasion, region, style, primary_garment, colors_json, accessories_json) "
                    + "VALUES (99, 99, 'Saved outfit', 'Tet', 'Hue', 'Classic', 'Ao Tac', '[\"#123456\"]', '[\"Fan\"]')");
        }
        Flyway latest = flyway(url);
        latest.migrate();
        latest.validate();
        try (Connection connection = DriverManager.getConnection(url, "sa", ""); var statement = connection.createStatement()) {
            assertEquals(1, count(connection, "SELECT COUNT(*) FROM outfits WHERE id = 99 AND gender IS NULL "
                    + "AND name = 'Saved outfit' AND colors_json = '[\"#123456\"]' AND accessories_json = '[\"Fan\"]'"));
            statement.executeUpdate("UPDATE outfits SET gender = 'male' WHERE id = 99");
            assertEquals(1, count(connection, "SELECT COUNT(*) FROM outfits WHERE id = 99 AND gender = 'male'"));
        }
    }

    private static String databaseUrl() {
        return "jdbc:h2:mem:museum_" + UUID.randomUUID() + ";DB_CLOSE_DELAY=-1;MODE=PostgreSQL";
    }

    private static Flyway flyway(String url) {
        return Flyway.configure().dataSource(url, "sa", "").load();
    }

    private static int count(Connection connection, String sql) throws SQLException {
        try (var statement = connection.createStatement(); ResultSet rows = statement.executeQuery(sql)) {
            assertTrue(rows.next());
            return rows.getInt(1);
        }
    }
}
