# Triển khai một website trên Render

Dockerfile ở thư mục gốc build giao diện Next.js thành các file tĩnh, đóng gói chúng vào Spring Boot và chạy cả website lẫn API trên **một Render Web Service**. Giao diện gọi API cùng domain qua `/api/v1`. PostgreSQL vẫn phải được lưu ở dịch vụ database độc lập vì ổ đĩa của Render Free không lưu dữ liệu qua các lần khởi động lại.

GitHub chỉ chứa mã nguồn và kích hoạt bản deploy. GitHub Pages không chạy được backend Java hay PostgreSQL của project này. Netlify hiện tại chỉ phù hợp để xem bản frontend tĩnh; hãy dùng URL Render cho website đầy đủ.

## 1. Giữ dữ liệu hiện có

- Nếu backend đang dùng PostgreSQL, tạo bản sao bằng `pg_dump -Fc` và thử khôi phục vào database thử nghiệm trước khi chuyển host.
- Nếu backend đang dùng H2 trong RAM, xuất dữ liệu **trước khi tắt tiến trình backend**. Sau khi tiến trình tắt, dữ liệu chỉ nằm trong RAM thường không thể khôi phục nếu chưa có bản sao.
- Tạo PostgreSQL **17** trên Neon (chọn phiên bản 17 khi tạo project), nhập dữ liệu hiện có và kiểm tra các bảng `users`, `outfits`, `cultural_items`, `rental_providers` trước khi đổi domain. Project này dùng Flyway 10.20.1, đã có module PostgreSQL tương ứng.

## 2. Đưa mã nguồn lên GitHub

Mở PowerShell tại thư mục gốc `AI_AR_2026` rồi chạy:

```powershell
git status
git add -A
git commit -m "Prepare single-service Render deployment"
git push origin main
```

Trước khi `git add -A`, kiểm tra `git status` để chắc chắn không có file dữ liệu hoặc mật khẩu ngoài danh sách thay đổi dự kiến. Các file `.env` và `.env.local` đã được loại khỏi Git. Nếu `git push` yêu cầu đăng nhập, làm theo cửa sổ xác thực của GitHub. Sau khi push, mở repository trên GitHub và xác nhận có `Dockerfile` ở thư mục gốc.

## 3. Tạo cơ sở dữ liệu trên Neon

1. Đăng nhập Neon, chọn **New Project**, chọn PostgreSQL **17** và khu vực gần dịch vụ Render.
2. Vào **Connect**, lấy host, database, username và password. Chọn kết nối trực tiếp (không có hậu tố `-pooler`) cho Flyway.
3. Giữ các giá trị này để nhập ở Render. Không gửi mật khẩu trong chat và không lưu vào GitHub.

## 4. Tạo một Web Service trên Render

Kết nối repository chứa project này, sau đó chọn:

| Mục | Giá trị |
| --- | --- |
| Service Type | Web Service |
| Language | Docker |
| Root Directory | để trống (gốc repository) |
| Dockerfile Path | `Dockerfile` |
| Docker Context | `.` |
| Health Check Path | `/api/v1/health` |
| Instance Type | Free (nếu còn trong tài khoản) |

Render dùng lệnh `CMD` trong Dockerfile; không cần nhập Build Command hay Start Command.

## 5. Đặt biến môi trường trong Render

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://<host-neon>:5432/<database>?sslmode=require
SPRING_DATASOURCE_USERNAME=<username>
SPRING_DATASOURCE_PASSWORD=<password>
JWT_SECRET=<chuoi-ngau-nhien-toi-thieu-32-ky-tu-va-giu-co-dinh>
GEMINI_API_KEY=<neu-su-dung-tro-ly-AI>
```

Giữ bí mật các giá trị này trong Render, không đưa chúng vào Git. `ALLOWED_ORIGINS` không cần đặt khi giao diện và API cùng domain. Nếu Neon đưa connection string dạng `postgresql://user:password@host/db`, hãy tách các phần như ví dụ trên; không dán nguyên chuỗi đó vào `SPRING_DATASOURCE_URL` vì Java cần tiền tố `jdbc:postgresql://`. Dockerfile tự bật cấu hình `production`; nếu thiếu database hoặc JWT secret thì backend sẽ không khởi động thay vì âm thầm dùng H2 trong RAM.

## 6. Kiểm tra sau deploy

1. Mở URL `*.onrender.com` của dịch vụ và kiểm tra trang chủ cùng `/api/v1/health`.
2. Thử đăng ký, đăng nhập và lưu một bộ phối.
3. Khởi động lại dịch vụ trong Render, rồi kiểm tra tài khoản và bộ phối vẫn tồn tại.
4. Gắn domain riêng trong Render sau khi các bước trên thành công. Sau này mỗi lần push code lên Git, Render sẽ tự build và deploy lại một web service.

Các đường dẫn chi tiết bảo tàng mới dùng `/cultural/detail?id=<id>`. Liên kết cũ `/cultural/<id>` được chuyển hướng tự động.
