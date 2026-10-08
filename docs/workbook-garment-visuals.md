# Phom mặc thử của y phục từ Excel

Studio và Lookbook cùng dùng `MannequinFigure`. Mười bốn mục y phục mới có lớp dựng hình ở `WorkbookGarment.tsx`; màu áo lấy từ bộ phối, phom nam/nữ dùng chung thông số vai với thân ma-nơ-canh. Cổ, tay và vạt không bị thay bằng áo Tấc mặc định.

| Nhóm | Đặc điểm thể hiện |
| --- | --- |
| Viên Lĩnh | Cổ tròn nhỏ, khuy bên phải, thân rộng và tay thụng rủ |
| Đối Khâm | Hai vạt song song mở trước, nẹp cổ dọc, lớp áo trong và đai |
| Cổ Mãn | Cổ hẹp lộ lớp cổ trong, thân dài, tay gọn theo mô tả được cung cấp |
| Bổ Tử | Dáng áo thụng, ô bổ tử trước ngực; chim được giản lược, không gán phẩm hàm |
| Côn Miện | Áo lễ có lớp thường phía dưới, tế tất, đai và mũ miện; mũ tích hợp ẩn khi người dùng thử mũ khác |
| Hoàng Bào | Áo rộng, họa tiết rồng cuộn giữa thân, trang trí tay, mây và gấu áo |
| Phượng Bào | Phom áo thụng, họa tiết phượng có ba dải đuôi ở thân và tay |
| Yếm | Vải che ngực có mép cong, cổ và dây buộc, phối cùng váy; không có tay áo |
| Trấn Thủ | Áo ngắn không tay, chần quả trám, khuy bên vai/sườn, quần vải |
| Biền Phục | Mô phỏng theo mô tả Excel: áo dài, đai, đồ án nhật nguyệt và tinh tú |
| Mãng Bào | Các đồ án tròn khác Hoàng Bào, họa tiết bốn móng và gấu trang trí |
| Vạt Hò | Áo ngắn, tay gọn, đường vạt bên, quần tối màu |
| Chẽn Ngự Lâm | Áo ngắn tay chẽn, đai, quần gọn và xà cạp; không tự gán huy hiệu đơn vị |
| Thụ Khâm | Áo khoác qua gối, cổ đứng thấp, nẹp và hàng khuy giữa |

## Tư liệu đối chiếu

- [Long Phụng Trình Tường — Bảo tàng Lịch sử Quốc gia, TS Trần Đức Anh Sơn](https://baotanglichsu.vn/vi/Articles/3101/18620/long-phung-trinh-tuong.html): tham khảo ảnh áo cung đình và bố cục hoa văn của long bào, long cổn, mãng bào, phụng bào. Mô phỏng không sao chép đầy đủ số lượng, phẩm cấp hay chương văn của một hiện vật.
- [Áo viên lĩnh — Áo Dài Cô Sáu](https://www.saigonaodai.net/shop/ao-vien-linh/): tham khảo kết cấu cổ tròn, vạt cài phải, tay rộng và lớp áo trong của sản phẩm phục dựng hiện đại; không coi sản phẩm thương mại là hiện vật lịch sử.
- [Chữ và nghĩa: Áo trấn thủ — Báo Quân đội nhân dân](https://ct.qdnd.vn/clb-chien-si/chu-va-nghia-ao-tran-thu-527498): tham khảo dáng không tay, cổ tròn, chần quả trám và khuy bên vai/sườn. Nguồn xác định mẫu áo này gắn với năm 1946; V9 đã hiệu đính niên đại Lê – Nguyễn trong bản nhập Excel và bổ sung nguồn.
- Các mô tả còn lại lấy từ `Data_Viet_Phuc.xlsx`. Chưa có tư liệu đủ cụ thể để xác nhận hình cắt theo tên **Cổ Mãn, Biền Phục, Thụ Khâm, Chẽn Ngự Lâm** trong bảng. Những mục này là diễn giải hình học từ mô tả, không phải bản phục dựng đã thẩm định. Không thêm biểu trưng phẩm cấp hoặc huy hiệu đơn vị không có căn cứ.

Hình mặc thử là mô phỏng phom dáng, màu sắc và hoa văn giản lược. Khớp cơ thể nam/nữ không đồng nghĩa với được chứng nhận phù hợp nghi lễ. Tủ đồ dùng `WardrobeIllustration` để dựng trực tiếp từ cùng hình học; không tải ảnh thật của bảo tàng. `npm run generate:catalog-art` xuất 23 hình SVG tham khảo, nhưng thư viện không dùng các bản xuất này làm ảnh hiện vật.

Nón lá có vành bầu dục, lòng nón, các vòng tre, đường lá và quai lụa. Quạt xếp có cung giấy, nếp gấp, nan tre lộ phía dưới và chốt xoay; hình cầm quạt được đặt theo vị trí bàn tay. Hai món dùng `TraditionalAccessories` chung cho tủ đồ, Studio và Lookbook.

Các y phục mới có kiểm tra biến thể nam/nữ, bối cảnh và phụ kiện trùng vị trí. Mẫu chưa đủ tư liệu nhận trạng thái cần cân nhắc, không tự nhận đạt chuẩn. Bốn tên còn cần tư liệu riêng không tự xuất hiện trong gợi ý theo bối cảnh, nhưng vẫn có thể chọn trong Studio. Nút điều chỉnh chỉ hiện khi có xung đột xử lý được và không xóa lưu ý còn cần đối chiếu.

## Kiểm tra

`npm run build` kiểm tra TypeScript và bản đóng gói. Với backend/frontend local đang chạy, `node scripts/verify-workbook-garments.cjs` dùng Playwright và Chrome để kiểm tra cả 14 mẫu trên hai dáng người, đổi màu, các tham chiếu SVG, lưu/mở lại qua Lookbook thật và hiển thị 320/390 px. Có thể truyền đường dẫn module Playwright qua `PLAYWRIGHT_MODULE`. Script tạo tài khoản kiểm thử local riêng và xóa các bộ phối kiểm thử sau khi chạy; ảnh kiểm tra lưu trong `node_modules/.cache`.

`node scripts/verify-studio-wardrobe.cjs` kiểm tra 35 hình trong tủ đồ, nón/quạt, đổi dáng người, điều chỉnh xung đột, gợi ý theo bối cảnh chuyển vào Studio và ảnh của cả 35 hồ sơ thư viện. Backend có 36 kiểm thử gồm dữ liệu nhập, nâng cấp migration, gợi ý và kiểm tra văn hóa.
