# vlaura — khí chất thiên thu

> **vlaura** là ứng dụng web hỗ trợ khám phá, gợi ý phối đồ, kiểm định chuẩn mực văn hóa nghi lễ và tra cứu tri thức di sản y phục truyền thống Việt Nam (*Áo Nhật Bình, Áo Giao Lĩnh, Áo Tấc, Áo Ngũ Thân, Áo Dài*).

## 🚀 Các Tính Năng Nổi Bật

1. **Gợi Ý Phối Đồ Theo Bối Cảnh (Onboarding)**:
   - Tự động phân tích bối cảnh nghi lễ (Tết, Lễ cưới, Chụp ảnh di sản), vùng miền và tông màu để đưa ra gợi ý phối đồ tối ưu.

2. **Studio Phối Đồ & Kiểm Định Văn Hóa Trực Tiếp (Outfit Studio)**:
   - Tùy biến y phục, màu sắc và phụ kiện kèm theo.
   - Kiểm định chuẩn mực văn hóa theo thời gian thực kèm trích dẫn sử liệu xác thực (*Khâm Định Đại Nam Hội Điển Sự Lệ, Ngàn Năm Áo Mũ*).

3. **Lookbook Cá Nhân & Quản Lý Quyền Riêng Tư**:
   - Lưu trữ phối đồ cá nhân với bảo mật JWT Token. Hỗ trợ 3 cấp độ riêng tư: `PRIVATE`, `PUBLIC`, `UNLISTED`.

4. **Bách Khoa Toàn Thư Di Sản (Cultural Encyclopedia)**:
   - Tra cứu, tìm kiếm từ khóa và lọc dữ liệu di sản y phục kèm hình ảnh và nguồn sử liệu rõ ràng.

5. **Bản Đồ Điểm Thuê Việt Phục (Rental Locator)**:
   - Tra cứu nhà cung cấp dịch vụ cho thuê theo khu vực địa lý, xem bảng giá theo ngày và nút liên hệ trực tiếp.

6. **Trợ Lý AI Di Sản (AI Cultural Assistant)**:
   - Hỏi đáp nhiều lượt về Việt phục bằng Gemini, dùng các mục di sản liên quan làm ngữ cảnh. Khi chưa cấu hình hoặc dịch vụ lỗi, trợ lý trả lời từ dữ liệu có sẵn và ghi rõ chế độ trả lời.

---

## 🛠 Kiến Trúc Công Nghệ (Tech Stack)

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Java 21/25, Spring Boot 3.2.5, Spring Security (JWT), Spring Data JPA
- **Database**: PostgreSQL / H2 In-Memory (Dev mode)
- **Database Migration**: Flyway (`db/migration/V1` - `V4`)
- **Testing**: JUnit 5, Mockito, Next.js static build checks
