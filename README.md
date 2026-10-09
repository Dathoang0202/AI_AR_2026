# vlaura — khí chất thiên thu

Triển khai: [giao diện tĩnh trên GitHub Pages](docs/DEPLOY_GITHUB_PAGES.md) hoặc [frontend và backend chung một dịch vụ Render](docs/DEPLOY_SINGLE_SERVICE.md).

> **vlaura** là ứng dụng web hỗ trợ khám phá, gợi ý phối đồ, kiểm định chuẩn mực văn hóa nghi lễ và tra cứu tri thức di sản y phục truyền thống Việt Nam (*Áo Nhật Bình, Áo Giao Lĩnh, Áo Tấc, Áo Ngũ Thân, Áo Dài*).

---

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

---

## ⚙️ Hướng Dẫn Khởi Chạy Nhanh

### 1. Khởi chạy Backend (Port 8080):

Để bật câu trả lời AI bằng Gemini, sao chép `backend/.env.example` thành `backend/.env.local` rồi điền `GEMINI_API_KEY`. Backend tự đọc file này khi chạy từ thư mục gốc hoặc `backend`; khởi động lại backend sau khi đổi key. Có thể dùng biến môi trường `GEMINI_API_KEY` và `GEMINI_MODEL` trên máy chủ (ưu tiên hơn file). Model mặc định là `gemini-3.1-flash-lite`.

Lấy key tại [Google AI Studio](https://aistudio.google.com/apikey). Tích hợp dùng [Gemini generateContent REST API](https://ai.google.dev/api/generate-content); chỉ backend gửi key qua header `x-goog-api-key`. Không đưa key vào frontend hoặc commit vào Git. `.env.local` đã được loại khỏi Git. Khi thiếu key, hết hạn mức, mất kết nối hoặc Gemini không trả lời hoàn chỉnh, chat dùng dữ liệu bảo tàng và hiển thị trạng thái tương ứng. API trả `answerMode: gemini | knowledge` để phân biệt hai chế độ.

Kiểm tra tích hợp khi hai dịch vụ đang chạy: từ `frontend`, chạy `node scripts/verify-museum-gemini.cjs` (cần Playwright/Chrome, hoặc đặt `PLAYWRIGHT_MODULE` tới module đã cài). Script kiểm tra 35 ảnh, nhãn minh họa, trang chi tiết, phóng to, phục hồi ảnh lỗi, giao diện điện thoại và gửi hai câu hỏi Gemini thật. Có thể đổi địa chỉ bằng `TEST_WEB_URL` và `TEST_API_URL`.

```bash
cd backend
./mvnw spring-boot:run
```

### 2. Khởi chạy Frontend (Port 3000):
```bash
cd frontend
npm install
npm run dev
```

Mở trình duyệt tại: `http://localhost:3000`

## Triển khai một website

Project có thể build frontend và backend thành một Docker image, phục vụ giao diện và API trên cùng một Render Web Service. Xem [hướng dẫn triển khai một dịch vụ](docs/DEPLOY_SINGLE_SERVICE.md). Dữ liệu người dùng cần được lưu trong PostgreSQL độc lập với container.
