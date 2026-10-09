-- Explicit IDs in earlier seed migrations do not advance PostgreSQL identity sequences.
-- V10 inserts rental providers without IDs, so adjust the sequences first.
SELECT setval(pg_get_serial_sequence('cultural_items', 'id'),
              (SELECT MAX(id) FROM cultural_items), true);
SELECT setval(pg_get_serial_sequence('rental_providers', 'id'),
              (SELECT MAX(id) FROM rental_providers), true);
