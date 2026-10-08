-- Fill missing catalog images without replacing curator-supplied images.
-- SVGs are labelled illustrations in the museum UI, not artifact photographs.
UPDATE cultural_items SET image_url = CASE name
    WHEN 'Áo Viên Lĩnh (Cổ tròn)' THEN '/images/museum/vien-linh-photo.jpg'
    WHEN 'Áo Đối Khâm' THEN '/images/museum/doi-kham-photo.jpg'
    WHEN 'Áo Cổ Mãn (Trần)' THEN '/images/museum/co-man.svg'
    WHEN 'Áo Bổ Tử (Bổ phục)' THEN '/images/museum/bo-tu-photo.jpg'
    WHEN 'Côn Miện (Long cổn & Mũ miện)' THEN '/images/museum/con-mien-photo.jpg'
    WHEN 'Phượng Bào (Áo hoa bào)' THEN '/images/museum/phuong-bao.svg'
    WHEN 'Áo Trấn Thủ' THEN '/images/museum/tran-thu-photo.jpg'
    WHEN 'Áo Biền Phục' THEN '/images/museum/bien-phuc.svg'
    WHEN 'Mãng Bào' THEN '/images/museum/mang-bao-photo.jpg'
    WHEN 'Áo Vạt Hò' THEN '/images/museum/vat-ho.svg'
    WHEN 'Áo Chẽn Ngự Lâm (Nhung phục lính canh)' THEN '/images/museum/ngu-lam.svg'
    WHEN 'Áo Thụ Khâm (Áo khoác gài nút giữa)' THEN '/images/museum/thu-kham.svg'
    WHEN 'Nón Quai Thao (Nón Ba Tầm)' THEN '/images/museum/quai-thao-photo.jpg'
    WHEN 'Khăn Mỏ Quạ' THEN '/images/museum/mo-qua.svg'
    WHEN 'Guốc Mộc' THEN '/images/museum/guoc-moc-photo.jpg'
    WHEN 'Hài Cung Đình (Hài Xảo)' THEN '/images/museum/hai-photo.jpg'
    WHEN 'Đai Ngọc (Ngọc Đai)' THEN '/images/museum/dai-ngoc-photo.jpg'
    WHEN 'Kiềng Bạc / Kiềng Vàng' THEN '/images/museum/kieng-photo.jpg'
    WHEN 'Trâm Cài Tóc' THEN '/images/museum/tram-photo.jpg'
    WHEN 'Kim Khánh / Kim Bài' THEN '/images/museum/kim-khanh-photo.jpg'
    ELSE image_url END
WHERE image_url IS NULL OR TRIM(image_url) = '';

-- Cache the two existing Commons photographs; retain their original source citations.
UPDATE cultural_items SET image_url = '/images/museum/hoang-bao-photo.jpg'
WHERE name = 'Hoàng Bào' AND image_url = 'https://upload.wikimedia.org/wikipedia/commons/9/90/Bao_Dai_imperial_robe_private_collection_EDAV.jpg';
UPDATE cultural_items SET image_url = '/images/museum/canh-chuon-photo.jpg'
WHERE name = 'Mũ Cánh Chuồn (Phốc Đầu / Ô Sa)' AND image_url = 'https://upload.wikimedia.org/wikipedia/commons/2/20/Official_hat%2C_Nguyen_dynasty%2C_19th_to_early_20th_century%2C_gilded_metal_-_National_Museum_of_Vietnamese_History_-_Hanoi%2C_Vietnam_-_DSC05595.JPG';

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Ảnh áo viên lĩnh trên giá trưng bày — sản phẩm may hiện đại', 'Áo Dài Cô Sáu', 'https://www.saigonaodai.net/shop/ao-vien-linh/'
FROM cultural_items item WHERE name = 'Áo Viên Lĩnh (Cổ tròn)' AND image_url = '/images/museum/vien-linh-photo.jpg'
AND NOT EXISTS (SELECT 1 FROM cultural_sources source WHERE source.cultural_item_id = item.id AND source.url = 'https://www.saigonaodai.net/shop/ao-vien-linh/');
INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Ảnh áo đối khâm trên giá trưng bày — sản phẩm may hiện đại', 'Áo Dài Cô Sáu', 'https://www.saigonaodai.net/shop/ao-doi-kham/'
FROM cultural_items item WHERE name = 'Áo Đối Khâm' AND image_url = '/images/museum/doi-kham-photo.jpg'
AND NOT EXISTS (SELECT 1 FROM cultural_sources source WHERE source.cultural_item_id = item.id AND source.url = 'https://www.saigonaodai.net/shop/ao-doi-kham/');
INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Ảnh guốc gỗ quai gấm — sản phẩm thủ công hiện đại', 'Guốc Mộc Sài Gòn', 'https://guocmoc.com.vn/shop/'
FROM cultural_items item WHERE name = 'Guốc Mộc' AND image_url = '/images/museum/guoc-moc-photo.jpg'
AND NOT EXISTS (SELECT 1 FROM cultural_sources source WHERE source.cultural_item_id = item.id AND source.url = 'https://guocmoc.com.vn/shop/');
