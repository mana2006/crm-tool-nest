# CRM Tool Nest

A CRM backend in development, built with NestJS, TypeScript, PostgreSQL, and Drizzle ORM.

> **Project status:** This project is not production-ready yet. The users, departments, and authentication features are incomplete, and some runtime configuration is not wired into the application. The seed scripts are for local development only and must be reviewed before use.

## Requirements

- Node.js 22 or later
- pnpm 12.8.1 (Corepack is recommended)
- PostgreSQL for database migrations and seeding

Enable Corepack and activate the project pnpm version:

```bash
corepack enable
corepack prepare pnpm@12.8.1 --activate
```

## Getting started

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

Start the application in watch mode:

```bash
pnpm start:dev
```

## Database migrations

**Commit database migrations to Git.** A migration is a versioned record of a database schema change. It lets every developer and deployment environment apply the same changes in the same order, rather than relying on someone to recreate the database manually.

This repository uses Drizzle. Keep all of the following in Git:

- Generated SQL migration files in `drizzle/` (for example, `0000_*.sql`).
- Drizzle metadata in `drizzle/meta/`, including `_journal.json` and the matching snapshot files.
- The schema definitions in `src/database/schema/`.

The SQL migration contains the actual database changes. The journal records migration order, and the snapshots let Drizzle compare schema versions when generating future migrations. These files work together; do not commit only the schema definitions or only the SQL file.

If migration files are ignored or missing from Git, another developer who clones the project may be unable to create the expected database schema or apply the correct changes. Environments can drift apart, and later migrations may be generated from an incomplete history. Ignoring migrations does not make a database change portable.

When changing the database schema:

1. Update the relevant Drizzle schema in `src/database/schema/`.
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

## Common commands

| Command             | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `pnpm start:dev`    | Run the application in watch mode                |
| `pnpm build`        | Build the application                            |
| `pnpm lint`         | Run Oxlint on source, tests, and seed scripts    |
| `pnpm format`       | Format TypeScript files under `src/` and `test/` |
| `pnpm format:check` | Check formatting across the repository           |
| `pnpm typecheck`    | Type-check the application                       |
| `pnpm test`         | Run unit tests                                   |
| `pnpm test:e2e`     | Run end-to-end tests                             |
| `pnpm check:ci`     | Run lint, typecheck, unit/e2e tests, and build   |
| `pnpm db:generate`  | Generate a migration from the Drizzle schema     |
| `pnpm db:migrate`   | Apply pending migrations                         |
| `pnpm db:studio`    | Open Drizzle Studio                              |

> **Seed data:** Do not run `pnpm db:seed` against real or shared data. The current seed scripts use a fixed sample password and need their role mapping reviewed. Use them only with a disposable local development database.

## Quality gates

Git hooks are installed by `pnpm install`:

- **Before each commit:** Husky runs `lint-staged` (Oxlint and Prettier on applicable staged files), then runs the unit tests. If either step fails, Git rejects the commit.
- **Commit messages:** Commitlint checks messages against Conventional Commits using the `commit-msg` hook.
- **GitHub Actions:** CI runs lint, typecheck, unit/e2e tests, and build on pushes and pull requests.

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

## Project structure

```text
src/
  common/       Shared constants and components
  config/       Application configuration
  database/     Drizzle schemas and database connection
  modules/      Domain features (users, auth, departments)
scripts/        Seed and development utilities
drizzle/        SQL migrations and Drizzle metadata
test/           End-to-end tests
```

When adding a feature, keep controllers thin, put business logic in the service/application layer, and access data through an appropriate repository or database layer. Add input validation and tests with each endpoint.
