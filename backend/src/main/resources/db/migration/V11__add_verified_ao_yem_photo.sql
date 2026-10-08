UPDATE cultural_items
SET image_url = '/images/museum/ao-yem-archival.jpg'
WHERE name = 'Áo Yếm' AND image_url IS NULL;

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT item.id,
    'Ảnh tư liệu phụ nữ Việt Nam mặc áo yếm tại Hà Nội, Bắc Kỳ',
    'Wikimedia Commons (tác giả gốc chưa xác định; ảnh thuộc phạm vi công cộng)',
    'https://commons.wikimedia.org/wiki/File:TONKIN_-_Hanoi_-_Servante_Indigene.jpg'
FROM cultural_items item
WHERE item.name = 'Áo Yếm'
  AND NOT EXISTS (
      SELECT 1 FROM cultural_sources source
      WHERE source.cultural_item_id = item.id
        AND source.url = 'https://commons.wikimedia.org/wiki/File:TONKIN_-_Hanoi_-_Servante_Indigene.jpg'
  );
