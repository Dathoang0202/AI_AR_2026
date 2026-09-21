-- V4__add_lookbook_visibility.sql: Add visibility column to outfits table

ALTER TABLE outfits ADD COLUMN visibility VARCHAR(20) DEFAULT 'PRIVATE';
