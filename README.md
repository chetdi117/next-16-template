# test-next-16

Đây là **basic template (template cơ bản) để xây dựng nhiều dự án sử dụng Next.js**. Dự án cung cấp bộ công nghệ và cấu trúc ban đầu có thể tái sử dụng, tùy chỉnh và mở rộng theo yêu cầu của từng ứng dụng.

## Công nghệ

Các phiên bản dưới đây được khai báo trong `package.json`:

| Công nghệ | Phiên bản | Vai trò |
| --- | --- | --- |
| Next.js | 16.4.2 | Framework React, sử dụng App Router |
| React / React DOM | 19.3.0 | Xây dựng giao diện |
| TypeScript | 5.x | Kiểm tra kiểu dữ liệu |
| Ant Design / Ant Design Icons | 6.x | Bộ component giao diện và icon |
| TanStack React Query | 5.x | Quản lý dữ liệu từ server, cache và đồng bộ dữ liệu |
| Redux Toolkit / React Redux | 2.x / 9.x | Quản lý state dùng chung phía client |
| Day.js | 1.x | Xử lý và định dạng ngày giờ |
| Sass (SCSS / CSS Modules) | 1.x | Hỗ trợ viết style theo component |
| Tailwind CSS | 4.x | Utility CSS, tích hợp qua Turbopack |
| ESLint / eslint-config-next | 9.x / 16.4.2 | Kiểm tra quy tắc mã nguồn |
| pnpm | 10.32.1 | Quản lý package và chạy các script |

React Query và Redux Toolkit đã có trong dependencies; việc cấu hình provider, store và tích hợp API cần được hoàn thiện theo từng dự án. Axios được định hướng sử dụng trong `AGENTS.md`, nhưng hiện chưa có trong dependencies.

## Chạy dự án

Cài đặt Node.js tương thích với Next.js 16 và pnpm theo phiên bản khai báo trong `package.json`, sau đó chạy:

```bash
pnpm install
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

Các lệnh khác:

```bash
pnpm build  # Build ứng dụng
pnpm start  # Chạy bản production sau khi build
pnpm lint   # Kiểm tra mã nguồn bằng ESLint
```

## Cấu trúc cơ bản

```text
app/                # App Router, layout, các trang và style toàn cục
common/components/  # Component dùng chung, bao gồm sidebar
utils/              # Các tiện ích dùng chung như xử lý ngày giờ, kiểm tra kiểu
public/             # Tài nguyên tĩnh
```

## Sử dụng làm template

- Sao chép template để khởi tạo dự án Next.js mới.
- Cập nhật tên package, metadata, giao diện và cấu hình theo dự án.
- Bổ sung các feature, API service và cấu hình quản lý state theo nhu cầu.
- Tuân thủ quy ước trong [AGENTS.md](./AGENTS.md) khi phát triển và mở rộng.

Template hiện là nền tảng khởi đầu; các tính năng nghiệp vụ, xác thực và phân quyền cần được triển khai theo yêu cầu của từng dự án.
