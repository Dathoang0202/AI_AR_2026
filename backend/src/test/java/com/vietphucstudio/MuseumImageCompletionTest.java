package com.vietphucstudio;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import java.sql.DriverManager;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class MuseumImageCompletionTest {
    @Test
    void upgradeFillsMissingImagesAndKeepsCustomPhotosAndSources() throws Exception {
        String url = "jdbc:h2:mem:images_" + UUID.randomUUID() + ";DB_CLOSE_DELAY=-1;MODE=PostgreSQL";
        Flyway.configure().dataSource(url, "sa", "").target("13").load().migrate();
        try (var connection = DriverManager.getConnection(url, "sa", ""); var sql = connection.createStatement()) {
            sql.executeUpdate("UPDATE cultural_items SET image_url = '/custom-photo.jpg' WHERE name = 'Áo Đối Khâm'");
            sql.executeUpdate("UPDATE cultural_items SET image_url = '  ' WHERE name = 'Guốc Mộc'");
            Flyway latest = Flyway.configure().dataSource(url, "sa", "").load();
            assertEquals(1, latest.migrate().migrationsExecuted);
            latest.validate();
            try (var rows = sql.executeQuery("SELECT COUNT(*) FROM cultural_items WHERE image_url IS NULL OR TRIM(image_url) = ''")) {
                assertTrue(rows.next()); assertEquals(0, rows.getInt(1));
            }
            try (var rows = sql.executeQuery("SELECT image_url FROM cultural_items WHERE name = 'Áo Đối Khâm'")) {
                assertTrue(rows.next()); assertEquals("/custom-photo.jpg", rows.getString(1));
            }
            try (var rows = sql.executeQuery("SELECT COUNT(*) FROM cultural_items WHERE image_url LIKE '%.svg'")) {
                assertTrue(rows.next()); assertEquals(7, rows.getInt(1));
            }
            assertEquals(0, latest.migrate().migrationsExecuted);
        }
    }
}
