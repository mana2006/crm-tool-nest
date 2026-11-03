# CRM Tool Nest

A CRM backend built with **NestJS 12**, **TypeScript 6**, **PostgreSQL**, and **Drizzle ORM** — following **Clean Architecture** (Ports & Adapters) principles.

> **Project status:** This project is under active development. The users, departments, roles, and authentication modules are partially implemented. Seed scripts are for local development only and must be reviewed before use.

---

## Tech Stack

| Category            | Technology                                                    |
| ------------------- | ------------------------------------------------------------- |
| **Runtime**         | Node.js ≥ 22                                                  |
| **Language**        | TypeScript 6 (strict mode, ES2023 target)                     |
| **Framework**       | NestJS 12 (`@nestjs/core`, `@nestjs/platform-express`)        |
| **Database**        | PostgreSQL 16 via `pg` driver                                 |
| **ORM**             | Drizzle ORM (`drizzle-orm` + `drizzle-kit`)                   |
| **Cache / Queue**   | Redis (`ioredis`) · BullMQ (`@nestjs/bullmq`)                 |
| **Authentication**  | Passport.js (Local + JWT strategies) · `@nestjs/jwt` · Argon2 |
| **Validation**      | `class-validator` + `class-transformer` (pipes), Zod (env)    |
| **Email**           | Nodemailer (SMTP/SES) · React Email (JSX templates) · BullMQ  |
| **API Docs**        | Swagger (`@nestjs/swagger`)                                   |
| **Security**        | Helmet · CORS · Cookie-based tokens · Throttler               |
| **Logging**         | Pino (`nestjs-pino` + `pino-http`)                            |
| **Health Checks**   | `@nestjs/terminus`                                            |
| **Scheduling**      | `@nestjs/schedule`                                            |
| **Events**          | `@nestjs/event-emitter`                                       |
| **Package Manager** | pnpm 12.8.1 (Corepack)                                        |
| **Linting**         | Oxlint · Prettier                                             |
| **Testing**         | Jest 30 + ts-jest (ESM) · Supertest (e2e)                     |
| **Git Hooks**       | Husky · lint-staged · Commitlint (Conventional Commits)       |
| **CI/CD**           | GitHub Actions (lint → typecheck → test → e2e → build)        |

---

## Architecture

The project follows a **Clean Architecture** (Hexagonal / Ports & Adapters) pattern. Each feature module is organized into four layers:

```
modules/<feature>/
  ├── domain/            # Entities, Value Objects — pure business rules
  │   ├── entities/
  │   └── value-objects/
  ├── application/       # Use Cases & Ports (abstract interfaces)
  │   ├── use-cases/     #   e.g. login.use-case.ts, forgot-password.use-case.ts
  │   ├── ports/         #   e.g. UserRepositoryPort, TokenServicePort
  │   └── dto/           #   Application-level data transfer objects
  ├── infrastructure/    # Adapters — concrete implementations
  │   ├── repositories/  #   Drizzle-based repository implementations
  │   └── token/         #   JWT token service implementation
  ├── presentation/      # Controllers & request/response DTOs
  │   ├── *.controller.ts
  │   └── dto/
  └── <feature>.module.ts
```

**Key principles:**

- **Dependency Inversion** — Application layer defines abstract ports (e.g., `UserRepositoryPort`, `TokenServicePort`); infrastructure layer provides concrete implementations. NestJS DI wires them via `{ provide: Port, useClass: Impl }`.
- **Use Cases** — Each business operation is an isolated use-case class (e.g., `LoginUseCase`, `ForgotPasswordUseCase`, `RefreshTokenUseCase`).
- **Thin Controllers** — Controllers delegate all logic to use cases, handling only HTTP concerns (request parsing, response shaping, cookie management).
- **Domain purity** — Domain entities and value objects have zero framework dependencies.

> **Note:** The `departments` module currently uses a simpler flat structure (controller → service → repository) and has not yet been migrated to the layered architecture.

---

## Modules

| Module          | Description                                                                 | Architecture    |
| --------------- | --------------------------------------------------------------------------- | --------------- |
| **Auth**        | Login, logout, token refresh, forgot/reset password, JWT session management | Clean (layered) |
| **Users**       | User creation, first-time password update, user lookup                      | Clean (layered) |
| **Roles**       | Role management with RBAC support                                           | Clean (layered) |
| **Departments** | Department CRUD                                                             | Flat (classic)  |

### Auth Flow

- **Login:** Local strategy validates credentials → issues JWT access + refresh tokens as HTTP-only cookies.
- **Token refresh:** Validates refresh token from cookie → rotates both tokens.
- **Forgot password:** Queues email via BullMQ → sends reset link using React Email templates.
- **Reset password:** Verifies token → hashes new password with Argon2.
- **Session tracking:** User sessions stored in DB with IP/User-Agent metadata.

---

## Database Schema

Managed by Drizzle ORM with typed schemas. Current tables:

| Table            | Description                                       |
| ---------------- | ------------------------------------------------- |
| `users`          | User profiles with role FK, status enum, MFA flag |
| `roles`          | Role definitions for RBAC                         |
| `user_session`   | Active JWT sessions (device/IP tracking)          |
| `password_reset` | Password reset tokens with expiry                 |
| `email_verify`   | Email verification tokens                         |

Custom PostgreSQL enums: `user_status`, `user_gender`.

---

## Shared Infrastructure

```
src/shared/
  ├── constants/       # App-wide constants (auth, mail, role, user)
  ├── decorators/      # @CurrentUser(), @ClientInfo()
  ├── filters/         # Exception filters (scaffolded)
  ├── guards/          # Passport strategies (LocalStrategy, JwtStrategy, Guards)
  ├── interceptors/    # Response interceptors (scaffolded)
  ├── mail/            # MailService + BullMQ processor + React Email rendering
  ├── pipes/           # Custom validation pipes (scaffolded)
  ├── queue/           # BullMQ global configuration (Redis connection)
  ├── redis/           # RedisService wrapper over ioredis
  ├── security/        # Argon2 password hasher (PasswordHasherPort + implementation)
  ├── types/           # Shared TypeScript types
  └── utils/           # Utility functions (cookie helpers, etc.)
```

---

## Path Aliases

Configured in `tsconfig.json` and mirrored in `jest.config.ts`:

| Alias         | Maps to                        |
| ------------- | ------------------------------ |
| `@/*`         | `./src/*`                      |
| `@constant`   | `./src/shared/constants/index` |
| `@constant/*` | `./src/shared/constants/*`     |
| `@shared/*`   | `./src/shared/*`               |
| `@common/*`   | `./src/shared/*`               |
| `@modules/*`  | `./src/modules/*`              |

---

## Requirements

- Node.js 22 or later
- pnpm 12.8.1 (Corepack is recommended)
- PostgreSQL 16+ for database
- Redis for caching and BullMQ job queues

Enable Corepack and activate the project pnpm version:

```bash
corepack enable
corepack prepare pnpm@12.8.1 --activate
```

---

## Getting Started

```bash
git clone <repository-url>
cd crm-tool-nest
pnpm install
```

Create a local environment file from the example:

```bash
cp .env.example .env
```

In PowerShell:

```powershell
Copy-Item .env.example .env
```

Set `DATABASE_URL` in `.env` to point to a local PostgreSQL database. Use local development credentials only. Never commit `.env` files or secrets.

### Environment Variables

| Variable                   | Required | Description                                   |
| -------------------------- | -------- | --------------------------------------------- |
| `NODE_ENV`                 | No       | `development` / `production` / `test`         |
| `PORT`                     | No       | Server port (default: `8001`)                 |
| `FRONTEND_URL`             | No       | CORS origin (default: `localhost:3000`)       |
| `DATABASE_URL`             | **Yes**  | PostgreSQL connection string                  |
| `JWT_ACCESS_SECRET`        | **Yes**  | Secret for signing access tokens              |
| `JWT_REFRESH_SECRET`       | **Yes**  | Secret for signing refresh tokens             |
| `JWT_ACCESS_EXPIRY`        | No       | Access token TTL (default: `15m`)             |
| `JWT_REFRESH_EXPIRY_SHORT` | No       | Short refresh TTL (default: `1d`)             |
| `JWT_REFRESH_EXPIRY_LONG`  | No       | "Remember me" refresh TTL (default: `7d`)     |
| `REDIS_HOST`               | No       | Redis host (default: `localhost`)             |
| `REDIS_PORT`               | No       | Redis port (default: `6379`)                  |
| `REDIS_URL`                | No       | Redis URL (default: `redis://127.0.0.1:6379`) |
| `SMTP_HOST`                | **Yes**  | SMTP server hostname                          |
| `SMTP_PORT`                | **Yes**  | SMTP port                                     |
| `SMTP_SECURE`              | No       | Use TLS (default: `true`)                     |
| `SMTP_SERVICE`             | **Yes**  | SMTP service name                             |
| `SMTP_USER`                | **Yes**  | SMTP username                                 |
| `SMTP_PASSWORD`            | **Yes**  | SMTP password                                 |
| `MAIL_FROM`                | No       | Sender email address                          |
| `MAIL_FROM_NAME`           | No       | Sender display name                           |

Environment variables are validated at startup using **Zod** schemas (`src/config/envs.ts`). The application will not start if required variables are missing or invalid.

Start the application in watch mode:

```bash
pnpm start:dev
```

---

## Database Migrations

**Commit database migrations to Git.** A migration is a versioned record of a database schema change. It lets every developer and deployment environment apply the same changes in the same order, rather than relying on someone to recreate the database manually.

This repository uses Drizzle. Keep all of the following in Git:

- Generated SQL migration files in `drizzle/` (for example, `0000_*.sql`).
- Drizzle metadata in `drizzle/meta/`, including `_journal.json` and the matching snapshot files.
- The schema definitions in `src/database/drizzle/schema/`.

The SQL migration contains the actual database changes. The journal records migration order, and the snapshots let Drizzle compare schema versions when generating future migrations. These files work together; do not commit only the schema definitions or only the SQL file.

If migration files are ignored or missing from Git, another developer who clones the project may be unable to create the expected database schema or apply the correct changes. Environments can drift apart, and later migrations may be generated from an incomplete history. Ignoring migrations does not make a database change portable.

When changing the database schema:

1. Update the relevant Drizzle schema in `src/database/drizzle/schema/`.
2. Generate a migration:

   ```bash
   pnpm db:generate
   ```

3. Review the generated SQL and metadata. Make sure the migration is safe and matches the intended change.
4. Commit the schema changes, generated SQL migration, and related `drizzle/meta/` files together.
5. Apply pending migrations to your local database:

   ```bash
   pnpm db:migrate
   ```

Migration commands require `DATABASE_URL` to point to an existing PostgreSQL database. Avoid `pnpm db:push` on shared or production databases; use reviewed, versioned migrations instead. Do not edit a migration that may already have been applied to a shared environment. Create a new migration to correct it.

---

## Common Commands

| Command             | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `pnpm start:dev`    | Run the application in watch mode                |
| `pnpm start:debug`  | Run with debugger attached (watch mode)          |
| `pnpm build`        | Build the application                            |
| `pnpm start:prod`   | Run the production build (`node dist/main`)      |
| `pnpm lint`         | Run Oxlint on source, tests, and seed scripts    |
| `pnpm lint:fix`     | Run Oxlint with auto-fix                         |
| `pnpm format`       | Format TypeScript files under `src/` and `test/` |
| `pnpm format:check` | Check formatting across the repository           |
| `pnpm typecheck`    | Type-check the application                       |
| `pnpm test`         | Run unit tests                                   |
| `pnpm test:watch`   | Run unit tests in watch mode                     |
| `pnpm test:cov`     | Run unit tests with coverage                     |
| `pnpm test:e2e`     | Run end-to-end tests                             |
| `pnpm check`        | Run format check, lint, typecheck, and tests     |
| `pnpm check:ci`     | Run lint, typecheck, unit/e2e tests, and build   |
| `pnpm db:generate`  | Generate a migration from the Drizzle schema     |
| `pnpm db:migrate`   | Apply pending migrations                         |
| `pnpm db:push`      | Push schema changes directly (dev only)          |
| `pnpm db:studio`    | Open Drizzle Studio                              |
| `pnpm db:seed`      | Run seed scripts                                 |

> **Seed data:** Do not run `pnpm db:seed` against real or shared data. The current seed scripts use a fixed sample password and need their role mapping reviewed. Use them only with a disposable local development database.

---

## Quality Gates

Git hooks are installed by `pnpm install`:

- **Before each commit:** Husky runs `lint-staged` (Oxlint and Prettier on applicable staged files), then runs the unit tests. If either step fails, Git rejects the commit.
- **Commit messages:** Commitlint checks messages against Conventional Commits using the `commit-msg` hook.
- **GitHub Actions:** CI runs lint, typecheck, unit/e2e tests, and build on pushes and pull requests against a PostgreSQL 16 service container.

Examples of valid commit messages:

```text
feat(users): add user creation endpoint
fix(auth): reject expired refresh token
docs: improve local setup instructions
```

Run the CI checks locally before opening a pull request:

```bash
pnpm check:ci
```

Local Git hooks can be bypassed. To make CI mandatory before merging, configure the workflow's status check as required in the GitHub branch protection rules or ruleset.

---

## Project Structure

```text
crm-tool-nest/
├── src/
│   ├── main.ts                      # Bootstrap (ValidationPipe, CORS, cookies, prefix /api)
│   ├── app.module.ts                # Root module (ConfigModule, DrizzleModule, QueueModule)
│   ├── config/                      # Env validation (Zod), configuration constants
│   ├── database/
│   │   └── drizzle/                 # Drizzle provider, module, and typed schemas
│   │       └── schema/              #   users, roles, user_session, password_reset, email_verify
│   ├── modules/
│   │   ├── auth/                    # Authentication (Clean Architecture)
│   │   │   ├── domain/              #   Entities, Value Objects
│   │   │   ├── application/         #   Use Cases, Ports (abstract interfaces)
│   │   │   ├── infrastructure/      #   Repository & Token adapters (Drizzle, JWT)
│   │   │   ├── presentation/        #   Controller, DTOs
│   │   │   └── mail/                #   React Email templates (reset-password.tsx)
│   │   ├── users/                   # User management (Clean Architecture)
│   │   ├── roles/                   # Role management (Clean Architecture)
│   │   └── departments/             # Department management (flat structure)
│   └── shared/                      # Cross-cutting concerns
│       ├── constants/               #   Auth, mail, role, user constants
│       ├── decorators/              #   @CurrentUser(), @ClientInfo()
│       ├── guards/                  #   Passport (Local + JWT strategies & guards)
│       ├── mail/                    #   MailService, BullMQ processor, React Email
│       ├── queue/                   #   BullMQ global configuration
│       ├── redis/                   #   RedisService (get/set/del with JSON support)
│       ├── security/                #   Argon2 password hasher (port + adapter)
│       ├── filters/                 #   Exception filters
│       ├── interceptors/            #   Response interceptors
│       ├── pipes/                   #   Custom validation pipes
│       ├── types/                   #   Shared TypeScript types
│       └── utils/                   #   Cookie utilities, helpers
├── drizzle/                         # SQL migrations and Drizzle metadata
├── scripts/                         # Seed and development utilities
├── test/                            # End-to-end tests (Supertest)
├── .github/workflows/ci.yml         # GitHub Actions CI pipeline
├── drizzle.config.ts                # Drizzle Kit configuration
├── jest.config.ts                   # Jest configuration (ESM, path aliases)
├── tsconfig.json                    # TypeScript configuration (strict, NodeNext)
├── oxlint.json                      # Oxlint rules
├── commitlint.config.ts             # Conventional Commits rules
└── .prettierrc                      # Prettier configuration
```

---

## API Overview

All endpoints are prefixed with `/api`. Authentication uses **HTTP-only cookies** (access + refresh tokens).

| Method | Endpoint                          | Auth   | Description                     |
| ------ | --------------------------------- | ------ | ------------------------------- |
| POST   | `/api/auth/login`                 | Public | Login with email/password       |
| POST   | `/api/auth/logout`                | Public | Logout and clear cookies        |
| POST   | `/api/auth/refresh`               | Cookie | Refresh access + refresh tokens |
| GET    | `/api/auth/me`                    | JWT    | Get current user info           |
| POST   | `/api/auth/forgot-password`       | Public | Request password reset email    |
| POST   | `/api/auth/reset-password`        | Token  | Reset password with token       |
| POST   | `/api/user/create`                | JWT    | Create a new user               |
| POST   | `/api/user/update-password-first` | JWT    | Set password on first login     |

---

## License

UNLICENSED
