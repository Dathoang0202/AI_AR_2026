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
        assertEquals(5, flyway.migrate().migrationsExecuted);
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
        assertEquals(1, flyway.migrate().migrationsExecuted);
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
