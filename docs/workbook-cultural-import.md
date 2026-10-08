# Bổ sung bảo tàng từ Data_Viet_Phuc.xlsx

Nguồn dữ liệu: file `Data_Viet_Phuc.xlsx` người dùng cung cấp ngày 08/10/2026. V8 nhập bộ sưu tập y phục/phụ kiện; V10 bổ sung 10 địa điểm thuê và thay dữ liệu mẫu.

- Sheet có 30 mục. V8 thêm 14 y phục và 9 phụ kiện, nâng bộ sưu tập mặc định từ 12 lên 35 mục (22 y phục, 13 phụ kiện).
- Giữ nguyên ID, nội dung, hình ảnh và nguồn của các hồ sơ có sẵn. Những tên đầy đủ có phần chú thích trong ngoặc cũng được đối chiếu với tên ngắn để tránh trùng hồ sơ khi nâng cấp.
- Bảy mục đã có: Áo Giao Lĩnh, Áo Nhật Bình, Áo Tấc (đối chiếu với Áo Tấc / Áo Ngũ Thân Lễ Phục), Áo Ngũ Thân Tay Chẽn, Áo Tứ Thân, Áo Bà Ba, Khăn Đóng (đối chiếu với Mấn & Khăn Đóng Truyền Thống).
- Giữ riêng loại hiện vật (`itemType`) và nhóm sử dụng (`usageCategory`); `category` tiếp tục dùng GARMENT/ACCESSORY để các bộ lọc và tủ đồ tương thích.
- V8 chuyển nguyên văn mô tả, ý nghĩa, thời kỳ và liên kết tư liệu từ file. V9 hiệu đính niên đại áo Trấn Thủ thành thế kỷ XX (từ năm 1946), kèm nguồn Báo Quân đội nhân dân; chỉ sửa giá trị nhập mặc định, giữ nội dung đã được biên tập riêng. Các nhận định còn lại chưa được thẩm định độc lập toàn bộ.
- Studio dùng hình đồ họa cho cả 35 mục, cùng lớp dựng hình với ma-nơ-canh/Lookbook; có 14 phom áo và 9 phụ kiện mới. Nón lá và quạt xếp dùng chung thiết kế giữa tủ đồ và hình mặc thử. Thư viện dùng ảnh thật hoặc trạng thái chờ ảnh, không tự lấy hình đồ họa Studio làm ảnh hiện vật. Chi tiết xem [workbook-garment-visuals.md](workbook-garment-visuals.md).
- Có 25 mục có ảnh thư viện, 10 mục còn chờ ảnh: Viên Lĩnh, Đối Khâm, Cổ Mãn, Phượng Bào, Biền Phục, Vạt Hò, Chẽn Ngự Lâm, Thụ Khâm, Khăn Mỏ Quạ, Guốc Mộc. Các mục này vẫn có thể mặc thử bằng đồ họa trong Studio. Nguồn ảnh ở tab tư liệu và [README ảnh](../frontend/public/images/museum/README.md). Ảnh màu áo Yếm từ V12 có người và khuôn mặt; đây là ngoại lệ còn tồn tại so với yêu cầu ảnh không lộ mặt.
- V11–V13 bổ sung ảnh và nguồn cho Yếm, Hoàng Bào, Mũ Cánh Chuồn. Ảnh chi tiết của long bào được chú thích rõ; không phải ảnh toàn bộ hoàng bào thường triều. Hai ảnh Hoàng Bào và Mũ Cánh Chuồn đang dùng URL Wikimedia, phụ thuộc kết nối bên ngoài.
- V10 lưu nguyên chuỗi giá thuê trong `priceDisplay`, dùng giá khởi điểm số để sắp xếp và để trống khi cần liên hệ; danh sách có 10 địa điểm ở 3 khu vực. Đây là dữ liệu nhập từ tài liệu cung cấp, không khẳng định giá hay địa chỉ đã được cửa hàng xác nhận ở thời điểm xem.
- `backend/src/test/resources/workbook-cultural-items.json` lưu các dòng nguồn đã nhập để kiểm thử việc giữ nguyên dữ liệu và nguồn tư liệu qua API.

Migration bổ sung: V8–V13. Không thay đổi các migration đã áp dụng.
