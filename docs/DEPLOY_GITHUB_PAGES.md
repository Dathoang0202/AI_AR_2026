# Đưa giao diện lên GitHub Pages

Repository này có cả Next.js và Spring Boot. GitHub Pages chỉ chạy được giao diện tĩnh, không chạy backend Java hoặc lưu tài khoản và bộ phối trong database. Nếu cần các chức năng dùng API, triển khai backend riêng rồi đặt URL API trong biến repository `NEXT_PUBLIC_API_URL` (ví dụ `https://ten-backend.onrender.com/api/v1`) và cho phép origin `https://dathoang0202.github.io` trong cấu hình CORS của backend.

## Bật backend và dữ liệu lâu dài

1. Tạo một project trên Neon với PostgreSQL **17**. Ghi lại host, database, username và password của **direct connection** (không dùng hostname có `-pooler`). Nếu đang có dữ liệu thật, sao lưu và nhập dữ liệu đó trước khi chuyển website sang database mới.
2. Trên Render, chọn **New → Web Service → Git Provider** và repository `Dathoang0202/AI_AR_2026`, nhánh `main`. Đặt **Language** là `Docker`, **Root Directory** là `backend`, **Dockerfile Path** là `Dockerfile`, **Docker Context** là `.`, **Health Check Path** là `/api/v1/health`; chọn gói Free nếu muốn. Đây là dịch vụ API riêng, không phải Static Site.
3. Trong phần **Environment**, thêm các biến sau. Không đưa mật khẩu vào GitHub hoặc chat:

   ```text
   SPRING_DATASOURCE_URL=jdbc:postgresql://<host-neon>:5432/<database>?sslmode=require
   SPRING_DATASOURCE_USERNAME=<username>
   SPRING_DATASOURCE_PASSWORD=<password>
   JWT_SECRET=<chuoi-ngau-nhien-it-nhat-32-ky-tu>
   ALLOWED_ORIGINS=https://dathoang0202.github.io
   ```

   `GEMINI_API_KEY` chỉ cần nếu muốn bật trợ lý AI. Không cần đặt `SPRING_PROFILES_ACTIVE`: Dockerfile đã bật `production`, nên backend sẽ không dùng H2 trong RAM.
4. Chọn **Create Web Service**. Khi deploy xong, mở `https://<ten-service>.onrender.com/api/v1/health` và kiểm tra có `"status":"UP"`.
5. Trên GitHub, mở **Settings → Secrets and variables → Actions → Variables → New repository variable**. Tạo `NEXT_PUBLIC_API_URL` với giá trị `https://<ten-service>.onrender.com/api/v1` (không có dấu `/` ở cuối). Đây chỉ là địa chỉ công khai của API, không phải mật khẩu.
6. Mở **Actions → Deploy frontend to GitHub Pages → Run workflow → main → Run workflow**. Chờ bản Pages mới thành công rồi thử đăng ký tài khoản. Sau đó khởi động lại Web Service trên Render và đăng nhập lại để kiểm tra dữ liệu còn nguyên.

Nếu trình duyệt báo lỗi CORS, kiểm tra `ALLOWED_ORIGINS` đúng **origin** `https://dathoang0202.github.io` (không kèm `/AI_AR_2026/`) và xem logs của Render. Nếu GitHub Pages còn báo chưa cấu hình backend, workflow cần được chạy lại sau khi tạo biến `NEXT_PUBLIC_API_URL` vì Next.js chèn giá trị vào bản build.

## Các bước

1. Push các thay đổi trong repository lên nhánh `main`. Kiểm tra trên GitHub có `.github/workflows/pages.yml` và `frontend/next.config.js` mới.
2. Trong repository GitHub, mở **Settings → Pages**. Tại **Build and deployment → Source**, đổi từ **Deploy from a branch** sang **GitHub Actions**. Không cần chọn thư mục `/ (root)`.
3. Mở tab **Actions**, chọn **Deploy frontend to GitHub Pages**. Nếu chưa tự chạy sau khi push, chọn **Run workflow → main → Run workflow**.
4. Chờ job thành công, mở `https://dathoang0202.github.io/AI_AR_2026/`. Nếu còn lỗi, mở job trong Actions và xem bước báo lỗi.

Workflow dùng `frontend/out` của Next static export, với base path `/AI_AR_2026`. Nếu đổi tên repository hoặc dùng tên miền riêng, đổi `NEXT_PUBLIC_BASE_PATH` trong `.github/workflows/pages.yml` và cấu hình `basePath` tương ứng.

Không đặt mật khẩu database, `JWT_SECRET` hoặc `GEMINI_API_KEY` trong GitHub Pages hay biến `NEXT_PUBLIC_*`: các giá trị đó sẽ được đưa vào mã chạy trên trình duyệt. Dữ liệu người dùng cần nằm trong database của backend riêng.
