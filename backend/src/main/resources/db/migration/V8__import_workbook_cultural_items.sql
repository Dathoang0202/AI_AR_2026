-- Source: Data_Viet_Phuc.xlsx, sheet mau_tu_dien_viet_phuc, supplied 2026-10-08.
-- Import only the 23 missing records (14 garments, 9 accessories).
-- Existing Ao Tac / Khan Dong aliases and other catalog records keep their IDs and content.
-- The workbook contains no images; do not invent photo URLs or copy unrelated garments.
ALTER TABLE cultural_items ADD COLUMN item_type VARCHAR(50);
ALTER TABLE cultural_items ADD COLUMN usage_category VARCHAR(100);

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Viên Lĩnh (Cổ tròn)', 'GARMENT', 'Áo', 'Triều phục / Quan phục',
    'Toàn quốc', 'Lý – Trần – Lê',
    'Áo may cổ tròn, cài khuy bên vai phải, vạt rộng, thường gắn bổ tử ở ngực và lưng quy định phẩm phục quan lại.',
    'Biểu tượng uy quyền và trật tự của hệ thống quan liêu, viên lĩnh là phẩm phục thiết triều không thể thiếu, phân định rõ ràng thứ bậc bá quan văn võ. Nó phản ánh tính quy củ và nghiêm ngặt trong nghi lễ cung đình.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('áo viên lĩnh (cổ tròn)', 'áo viên lĩnh'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Trang phục triều Lý', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_tri%E1%BB%81u_L%C3%BD'
FROM cultural_items item WHERE LOWER(name) IN ('áo viên lĩnh (cổ tròn)', 'áo viên lĩnh')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_tri%E1%BB%81u_L%C3%BD');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Đối Khâm', 'GARMENT', 'Áo', 'Lễ phục / Thường phục',
    'Toàn quốc', 'Lý – Trần – Lê – Nguyễn',
    'Áo có hai vạt song song buông thẳng phía trước, không vắt chéo, thường xẻ giữa và khoác bên ngoài.',
    'Mang vẻ đẹp phóng khoáng và tao nhã, đối khâm thường được giới quý tộc và hoàng gia sử dụng như một lớp áo khoác ngoài đầy uyển chuyển. Trang phục này làm tôn lên phong thái đĩnh đạc, ung dung của người mặc.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('áo đối khâm'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Cổ phục Việt Nam', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_Vi%E1%BB%87t_Nam'
FROM cultural_items item WHERE LOWER(name) IN ('áo đối khâm')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_Vi%E1%BB%87t_Nam');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Cổ Mãn (Trần)', 'GARMENT', 'Áo', 'Cung phục',
    'Miền Bắc', 'Triều Trần',
    'Áo cổ áo tròn hẹp, bên trong mặc thêm lớp áo lót lộ cổ, trang phục thanh nhã mang tính phóng khoáng thời Trần.',
    'Phản ánh tinh thần thượng võ và hào khí Đông A, áo cổ mãn mang lại sự năng động, tự do nhưng vẫn giữ được nét thanh nhã của người Đại Việt. Đây là minh chứng cho tư duy thẩm mỹ độc lập và cởi mở dưới triều Trần.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('áo cổ mãn (trần)', 'áo cổ mãn'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Trang phục triều Trần', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_tri%E1%BB%81u_Tr%E1%BA%A7n'
FROM cultural_items item WHERE LOWER(name) IN ('áo cổ mãn (trần)', 'áo cổ mãn')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_tri%E1%BB%81u_Tr%E1%BA%A7n');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Bổ Tử (Bổ phục)', 'GARMENT', 'Áo', 'Quan phục / Phẩm phục',
    'Toàn quốc', 'Lê sơ – Lê Trung Hưng – Nguyễn',
    'Áo dài thụng mang tấm vải thêu linh thú (quan võ) hoặc chim muông (quan văn) trước ngực và sau lưng.',
    'Bổ tử là dấu hiệu nhận diện quyền lực tối quan trọng, với hình thêu linh thú hay chim muông quy định nghiêm ngặt theo từng phẩm hàm. Nó là bức tranh thu nhỏ về trật tự xã hội và hệ tư tưởng Nho giáo trong chốn quan trường.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('áo bổ tử (bổ phục)', 'áo bổ tử'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Bổ tử', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/B%E1%BB%95_t%E1%BB%AD'
FROM cultural_items item WHERE LOWER(name) IN ('áo bổ tử (bổ phục)', 'áo bổ tử')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/B%E1%BB%95_t%E1%BB%AD');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Côn Miện (Long cổn & Mũ miện)', 'GARMENT', 'Bộ trang phục', 'Đại lễ phục Hoàng đế',
    'Toàn quốc', 'Lý – Trần – Lê – Nguyễn',
    'Bộ đại lễ phục cao cấp nhất của Hoàng đế khi tế trời đất, gồm áo thêu chương văn và mũ miện buông chuỗi ngọc.',
    'Là bộ đại lễ phục thiêng liêng nhất, Côn Miện chỉ được Hoàng đế khoác lên khi thực hiện các nghi thức tế tự trọng đại, giao hòa với đất trời. Nó khẳng định tính chính danh, quyền uy tuyệt đối và vai trò Thiên tử của bậc đế vương.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('côn miện (long cổn & mũ miện)', 'côn miện'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Côn miện', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/C%C3%B4n_mi%E1%BB%87n'
FROM cultural_items item WHERE LOWER(name) IN ('côn miện (long cổn & mũ miện)', 'côn miện')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/C%C3%B4n_mi%E1%BB%87n');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Hoàng Bào', 'GARMENT', 'Áo', 'Triều phục Hoàng đế',
    'Toàn quốc', 'Tiền Lê – Lý – Trần – Lê – Nguyễn',
    'Áo sắc vàng thêu rồng (long văn), tay rộng hoặc trung, mặc cùng đai ngọc và mão xung thiên khi thiết triều.',
    'Mang sắc vàng rực rỡ và họa tiết long văn uy dũng, hoàng bào là hiện thân của chân mệnh thiên tử và sức mạnh hoàng gia. Mọi đường kim mũi chỉ đều nhằm tôn vinh vị thế độc tôn của người đứng đầu thiên hạ.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('hoàng bào'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Long bào', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Long_b%C3%A0o'
FROM cultural_items item WHERE LOWER(name) IN ('hoàng bào')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Long_b%C3%A0o');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Phượng Bào (Áo hoa bào)', 'GARMENT', 'Áo', 'Đại lễ phục Hoàng hậu',
    'Toàn quốc', 'Lê – Nguyễn',
    'Áo màu tươi sáng thêu hình chim phượng hoàng xen mây hoa, tay thụng rộng lộng lẫy, đi kèm mũ cửu phụng.',
    'Tượng trưng cho đức hạnh và uy nghi của bậc mẫu nghi thiên hạ, phượng bào rực rỡ với họa tiết chim phượng hoàng tung cánh. Trang phục này tôn vinh vẻ đẹp quyền quý, lộng lẫy của người phụ nữ quyền lực nhất hậu cung.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('phượng bào (áo hoa bào)', 'phượng bào'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Trang phục cung đình triều Nguyễn', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_cung_%C4%91%C3%ACnh_tri%E1%BB%81u_Nguy%E1%BB%85n'
FROM cultural_items item WHERE LOWER(name) IN ('phượng bào (áo hoa bào)', 'phượng bào')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_cung_%C4%91%C3%ACnh_tri%E1%BB%81u_Nguy%E1%BB%85n');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Yếm', 'GARMENT', 'Nội y', 'Nội y truyền thống',
    'Toàn quốc', 'Lý – Trần – Lê – Nguyễn',
    'Tấm vải hình thoi hoặc vuông che ngực, có dây buộc quanh cổ và sau lưng; gồm nhiều loại như yếm cổ xây, yếm cánh sen.',
    'Vượt qua giới hạn của một món nội y, áo yếm tôn vinh nét đẹp thắt đáy lưng ong đầy nữ tính và e ấp của người con gái Việt. Nó là nguồn cảm hứng bất tận trong thi ca, lưu giữ vẻ đẹp đằm thắm xuyên suốt ngàn năm lịch sử.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('áo yếm'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Áo yếm', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/%C3%81o_y%E1%BA%BFm'
FROM cultural_items item WHERE LOWER(name) IN ('áo yếm')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/%C3%81o_y%E1%BA%BFm');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Trấn Thủ', 'GARMENT', 'Áo', 'Quân phục / Tiện phục',
    'Toàn quốc', 'Lê – Nguyễn',
    'Áo chẽn không tay, may sát người chần bông hoặc lót vải dày nhằm giữ ấm và tiện cho việc chiến đấu, cử động.',
    'Ra đời từ nhu cầu thực tiễn trong khói lửa chiến tranh, áo trấn thủ là minh chứng cho ý chí kiên cường và tinh thần vệ quốc của quân dân Việt. Sự gọn gàng, giữ ấm tốt khiến nó trở thành người bạn đồng hành không thể thiếu của người lính.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('áo trấn thủ'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Trang phục quân đội Đại Việt', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_Vi%E1%BB%87t_Nam'
FROM cultural_items item WHERE LOWER(name) IN ('áo trấn thủ')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_Vi%E1%BB%87t_Nam');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Biền Phục', 'GARMENT', 'Áo', 'Tế phục Hoàng gia',
    'Toàn quốc', 'Triều Lê sơ – Lê Trung Hưng',
    'Áo thêu đồ án nhật nguyệt tinh tú, mặc khi tế đàn tế miếu nhỏ hoặc các nghi thức trang trọng của thiên tử.',
    'Dành riêng cho các nghi thức tế lễ vừa và nhỏ, biền phục mang đậm dấu ấn của Nho giáo với những quy chuẩn khắt khe về lễ nhạc. Nó thể hiện sự thành kính của bậc quân vương đối với tổ tiên và thần linh.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('áo biền phục'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Trang phục triều Lê', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_Vi%E1%BB%87t_Nam'
FROM cultural_items item WHERE LOWER(name) IN ('áo biền phục')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_Vi%E1%BB%87t_Nam');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Mãng Bào', 'GARMENT', 'Áo', 'Ban phục quý tộc',
    'Toàn quốc', 'Lê – Nguyễn',
    'Áo thụng thêu hình con mãng (loài thú giống rồng nhưng bốn móng thay vì năm móng) ban cho quan lại đại thần, hoàng thân.',
    'Là đặc ân cao quý từ triều đình, mãng bào mang họa tiết gần giống long bào, khẳng định vị thế ưu tú của các đại thần và hoàng thân quốc thích. Nó đại diện cho sự trọng dụng và vinh dự tột bậc mà một bề tôi có thể nhận được.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('mãng bào'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Mãng bào', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_cung_%C4%91%C3%ACnh_tri%E1%BB%81u_Nguy%E1%BB%85n'
FROM cultural_items item WHERE LOWER(name) IN ('mãng bào')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_cung_%C4%91%C3%ACnh_tri%E1%BB%81u_Nguy%E1%BB%85n');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Vạt Hò', 'GARMENT', 'Áo', 'Thường phục lao động',
    'Miền Trung – Nam', 'Thời Nguyễn',
    'Áo thân ngắn, xẻ tà ngắn hai bên, cổ có đường viền viền kín đáo, tiện lợi khi chèo thuyền, lao động nông nghiệp.',
    'Gắn liền với nếp sống cần lao của nông dân miền Trung và miền Nam, áo vạt hò chú trọng sự tiện dụng, thoải mái trong lao động hàng ngày. Đây là trang phục phản ánh rõ nét sự thích nghi của con người với môi trường tự nhiên khắc nghiệt.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('áo vạt hò'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Áo vạt hò', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/%C3%81o_b%C3%A0_ba'
FROM cultural_items item WHERE LOWER(name) IN ('áo vạt hò')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/%C3%81o_b%C3%A0_ba');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Chẽn Ngự Lâm (Nhung phục lính canh)', 'GARMENT', 'Áo', 'Quân phục triều đình',
    'Kinh đô', 'Lê – Nguyễn',
    'Áo ngắn tay chẽn, dệt hoa văn hình học hoặc thêu dấu hiệu phân đội lính thị vệ, kèm thắt lưng da, bao cổ chân.',
    'Thể hiện tính kỷ luật thép và uy dũng của lực lượng cấm vệ quân, áo chẽn ngự lâm được thiết kế gọn gàng, thuận tiện cho việc võ bị. Nó là bức tường thành vững chắc bảo vệ sự an nguy của hoàng cung và vương triều.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('áo chẽn ngự lâm (nhung phục lính canh)', 'áo chẽn ngự lâm'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Quân đội nhà Nguyễn', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Qu%C3%A2n_%C4%91%E1%BB%99i_nh%C3%A0_Nguy%E1%BB%85n'
FROM cultural_items item WHERE LOWER(name) IN ('áo chẽn ngự lâm (nhung phục lính canh)', 'áo chẽn ngự lâm')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Qu%C3%A2n_%C4%91%E1%BB%99i_nh%C3%A0_Nguy%E1%BB%85n');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Áo Thụ Khâm (Áo khoác gài nút giữa)', 'GARMENT', 'Áo', 'Thường phục / Áo khoác',
    'Toàn quốc', 'Lê – Nguyễn',
    'Áo khoác cổ đứng hoặc cổ tròn thấp xẻ ngực, đính cúc ở trục giữa thân buông dài qua gối.',
    'Mang phong cách trang nhã, áo thụ khâm là lớp áo khoác giữ ấm được ưa chuộng bởi nhiều tầng lớp trong xã hội xưa. Nó tạo nên vẻ ngoài kín đáo, lịch sự, phù hợp với nếp sống chuẩn mực của người Việt.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('áo thụ khâm (áo khoác gài nút giữa)', 'áo thụ khâm'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Khảo cứu trang phục Việt Nam', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_Vi%E1%BB%87t_Nam'
FROM cultural_items item WHERE LOWER(name) IN ('áo thụ khâm (áo khoác gài nút giữa)', 'áo thụ khâm')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_Vi%E1%BB%87t_Nam');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Nón Quai Thao (Nón Ba Tầm)', 'ACCESSORY', 'Phụ kiện', 'Mũ đội đầu',
    'Miền Bắc', 'Lê – Nguyễn',
    'Nón làm bằng lá, hình như cây nấm lớn rộng vành, đỉnh phẳng, có quai bằng lụa dệt thắt tua rua.',
    'Vượt ra khỏi công năng che mưa nắng, nón quai thao là nét duyên ngầm, làm tôn lên vẻ thướt tha của các liền chị Quan họ. Kích thước rộng lớn và quai lụa mềm mại tạo nên một biểu tượng văn hóa đặc sắc của xứ Kinh Bắc.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('nón quai thao (nón ba tầm)', 'nón quai thao'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Nón quai thao', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/N%C3%B3n_quai_thao'
FROM cultural_items item WHERE LOWER(name) IN ('nón quai thao (nón ba tầm)', 'nón quai thao')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/N%C3%B3n_quai_thao');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Khăn Mỏ Quạ', 'ACCESSORY', 'Phụ kiện', 'Mũ đội đầu',
    'Miền Bắc', 'Lê – Nguyễn',
    'Khăn vuông bằng lụa đen hoặc nhung, quấn quanh đầu và thắt nút vểnh lên trước trán giống mỏ quạ.',
    'Với cách quấn độc đáo tạo hình chóp nhọn, khăn mỏ quạ vừa giữ ấm, vừa làm nổi bật khuôn mặt thanh tú của người phụ nữ nông thôn Bắc Bộ. Nó là hình ảnh dung dị, quen thuộc gắn liền với vẻ đẹp chân phương, chịu thương chịu khó.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('khăn mỏ quạ'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Khăn mỏ quạ', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Kh%C4%83n_m%E1%BB%8F_qu%E1%BA%A1'
FROM cultural_items item WHERE LOWER(name) IN ('khăn mỏ quạ')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Kh%C4%83n_m%E1%BB%8F_qu%E1%BA%A1');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Mũ Cánh Chuồn (Phốc Đầu / Ô Sa)', 'ACCESSORY', 'Phụ kiện', 'Mũ quan lại',
    'Toàn quốc', 'Lý – Trần – Lê',
    'Mũ đen thiết triều có 2 ngạnh dài chìa sang hai bên như cánh chuồn chuồn (cánh cứng hoặc cánh mềm).',
    'Là vật bất ly thân của quan lại khi lên triều, hai cánh chuồn rung rinh tượng trưng cho sự thận trọng, luôn lắng nghe lời can gián. Chiếc mũ là lời nhắc nhở thường trực về trách nhiệm và đạo lý làm quan.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('mũ cánh chuồn (phốc đầu / ô sa)', 'mũ cánh chuồn'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Mũ cánh chuồn', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/M%C5%A9_c%C3%A1nh_chu%E1%BB%93n'
FROM cultural_items item WHERE LOWER(name) IN ('mũ cánh chuồn (phốc đầu / ô sa)', 'mũ cánh chuồn')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/M%C5%A9_c%C3%A1nh_chu%E1%BB%93n');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Guốc Mộc', 'ACCESSORY', 'Phụ kiện', 'Giày dép',
    'Toàn quốc', 'Nhiều thời kỳ',
    'Guốc đẽo từ gỗ, cong nhẹ ôm lòng bàn chân, có quai vắt ngang, thường có hai gót để giữ sạch chân.',
    'Từ những khúc gỗ thô sơ, guốc mộc trở thành âm thanh lộc cộc quen thuộc trên mọi nẻo đường làng quê Việt Nam. Nó đại diện cho lối sống giản dị, gần gũi với thiên nhiên và bản sắc văn hóa dân gian bền bỉ.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('guốc mộc'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Guốc mộc', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Gu%E1%BB%91c_m%E1%BB%99c'
FROM cultural_items item WHERE LOWER(name) IN ('guốc mộc')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Gu%E1%BB%91c_m%E1%BB%99c');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Hài Cung Đình (Hài Xảo)', 'ACCESSORY', 'Phụ kiện', 'Giày dép',
    'Kinh đô', 'Lê – Nguyễn',
    'Hài làm bằng lụa, gấm, mũi cong vểnh lên cao, thêu họa tiết rồng phượng, vân mây và đính trân châu.',
    'Từng đường kim mũi chỉ thêu rồng phượng trên hài xảo đều toát lên sự xa hoa, đài các của giới quý tộc cung đình. Nó không chỉ bảo vệ đôi chân ngọc ngà mà còn là chi tiết hoàn thiện bộ lễ phục uy quyền, lộng lẫy.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('hài cung đình (hài xảo)', 'hài cung đình'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Trang phục cung đình triều Nguyễn', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_cung_%C4%91%C3%ACnh_tri%E1%BB%81u_Nguy%E1%BB%85n'
FROM cultural_items item WHERE LOWER(name) IN ('hài cung đình (hài xảo)', 'hài cung đình')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Trang_ph%E1%BB%A5c_cung_%C4%91%C3%ACnh_tri%E1%BB%81u_Nguy%E1%BB%85n');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Đai Ngọc (Ngọc Đai)', 'ACCESSORY', 'Phụ kiện', 'Thắt lưng',
    'Toàn quốc', 'Lý – Trần – Lê – Nguyễn',
    'Đai thắt ngang lưng làm bằng da hoặc lụa, bên trên khảm/nạm các phiến ngọc bích, vàng chạm trổ.',
    'Đai ngọc là thước đo quyền lực và sự giàu sang, chỉ dành riêng cho Thiên tử và những bậc đại quan đầu triều. Những viên ngọc quý khảm trên đai không chỉ để trang trí mà còn khẳng định vị thế tối cao không thể xâm phạm.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('đai ngọc (ngọc đai)', 'đai ngọc'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Đai ngọc', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Ng%E1%BB%8Dc_%C4%91ai'
FROM cultural_items item WHERE LOWER(name) IN ('đai ngọc (ngọc đai)', 'đai ngọc')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Ng%E1%BB%8Dc_%C4%91ai');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Kiềng Bạc / Kiềng Vàng', 'ACCESSORY', 'Phụ kiện', 'Trang sức',
    'Toàn quốc', 'Nhiều thời kỳ',
    'Vòng đeo cổ dạng ống tròn trơn hoặc chạm khắc tinh xảo, chất liệu vàng, bạc thau.',
    'Là món trang sức không thể thiếu trong những dịp trọng đại, chiếc kiềng tôn lên chiếc cổ cao thanh tú và vẻ đẹp sang trọng của người phụ nữ. Nó còn mang ý nghĩa như một của hồi môn quý giá, lưu truyền truyền thống gia đình.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('kiềng bạc / kiềng vàng'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Đồ trang sức Việt Nam', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Trang_s%E1%BB%A9c'
FROM cultural_items item WHERE LOWER(name) IN ('kiềng bạc / kiềng vàng')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Trang_s%E1%BB%A9c');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Trâm Cài Tóc', 'ACCESSORY', 'Phụ kiện', 'Trang sức',
    'Toàn quốc', 'Nhiều thời kỳ',
    'Thanh nhỏ, thuôn dài làm từ ngọc, đồi mồi, vàng, bạc đính hoa văn; dùng để cố định búi tóc.',
    'Không chỉ giữ cho mái tóc gọn gàng, trâm cài còn là một tác phẩm nghệ thuật tinh xảo, thể hiện gu thẩm mỹ và sự tinh tế của nữ giới. Đôi khi, nó còn là kỷ vật đính ước, mang theo những câu chuyện tình yêu lãng mạn thời phong kiến.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('trâm cài tóc'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Trâm cài', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Tr%C3%A2m'
FROM cultural_items item WHERE LOWER(name) IN ('trâm cài tóc')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Tr%C3%A2m');

INSERT INTO cultural_items (id, name, category, item_type, usage_category, region, historical_period, description, significance)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM cultural_items),
    'Kim Khánh / Kim Bài', 'ACCESSORY', 'Phụ kiện', 'Trang sức / Bài vị',
    'Đàng Trong / Kinh đô Huế', 'Triều Nguyễn',
    'Phiến vàng/ngọc chạm hình khánh hoặc chữ nhật, khắc nổi chữ Hán như ''Thái bình'', ''Ân tứ'', đeo trước ngực.',
    'Là phần thưởng danh giá nhất từ bậc quân vương, kim khánh ghi nhận những cống hiến xuất sắc của cá nhân đối với đất nước. Đeo kim khánh trên ngực áo là niềm tự hào to lớn, minh chứng cho lòng trung thành và tài năng kiệt xuất.'
WHERE NOT EXISTS (SELECT 1 FROM cultural_items WHERE LOWER(name) IN ('kim khánh / kim bài'));

INSERT INTO cultural_sources (cultural_item_id, title, publisher, url)
SELECT id, 'Kim khánh', 'Wikipedia tiếng Việt',
    'https://vi.wikipedia.org/wiki/Kim_kh%C3%A1nh'
FROM cultural_items item WHERE LOWER(name) IN ('kim khánh / kim bài')
    AND NOT EXISTS (SELECT 1 FROM cultural_sources source
        WHERE source.cultural_item_id = item.id AND source.url = 'https://vi.wikipedia.org/wiki/Kim_kh%C3%A1nh');
