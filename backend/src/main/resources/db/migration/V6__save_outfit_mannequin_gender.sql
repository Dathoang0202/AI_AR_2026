-- Older outfits retain NULL: their mannequin choice was not recorded.
ALTER TABLE outfits ADD COLUMN gender VARCHAR(6);
