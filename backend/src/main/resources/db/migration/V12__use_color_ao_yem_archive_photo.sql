UPDATE cultural_items
SET image_url = '/images/museum/ao-yem-color.jpg'
WHERE name = 'Áo Yếm'
  AND image_url = '/images/museum/ao-yem-archival.jpg';

UPDATE cultural_sources
SET title = 'Ảnh màu phụ nữ Hà Nội mặc áo yếm, Léon Busy, thập niên 1910',
    publisher = 'Léon Busy / Musée départemental Albert-Kahn, qua Wikimedia Commons',
    url = 'https://commons.wikimedia.org/wiki/File:Two_girls_sitting_near_the_tank_wore_the_traditional_costume_-_white_brassiere,_black_pants,_light-colored_belt_and_conical_hat_-_L%C3%A9on_Busy_(1874-1951).jpg'
WHERE cultural_item_id = (SELECT id FROM cultural_items WHERE name = 'Áo Yếm')
  AND url = 'https://commons.wikimedia.org/wiki/File:TONKIN_-_Hanoi_-_Servante_Indigene.jpg';
