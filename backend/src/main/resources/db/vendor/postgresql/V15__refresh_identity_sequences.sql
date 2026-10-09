-- Also repair PostgreSQL databases imported from an earlier deployment.
SELECT setval(pg_get_serial_sequence('cultural_items', 'id'),
              (SELECT MAX(id) FROM cultural_items), true);
SELECT setval(pg_get_serial_sequence('rental_providers', 'id'),
              (SELECT MAX(id) FROM rental_providers), true);
