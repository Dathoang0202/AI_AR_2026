-- Extend existing databases without changing the checksum of V2.
ALTER TABLE cultural_items ADD COLUMN image_url VARCHAR(500);

UPDATE cultural_items SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Empress_Nam_Phuong.jpg'
WHERE name = 'Áo Nhật Bình';
UPDATE cultural_items SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vietnamese_Giao_L%C4%A9nh_attire.jpg/800px-Vietnamese_Giao_L%C4%A9nh_attire.jpg'
WHERE name = 'Áo Giao Lĩnh';
UPDATE cultural_items SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/A_Vietnamese_man_wearing_an_%C3%81o_ng%C5%A9_th%C3%A2n_2.jpg/800px-A_Vietnamese_man_wearing_an_%C3%81o_ng%C5%A9_th%C3%A2n_2.jpg'
WHERE name = 'Áo Tấc (Áo Ngũ Thân Lễ Phục)';
UPDATE cultural_items SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/5/52/Vietnamese_turban_%28kh%C4%83n_%C4%91%C3%B3ng%29.jpg'
WHERE name = 'Mấn & Khăn Đóng Truyền Thống';

-- V2 supplied explicit IDs. Allocate above existing rows to preserve later data.
INSERT INTO cultural_items (id, name, category, region, historical_period, description, significance, image_url)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Tứ Thân', 'GARMENT', 'Miền Bắc', 'Trước thế kỷ XX',
    'Áo Tứ Thân là trang phục truyền thống của phụ nữ nông thôn miền Bắc, may từ bốn thân áo, thường mặc ngoài yếm và váy, hai vạt trước buộc lại.',
    'Gắn liền với hình ảnh người phụ nữ Việt Nam tần tảo, nền nã trong các dịp lễ hội quan họ hay đời sống thường nhật xưa.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Ao_tu_than.jpg/800px-Ao_tu_than.jpg'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE name = 'Áo Tứ Thân');

INSERT INTO cultural_items (id, name, category, region, historical_period, description, significance, image_url)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Dài', 'GARMENT', 'Toàn quốc', 'Thế kỷ XX - Hiện đại',
    'Trang phục quốc dân của người Việt, được cách tân từ áo ngũ thân. Áo Dài có hai tà dài, chít eo, mặc cùng quần dài bao trùm chân.',
    'Biểu tượng của vẻ đẹp thanh lịch, thướt tha và niềm tự hào văn hóa Việt Nam trên trường quốc tế.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Ao_dai_Vietnam.jpg/800px-Ao_dai_Vietnam.jpg'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE name = 'Áo Dài');

-- Correct the original web references without replacing additional sources.
UPDATE cultural_sources SET title = 'Áo Nhật Bình', publisher = 'Wikipedia Tiếng Việt',
    url = 'https://vi.wikipedia.org/wiki/%C3%81o_Nh%E1%BA%ADt_B%C3%ACnh'
WHERE cultural_item_id = 1 AND url = 'https://vi.wikipedia.org/wiki/Nhat_Binh';
UPDATE cultural_sources SET title = 'Áo giao lĩnh', publisher = 'Wikipedia Tiếng Việt',
    url = 'https://vi.wikipedia.org/wiki/%C3%81o_giao_l%C4%A9nh'
WHERE cultural_item_id = 2 AND url = 'https://vi.wikipedia.org/wiki/Trang_phuc_Viet_Nam';
UPDATE cultural_sources SET title = 'Áo tấc', publisher = 'Wikipedia Tiếng Việt',
    url = 'https://vi.wikipedia.org/wiki/%C3%81o_t%E1%BA%A5c'
WHERE cultural_item_id = 3 AND url = 'https://vi.wikipedia.org/wiki/Ao_dinh';
UPDATE cultural_sources SET title = 'Khăn đóng', publisher = 'Wikipedia Tiếng Việt',
    url = 'https://vi.wikipedia.org/wiki/Kh%C4%83n_%C4%91%C3%B3ng'
WHERE cultural_item_id = 4 AND url = 'https://vi.wikipedia.org/wiki/Khan_dong';

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT item.id, 'Áo tứ thân', 'Wikipedia Tiếng Việt', 'https://vi.wikipedia.org/wiki/%C3%81o_t%E1%BB%A9_th%C3%A2n'
FROM cultural_items item
WHERE item.name = 'Áo Tứ Thân'
  AND NOT EXISTS (SELECT 1 FROM cultural_sources source WHERE source.cultural_item_id = item.id
      AND source.url = 'https://vi.wikipedia.org/wiki/%C3%81o_t%E1%BB%A9_th%C3%A2n');
INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT item.id, 'Áo dài', 'Wikipedia Tiếng Việt', 'https://vi.wikipedia.org/wiki/%C3%81o_d%C3%A0i'
FROM cultural_items item
WHERE item.name = 'Áo Dài'
  AND NOT EXISTS (SELECT 1 FROM cultural_sources source WHERE source.cultural_item_id = item.id
      AND source.url = 'https://vi.wikipedia.org/wiki/%C3%81o_d%C3%A0i');
