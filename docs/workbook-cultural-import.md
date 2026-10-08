# Bổ sung bảo tàng từ Data_Viet_Phuc.xlsx

Nguồn dữ liệu: file `Data_Viet_Phuc.xlsx` người dùng cung cấp ngày 08/10/2026. V8 nhập bộ sưu tập y phục/phụ kiện; V10 bổ sung 10 địa điểm thuê và thay dữ liệu mẫu.

- Sheet có 30 mục. V8 thêm 14 y phục và 9 phụ kiện, nâng bộ sưu tập mặc định từ 12 lên 35 mục (22 y phục, 13 phụ kiện).
- Giữ nguyên ID, nội dung, hình ảnh và nguồn của các hồ sơ có sẵn. Những tên đầy đủ có phần chú thích trong ngoặc cũng được đối chiếu với tên ngắn để tránh trùng hồ sơ khi nâng cấp.
- Bảy mục đã có: Áo Giao Lĩnh, Áo Nhật Bình, Áo Tấc (đối chiếu với Áo Tấc / Áo Ngũ Thân Lễ Phục), Áo Ngũ Thân Tay Chẽn, Áo Tứ Thân, Áo Bà Ba, Khăn Đóng (đối chiếu với Mấn & Khăn Đóng Truyền Thống).
- Giữ riêng loại hiện vật (`itemType`) và nhóm sử dụng (`usageCategory`); `category` tiếp tục dùng GARMENT/ACCESSORY để các bộ lọc và tủ đồ tương thích.
- V8 chuyển nguyên văn mô tả, ý nghĩa, thời kỳ và liên kết tư liệu từ file. V9 hiệu đính niên đại áo Trấn Thủ thành thế kỷ XX (từ năm 1946), kèm nguồn Báo Quân đội nhân dân; chỉ sửa giá trị nhập mặc định, giữ nội dung đã được biên tập riêng. Các nhận định còn lại chưa được thẩm định độc lập toàn bộ.
- Studio dùng hình đồ họa cho cả 35 mục, cùng lớp dựng hình với ma-nơ-canh/Lookbook; có 14 phom áo và 9 phụ kiện mới. Nón lá và quạt xếp dùng chung thiết kế giữa tủ đồ và hình mặc thử. Chi tiết xem [workbook-garment-visuals.md](workbook-garment-visuals.md).
- Cả 35 mục hiện có hình trong thư viện. V14 bổ sung ảnh sản phẩm chụp riêng cho Viên Lĩnh, Đối Khâm và Guốc Mộc. Theo lựa chọn của người dùng ngày 08/10/2026, bảy mục chưa có ảnh phù hợp (Cổ Mãn, Phượng Bào, Biền Phục, Vạt Hò, Chẽn Ngự Lâm, Thụ Khâm, Khăn Mỏ Quạ) dùng hình SVG với nhãn **Hình minh họa**, kèm giải thích ở trang chi tiết; không trình bày như ảnh hiện vật xác thực. Hai ảnh thiết kế Nhật Bình và Giao Lĩnh cũng được ghi nhãn minh họa. Nguồn ảnh ở tab tư liệu và [README ảnh](../frontend/public/images/museum/README.md). Ảnh màu áo Yếm từ V12 có người và khuôn mặt; ảnh này được giữ nguyên.
- V11–V13 bổ sung ảnh và nguồn cho Yếm, Hoàng Bào, Mũ Cánh Chuồn. V14 lưu hai ảnh Wikimedia vào dự án, đồng bộ các ảnh còn trống qua API và giữ ảnh được biên tập riêng. Ảnh chi tiết của long bào được chú thích rõ; không phải ảnh toàn bộ hoàng bào thường triều.
- V10 lưu nguyên chuỗi giá thuê trong `priceDisplay`, dùng giá khởi điểm số để sắp xếp và để trống khi cần liên hệ; danh sách có 10 địa điểm ở 3 khu vực. Đây là dữ liệu nhập từ tài liệu cung cấp, không khẳng định giá hay địa chỉ đã được cửa hàng xác nhận ở thời điểm xem.
- `backend/src/test/resources/workbook-cultural-items.json` lưu các dòng nguồn đã nhập để kiểm thử việc giữ nguyên dữ liệu và nguồn tư liệu qua API.

Migration bổ sung: V8–V14. Không thay đổi các migration đã áp dụng.
