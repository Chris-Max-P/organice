# ADR-005: Persistence — PGlite now, PostgreSQL later

## Status
Accepted

## Context
Until now the backend held all data only in memory
([ADR-004](./ADR-004-backend-stack-dashboard.md), consequences). Tasks change
that: tasks, their updates and helper assignments must survive a backend restart
(ticket 01), and the brief (update 1) must never change.

Requirements for the persistence layer:
- Easy to set up and maintain, no costs
- No installation on the development machine
- Serves the prototype and some way beyond
- A database server later, to gain hands-on experience with databases

The data is relational: a task has many updates, and helpers and tasks are
linked many-to-many.

## Decision
- **PostgreSQL** is the database.
- **Now:** [PGlite](https://pglite.dev) (`@electric-sql/pglite`), Postgres running
  inside the Node process as an npm dependency and persisting to a local folder.
  It is used for local development and tests.
- **Later:** a PostgreSQL server once the backend is hosted, with a managed free
  tier (e.g. Neon, EU region) as the default candidate. The hosting choice stays
  open until the backend hosting is decided.

## Rationale
- No installation: PGlite comes in through `npm install`, with no Docker and no
  native installer
- No costs and no maintenance while developing locally
- Same SQL dialect now and later: the schema, migrations and queries carry over
  to a PostgreSQL server
- The relational model fits the data: foreign keys, `NOT NULL` and
  constraints/triggers enforce integrity (mandatory description, immutable brief)
  in the database rather than in application code
- SQL and relational modelling are broadly transferable skills (practitioner
  view)
- Tests can create a fresh in-memory PGlite instance per test, without an
  external database

## Rejected alternatives
- **MongoDB** (local or Atlas free tier): comparable on setup and cost, but the
  many-to-many relationship between helpers and tasks and the immutable brief
  would have to be enforced in application code; less transferable learning value
- **SQLite**: no installation either, but it is not Postgres, so moving to a
  server later would mean changing the SQL dialect too
- **Native PostgreSQL installer or Docker**: both require an installation;
  Docker Desktop additionally needs WSL2 and may need a licence on company
  machines
- **A hosted database from day one** (Neon, Atlas): no offline work, and tests
  should not run against it

## Consequences
- The backend gets a database layer and versioned schema migrations
- Switching to a PostgreSQL server means swapping the PGlite driver for a
  network driver (e.g. `pg`) and setting a connection string, not rewriting
  queries. The data-access library must therefore support both drivers
- PGlite runs in-process: only one backend process can use the data folder at a
  time. That is acceptable while the backend runs locally
- The data folder is local and must be excluded from git (`.gitignore`)
- Data access, migrations and the data folder are decided in ticket 00
  (Kysely, Kysely's `Migrator`, `DATABASE_DIR`)
