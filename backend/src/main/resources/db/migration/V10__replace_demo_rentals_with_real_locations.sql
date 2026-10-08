ALTER TABLE rental_items ALTER COLUMN price_per_day DROP NOT NULL;
ALTER TABLE rental_items ADD COLUMN price_display VARCHAR(100);

DELETE FROM rental_providers WHERE is_demo_data = TRUE;

INSERT INTO rental_providers (name, address, city, phone, website, is_demo_data) VALUES
('V''style - Việt Cổ Phục Cách Tân', 'Tầng 3, số 276 Đường Láng, Đống Đa & 3B ngõ 94 P. Hoàng Ngân, Nhân Chính, Cầu Giấy', 'Hà Nội', '0982 848 525', 'https://vietphuc.net', FALSE),
('Tô Hà Style', '102B3 Trung Tự, Đống Đa', 'Hà Nội', NULL, 'https://tohastyle.com.vn/', FALSE),
('Đông Phong', 'Hà Nội (liên hệ cửa hàng để xác nhận địa chỉ)', 'Hà Nội', '0918 707 722', 'https://dongphongvn.blogspot.com', FALSE),
('Ỷ Vân Hiên', '195 Đội Cấn, Ba Đình', 'Hà Nội', '0829 093 933', 'https://www.facebook.com/ctcpyvanhien', FALSE),
('Vân Hoa Đài - 雲華臺', 'Chi nhánh của Cổ Trang Đại Việt Quán (liên hệ để xác nhận địa chỉ)', 'Hà Nội', '0987 165 210', 'https://web.facebook.com/vanhoadai', FALSE),
('Cổ Trang Hoàng Cung', '63 Nguyễn Đức Tịnh', 'Huế', '0903 096 205', 'https://web.facebook.com/cotranghoangcung/?locale=vi_VN&_rdc=1&_rdr', FALSE),
('Boho Hue', '40 Phan Chu Trinh (gần ga Huế)', 'Huế', '0813 428 604', 'https://web.facebook.com/bohohue/?locale=vi_VN&_rdc=1&_rdr', FALSE),
('Cửa hàng thuê cổ phục 33 Vạn Xuân', '33 Vạn Xuân, phường Kim Long', 'Huế', '0866 801 001', 'https://web.facebook.com/cophucviet', FALSE),
('Cửa hàng thuê cổ phục 208 Đinh Tiên Hoàng', '208 Đinh Tiên Hoàng, phường Thuận Thành', 'Huế', '0981 656 299', 'https://web.facebook.com/aodaigabbana', FALSE),
('Áo Dài Cô Sáu', '6 Lê Văn Chí, P. Linh Trung, Thủ Đức', 'TP HCM', '0983 231 116', 'https://www.aodaicosau.com/', FALSE);

INSERT INTO rental_items (provider_id, name, category, price_per_day, price_display)
SELECT p.id, 'Áo Tấc, Nhật Bình, Ngũ Thân', 'Việt phục / Cổ phục', 300000, '300.000 - 600.000 VNĐ'
FROM rental_providers p WHERE p.name = 'V''style - Việt Cổ Phục Cách Tân';
INSERT INTO rental_items (provider_id, name, category, price_per_day, price_display)
SELECT p.id, 'Áo Tấc, Ngũ Thân, Giao Lĩnh', 'Việt phục / Cổ phục', 600000, 'Từ 600.000 VNĐ'
FROM rental_providers p WHERE p.name = 'Tô Hà Style';
INSERT INTO rental_items (provider_id, name, category, price_per_day, price_display)
SELECT p.id, 'Việt phục truyền thống', 'Việt phục / Cổ phục', NULL, 'Liên hệ'
FROM rental_providers p WHERE p.name = 'Đông Phong';
INSERT INTO rental_items (provider_id, name, category, price_per_day, price_display)
SELECT p.id, 'Cổ phục, áo dài, nghi lễ hoàng cung', 'Việt phục / Cổ phục', NULL, 'Liên hệ'
FROM rental_providers p WHERE p.name = 'Ỷ Vân Hiên';
INSERT INTO rental_items (provider_id, name, category, price_per_day, price_display)
SELECT p.id, 'Cổ phục, áo Nhật Bình', 'Việt phục / Cổ phục', NULL, 'Liên hệ'
FROM rental_providers p WHERE p.name = 'Vân Hoa Đài - 雲華臺';
INSERT INTO rental_items (provider_id, name, category, price_per_day, price_display)
SELECT p.id, 'Cổ phục, Nhật Bình', 'Việt phục / Cổ phục', 100000, '100.000 - 300.000 VNĐ'
FROM rental_providers p WHERE p.name = 'Cổ Trang Hoàng Cung';
INSERT INTO rental_items (provider_id, name, category, price_per_day, price_display)
SELECT p.id, 'Cổ phục, áo dài, Nhật Bình', 'Việt phục / Cổ phục', 60000, '60.000 - 300.000 VNĐ'
FROM rental_providers p WHERE p.name = 'Boho Hue';
INSERT INTO rental_items (provider_id, name, category, price_per_day, price_display)
SELECT p.id, 'Ngũ thân, Nhật Bình', 'Việt phục / Cổ phục', 100000, '100.000 - 400.000 VNĐ'
FROM rental_providers p WHERE p.name = 'Cửa hàng thuê cổ phục 33 Vạn Xuân';
INSERT INTO rental_items (provider_id, name, category, price_per_day, price_display)
SELECT p.id, 'Cổ phục Huế, thiết kế may mới', 'Việt phục / Cổ phục', 150000, '150.000 - 600.000 VNĐ'
FROM rental_providers p WHERE p.name = 'Cửa hàng thuê cổ phục 208 Đinh Tiên Hoàng';
INSERT INTO rental_items (provider_id, name, category, price_per_day, price_display)
SELECT p.id, 'Việt phục, áo tấc, áo Nhật Bình, áo dài', 'Việt phục / Cổ phục', 150000, '150.000 - 500.000 VNĐ'
FROM rental_providers p WHERE p.name = 'Áo Dài Cô Sáu';
