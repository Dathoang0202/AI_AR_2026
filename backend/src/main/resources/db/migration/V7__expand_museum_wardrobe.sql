-- Append six sourced records without changing existing IDs or applied migrations.
INSERT INTO cultural_items (id, name, category, region, historical_period, description, significance, image_url)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Bà Ba', 'GARMENT', 'Miền Nam', 'Thế kỷ XX - Hiện đại',
    'Áo Bà Ba có thân áo ngắn, hàng cúc giữa, hai túi phía trước và thường mặc cùng quần dài. Ảnh tư liệu là bộ bà ba của người Việt ở Bến Tre, năm 1968, trưng bày tại Bảo tàng Phụ nữ Việt Nam. Studio mô phỏng áo tay dài và quần tối màu.',
    'Một lựa chọn gắn với sinh hoạt ở Nam Bộ. Khăn rằn và nón lá tạo gợi ý phối đồ dân gian; khi tái hiện một hoàn cảnh lịch sử cụ thể cần đối chiếu thêm chất liệu và cách mặc.',
    '/images/museum/ao-ba-ba.jpg'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE name = 'Áo Bà Ba');

INSERT INTO cultural_items (id, name, category, region, historical_period, description, significance, image_url)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Ngũ Thân Tay Chẽn', 'GARMENT', 'Toàn quốc', 'Thời Nguyễn',
    'Biến thể áo ngũ thân có cổ đứng, năm khuy và ống tay hẹp, dài tới cổ tay. Khác áo Tấc tay thụng, tay chẽn gọn hơn khi cử động, được sử dụng trong sinh hoạt thường ngày. Có biến thể dành cho nam và nữ với tỷ lệ cổ, tay và chiều dài khác nhau.',
    'Giúp tìm hiểu dáng áo trước áo dài tân thời. Ảnh trong bộ sưu tập là sản phẩm may hiện nay trên giá trưng bày; mô phỏng Studio thể hiện phom áo và màu sắc, không xác nhận niên đại của sản phẩm.',
    '/images/museum/ao-ngu-than-tay-chen.jpg'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE name = 'Áo Ngũ Thân Tay Chẽn');

INSERT INTO cultural_items (id, name, category, region, historical_period, description, significance, image_url)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Trang Phục Nữ Thái (Thanh Hóa)', 'GARMENT', 'Miền Trung (Thanh Hóa)', 'Thế kỷ XX (tư liệu năm 1977)',
    'Bộ trang phục người Thái ở Thanh Hóa, năm 1977, trong trưng bày Bảo tàng Phụ nữ Việt Nam gồm áo thân ngắn, váy dài, dải thắt lưng và khăn. Tư liệu ghi nhận chất liệu bông, kỹ thuật ikat, dệt sợi phụ và thêu tơ. Hình Studio giản lược phom áo, váy và các dải trang trí.',
    'Một mẫu cụ thể để khám phá sự đa dạng trang phục trong cộng đồng Thái. Không dùng mẫu Thanh Hóa này để đại diện mọi nhóm Thái; phối phụ kiện và phục dựng nghi lễ cần tư liệu riêng của địa phương.',
    '/images/museum/trang-phuc-nu-thai.jpg'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE name = 'Trang Phục Nữ Thái (Thanh Hóa)');

INSERT INTO cultural_items (id, name, category, region, historical_period, description, significance, image_url)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Nón Lá', 'ACCESSORY', 'Toàn quốc', 'Thế kỷ XX - Hiện đại',
    'Nón có dạng chóp, làm từ lá và khung tre. Ảnh là nón của người Việt tại Thanh Oai, Hà Nội, năm 1999, trưng bày ở Bảo tàng Phụ nữ Việt Nam. Studio thể hiện dáng nón lá đội đầu để thử cùng trang phục.',
    'Có thể gợi ý cùng áo Bà Ba hoặc áo Dài trong bối cảnh đời thường, dạo phố và chụp ảnh. Kiểu nón, quai và cách dùng thay đổi theo địa phương; một mẫu không đại diện tất cả các loại nón Việt.',
    '/images/museum/non-la.jpg'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE name = 'Nón Lá');

INSERT INTO cultural_items (id, name, category, region, historical_period, description, significance, image_url)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Quạt Xếp Chàng Sơn', 'ACCESSORY', 'Miền Bắc (Hà Nội)', 'Truyền thống - Hiện đại',
    'Quạt xếp dùng nan tre và mặt quạt bằng giấy hoặc vải, có thể mở rộng hoặc gấp gọn. Nghề làm quạt ở Chàng Sơn, Thạch Thất, Hà Nội có nhiều mẫu quạt trơn, quạt thư pháp và quạt trang trí. Ảnh giới thiệu một số mẫu màu sắc của làng nghề.',
    'Vừa là vật dụng làm mát, vừa có thể là phụ kiện khi chụp ảnh hoặc biểu diễn. Quạt mô phỏng trong Studio là mẫu trơn; việc chọn họa tiết cho phục dựng cần căn cứ bối cảnh cụ thể.',
    '/images/museum/quat-xep.jpg'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE name = 'Quạt Xếp Chàng Sơn');

INSERT INTO cultural_items (id, name, category, region, historical_period, description, significance, image_url)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Khăn Rằn Nam Bộ', 'ACCESSORY', 'Miền Nam', 'Thế kỷ XX - Hiện đại',
    'Khăn vải hình chữ nhật với họa tiết kẻ ô, thường dùng để quàng cổ hoặc quấn đầu. Khăn rằn Nam Bộ có liên hệ với khăn krama của người Khmer và gắn với đời sống vùng đồng bằng sông Cửu Long. Ảnh sản phẩm là khăn rằn Tân Châu, An Giang.',
    'Studio mô phỏng cách quàng cổ với hai đầu khăn buông trước ngực. Phối cùng áo Bà Ba để khám phá phong cách dân gian Nam Bộ; không xem đây là phụ kiện cung đình hoặc dấu hiệu chung cho mọi cộng đồng.',
    '/images/museum/khan-ran.jpg'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE name = 'Khăn Rằn Nam Bộ');

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Bộ bà ba, người Việt, Bến Tre, 1968 - ảnh hiện vật', 'Daderot / Wikimedia Commons',
    'https://commons.wikimedia.org/wiki/File:Costume_Ba_ba,_Viet,_Ben_Tre,_1968,_industrial_fabric_-_Vietnamese_Women%27s_Museum_-_Hanoi,_Vietnam_-_DSC04104.JPG'
FROM cultural_items WHERE name = 'Áo Bà Ba';
INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Đưa áo dài ngũ thân sống lại bản sắc vốn có', 'Báo Tin tức - TTXVN',
    'https://baotintuc.vn/van-hoa/ton-vinh-gia-tri-van-hoa-truyen-thong-bai-cuoi-dua-ao-dai-ngu-than-song-lai-ban-sac-von-co-20210213074311146.htm'
FROM cultural_items WHERE name = 'Áo Ngũ Thân Tay Chẽn';
INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Trang phục Thái, Thanh Hóa, 1977 - ảnh hiện vật', 'Daderot / Wikimedia Commons',
    'https://commons.wikimedia.org/wiki/File:Costume,_Thai,_Thanh_Hoa,_1977,_view_1,_cotton,_ikat,_patterns_woven_with_extra_threads_and_silk_embroidery_-_Vietnamese_Women%27s_Museum_-_Hanoi,_Vietnam_-_DSC03910.JPG'
FROM cultural_items WHERE name = 'Trang Phục Nữ Thái (Thanh Hóa)';
INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Nón lá, người Việt, Thanh Oai, 1999 - ảnh hiện vật', 'Daderot / Wikimedia Commons',
    'https://commons.wikimedia.org/wiki/File:Conical_hat,_Viet,_Thanh_Oai,_Hanoi,_1999,_palm_leaves_with_bamboo_frame_-_Vietnamese_Women%27s_Museum_-_Hanoi,_Vietnam_-_DSC03996.JPG'
FROM cultural_items WHERE name = 'Nón Lá';
INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Đưa quạt Chàng Sơn vươn xa', 'Quạt Chàng Sơn',
    'https://quatchangson.vn/vi/post/dua-quat-chang-son-vuon-xa-2.htm'
FROM cultural_items WHERE name = 'Quạt Xếp Chàng Sơn';
INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Khám phá làng nghề dệt khăn rằn trăm tuổi', 'Cục Du lịch Quốc gia Việt Nam',
    'https://www.dulichvn.org.vn/index.php/item/dong-thap-kham-pha-lang-nghe-det-khan-ran-tram-tuoi-63678'
FROM cultural_items WHERE name = 'Khăn Rằn Nam Bộ';
