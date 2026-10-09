# Đưa giao diện lên GitHub Pages

Repository này có cả Next.js và Spring Boot. GitHub Pages chỉ chạy được giao diện tĩnh, không chạy backend Java hoặc lưu tài khoản và bộ phối trong database. Nếu cần các chức năng dùng API, triển khai backend riêng rồi đặt URL API trong biến repository `NEXT_PUBLIC_API_URL` (ví dụ `https://ten-backend.onrender.com/api/v1`) và cho phép origin `https://dathoang0202.github.io` trong cấu hình CORS của backend.

## Các bước

1. Push các thay đổi trong repository lên nhánh `main`. Kiểm tra trên GitHub có `.github/workflows/pages.yml` và `frontend/next.config.js` mới.
2. Trong repository GitHub, mở **Settings → Pages**. Tại **Build and deployment → Source**, đổi từ **Deploy from a branch** sang **GitHub Actions**. Không cần chọn thư mục `/ (root)`.
3. Mở tab **Actions**, chọn **Deploy frontend to GitHub Pages**. Nếu chưa tự chạy sau khi push, chọn **Run workflow → main → Run workflow**.
4. Chờ job thành công, mở `https://dathoang0202.github.io/AI_AR_2026/`. Nếu còn lỗi, mở job trong Actions và xem bước báo lỗi.

Workflow dùng `frontend/out` của Next static export, với base path `/AI_AR_2026`. Nếu đổi tên repository hoặc dùng tên miền riêng, đổi `NEXT_PUBLIC_BASE_PATH` trong `.github/workflows/pages.yml` và cấu hình `basePath` tương ứng.

Không đặt mật khẩu database, `JWT_SECRET` hoặc `GEMINI_API_KEY` trong GitHub Pages hay biến `NEXT_PUBLIC_*`: các giá trị đó sẽ được đưa vào mã chạy trên trình duyệt. Dữ liệu người dùng cần nằm trong database của backend riêng.
