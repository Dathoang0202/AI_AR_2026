UPDATE cultural_items
SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/9/90/Bao_Dai_imperial_robe_private_collection_EDAV.jpg'
WHERE name = 'Hoàng Bào' AND image_url IS NULL;

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Cận cảnh long bào của vua Bảo Đại trong bộ sưu tập tư nhân (ảnh chi tiết)',
    'Marie-Lan Nguyen / Wikimedia Commons (Public domain)',
    'https://commons.wikimedia.org/wiki/File:Bao_Dai_imperial_robe_private_collection_EDAV.jpg'
FROM cultural_items item
WHERE item.name = 'Hoàng Bào'
  AND NOT EXISTS (
      SELECT 1 FROM cultural_sources source
      WHERE source.cultural_item_id = item.id
        AND source.url = 'https://commons.wikimedia.org/wiki/File:Bao_Dai_imperial_robe_private_collection_EDAV.jpg'
  );

UPDATE cultural_items
SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/2/20/Official_hat%2C_Nguyen_dynasty%2C_19th_to_early_20th_century%2C_gilded_metal_-_National_Museum_of_Vietnamese_History_-_Hanoi%2C_Vietnam_-_DSC05595.JPG'
WHERE name = 'Mũ Cánh Chuồn (Phốc Đầu / Ô Sa)' AND image_url IS NULL;

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Mũ quan triều Nguyễn bằng kim loại thếp vàng, thế kỷ XIX–đầu XX',
    'Daderot / Wikimedia Commons (CC0 1.0)',
    'https://commons.wikimedia.org/wiki/File:Official_hat,_Nguyen_dynasty,_19th_to_early_20th_century,_gilded_metal_-_National_Museum_of_Vietnamese_History_-_Hanoi,_Vietnam_-_DSC05595.JPG'
FROM cultural_items item
WHERE item.name = 'Mũ Cánh Chuồn (Phốc Đầu / Ô Sa)'
  AND NOT EXISTS (
      SELECT 1 FROM cultural_sources source
      WHERE source.cultural_item_id = item.id
        AND source.url = 'https://commons.wikimedia.org/wiki/File:Official_hat,_Nguyen_dynasty,_19th_to_early_20th_century,_gilded_metal_-_National_Museum_of_Vietnamese_History_-_Hanoi,_Vietnam_-_DSC05595.JPG'
  );
