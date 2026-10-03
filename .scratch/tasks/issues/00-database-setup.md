# 00: Database setup

**What to build:** the persistence layer of the existing Express backend, as decided in ADR-005. The backend opens a PGlite database that persists to a local data folder, applies versioned schema migrations on startup, and hands the database to the feature routers. Tests get a fresh in-memory database. Switching to a PostgreSQL server later means changing the driver and a connection string, not the queries.

Source: `docs/adr/ADR-005-persistence.md`. This is a shared `core/` module in the backend (backend spec, section 3), used by the `tasks` feature from ticket 01 onwards. It creates no feature tables itself.

**Blocked by:** no other ticket. Decisions:

- [x] Database: PostgreSQL, PGlite now, a PostgreSQL server later (ADR-005)
- [x] Data-access library: **Kysely** (type-safe SQL query builder) with **`kysely-pglite-dialect`**. Queries stay close to SQL, and moving to a server means swapping in Kysely's built-in `PostgresDialect` with `pg`, not rewriting queries
- [x] Migration tool: **Kysely's built-in `Migrator`**, with migrations as TypeScript files (`up`/`down`) registered in a static migration provider (an explicit import list rather than reading the folder at runtime, so it works the same under `tsx` and Jest). No extra dependency
- [x] Data folder: env variable `DATABASE_DIR`, defaulting to `backend/data/`; tests use an in-memory database instead of a folder

**Versions:** the development machine runs Node v21.5.0 (see ADR-004, "Currently deviated from"). Kysely 0.29 requires Node >= 22, so pin **`kysely@^0.28`**. `kysely-pglite-dialect` supports PGlite only up to 0.4, so pin **`@electric-sql/pglite@^0.4`**. Raise both after the Node upgrade.

**Status:** done (except the `createApp` wiring, moved to 01)

- [x] `kysely`, `kysely-pglite-dialect` and `@electric-sql/pglite` are backend dependencies; no installation beyond `npm install` is needed
- [x] On startup, the backend opens the database in `DATABASE_DIR` (default `backend/data/`) and applies pending migrations before `app.listen`
- [x] The data folder is excluded from git
- [ ] The database is passed to `createApp` so feature routers can use it — moved to 01, where the first router needs it
- [x] Tests can create a fresh in-memory database with all migrations applied
- [x] Data written before a backend restart is still there after it
- [x] Tests cover opening the database, applying migrations and persistence across a restart
