# CRM Tool Nest

Backend CRM đang trong giai đoạn phát triển, xây dựng bằng NestJS, TypeScript, PostgreSQL và Drizzle ORM.

> **Trạng thái:** Đây chưa phải ứng dụng production-ready. Các module users, departments và auth chưa hoàn thiện; một số cấu hình runtime cũng chưa được nối vào ứng dụng. Seed hiện chỉ dành cho môi trường development và cần được rà soát trước khi sử dụng.

## Yêu cầu

- Node.js 22 trở lên
- pnpm 12.8.1 (Corepack được khuyến nghị)
- PostgreSQL khi cần chạy migration hoặc seed

```bash
corepack enable
corepack prepare pnpm@12.8.1 --activate
```

## Bắt đầu nhanh

```bash
git clone <repository-url>
cd crm-tool-nest
pnpm install
```

Tạo file môi trường cục bộ từ mẫu:

```bash
cp .env.example .env
```

Trên PowerShell:

```powershell
Copy-Item .env.example .env
```

Điền thông tin kết nối PostgreSQL trong `.env`. Chỉ dùng thông tin local/dev; không commit file `.env` hoặc secrets.

Chạy ứng dụng ở chế độ watch:

```bash
pnpm start:dev
```

## Các lệnh thường dùng

| Lệnh                | Mục đích                                                       |
| ------------------- | -------------------------------------------------------------- |
| `pnpm start:dev`    | Chạy ứng dụng ở chế độ watch                                   |
| `pnpm build`        | Build ứng dụng                                                 |
| `pnpm lint`         | Chạy Oxlint trên source, tests và seed scripts                 |
| `pnpm format`       | Format các file TypeScript trong `src/` và `test/`             |
| `pnpm format:check` | Kiểm tra format toàn repo                                      |
| `pnpm typecheck`    | Kiểm tra kiểu TypeScript của ứng dụng                          |
| `pnpm test`         | Chạy unit tests                                                |
| `pnpm test:e2e`     | Chạy end-to-end tests                                          |
| `pnpm check:ci`     | Chạy các kiểm tra CI: lint, typecheck, unit/e2e tests và build |
| `pnpm db:generate`  | Tạo migration từ Drizzle schema                                |
| `pnpm db:migrate`   | Áp dụng migration                                              |
| `pnpm db:studio`    | Mở Drizzle Studio                                              |

Các lệnh database cần `DATABASE_URL` trỏ tới database PostgreSQL đã tạo. Không chạy `pnpm db:push` trên môi trường dùng chung/production nếu chưa xem xét thay đổi schema và có quy trình migration rõ ràng.

> **Seed:** Không chạy `pnpm db:seed` trên dữ liệu thật. Seed hiện dùng mật khẩu mẫu cố định và role mapping cần được sửa trước khi dùng; chỉ sử dụng khi đã hiểu tác động và đang ở database local có thể xóa.

## Quality gates

Các hook Git được cài tự động qua `pnpm install`:

- **Trước mỗi commit:** Husky chạy `lint-staged` (Oxlint và Prettier trên file staged phù hợp), sau đó chạy unit tests. Commit bị từ chối nếu một bước thất bại.
- **Định dạng commit:** Commitlint áp dụng Conventional Commits qua hook `commit-msg`.
- **GitHub Actions:** Chạy lint, typecheck, unit/e2e tests và build khi push hoặc tạo pull request.

Ví dụ commit hợp lệ:

```text
feat(users): add user creation endpoint
fix(auth): reject expired refresh token
docs: improve local setup instructions
```

Trước khi mở pull request, có thể chạy toàn bộ gate CI ở local:

```bash
pnpm check:ci
```

Hook local có thể bị bỏ qua; để bắt buộc CI thành điều kiện merge, bật **required status check** cho workflow kiểm tra chất lượng trong branch protection/ruleset của GitHub.

## Cấu trúc chính

```text
src/
  common/       Hằng số và thành phần dùng chung
  config/       Cấu hình ứng dụng
  database/     Drizzle schema và kết nối database
  modules/      Các feature theo domain (users, auth, departments)
scripts/        Seed và tiện ích phát triển
drizzle/        Migration và metadata Drizzle
test/           End-to-end tests
```

Khi thêm feature, giữ controller mỏng, đặt nghiệp vụ trong service/application layer và truy cập dữ liệu qua repository hoặc lớp database phù hợp. Thêm validation và tests cùng với mỗi endpoint.
