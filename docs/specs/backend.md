# Backend setup

How the Node/Express backend is set up. Feature behaviour lives in the design
docs and the feature specs (e.g. [dashboard-backend.md](./dashboard-backend.md)).

---

## Architecture note

The backend serves the core team's application (the admin tool), not the
end-user PWA — see [ADR-003](../adr/ADR-003-admin-dashboard-trennung.md). It
runs locally for the core team only.

The admin tool grows by feature: each feature is a feature folder in this
backend. Helpers get their own app (the end-user PWA of
[ADR-001](../adr/ADR-001-frontend-stack.md)), which uses this same backend —
there is no second backend. Persistence is PGlite now and a PostgreSQL server
later ([ADR-005](../adr/ADR-005-persistence.md)). Hosting and protecting the
admin endpoints once helpers reach the backend from outside are still open (see
the tasks design, "Architectural consequence").

Business logic stays entirely server-side; the frontend handles presentation and
interaction only (see [frontend.md](./frontend.md)).

---

## Code structure

Organised by feature, using the same `core/ features/` vocabulary as the
frontend ([frontend.md](./frontend.md), "Project structure"):

```
backend/src/
  server.ts                         # opens the database, loads event data, then app.listen
  app.ts                            # createApp(eventData, db): mounts each feature router
  core/                             # shared by all features, loaded once at startup
    database/                       # see "Database"
    event-data/
      event-data.types.ts           # EventData { ticketEntries, payments }
      event-id.ts                   # EVENT_ID placeholder
      load-event-data.ts            # sheet + mail + mapping + matching (dashboard-backend.md)
    integrations/
      google-sheets/                # dashboard-backend.md
      mail/                         # dashboard-backend.md
    ticket-model/
    payment-matching/
  features/
    participants/                   # GET /dashboard/participants
    finance/                        # GET /dashboard/finance
    tasks/                          # GET /tasks/all, POST /tasks
```

**Dependency rules**

- `features/*` may import from `core/`. A feature **never imports from another
  feature**; something two features need moves to `core/`.
- `core/` never imports from `features/`.
- Something used by one feature only stays in that feature (e.g. the
  aggregation service lives in `participants/`) until a second one needs it.

**A feature owns** its Express router (`create<Feature>Router(eventData)`), its
services, and its types. Tests sit next to the file they test (`*.test.ts`);
route tests go through `createApp` so they cover the full URL.

**Adding a feature**: create `src/features/<name>/` with a router factory, and
mount it in `app.ts`. No shared class has to change. One endpoint per view or
widget, so the frontend can load each independently.

---

## Startup

- `server.ts` opens the database and runs `loadEventData()` (see
  [dashboard-backend.md](./dashboard-backend.md)); the server only listens
  (`app.listen`) once both succeed
- If either fails, the process aborts — there is never a reachable server without
  a data state
- Ctrl+C / SIGTERM closes the database cleanly
- `event_id`: multi-event support is deferred (see
  [event-backend.md](./event-backend.md)), so a fixed placeholder (`EVENT_ID`,
  `core/event-data/event-id.ts`) is used

---

## HTTP

- Framework: **Express**, CORS via the `cors` middleware without origin
  restriction (fits the core-team-only/no-access-control scope, ADR-003)
- Server port configurable via the environment variable `PORT`, with a default
  fallback
- Responses are shaped for the view by the backend (e.g. a task with its helper
  names), so the frontend never joins data
- Endpoint tests via **`supertest`** against the Express app (without a real
  server/port)

---

## Secrets

Values worth protecting (service account keyfile, sheet ID, mail credentials)
must not end up in the repository, and never in the frontend bundle.

| Option | Effort | Suitability |
|---|---|---|
| `.env` file + `.gitignore` | Minimal | Basic protection against accidental commits, but the file sits unencrypted on the server |
| Environment variables in the hosting admin panel | Low | Offered by most web hosts/deploy platforms, values stored encrypted with the provider, not visible in the repo |
| Dedicated cloud secrets manager (Google Secret Manager, AWS Secrets Manager, Azure Key Vault) | Medium | Sensible with existing cloud infrastructure – not the case here currently |
| Open-source secrets tools (Infisical, Doppler, HashiCorp Vault) | Medium–high | For cross-team secret sharing, versioning, rotation – worthwhile from several environments/people onwards |

**Decision for the MVP**

- `.env` + `.gitignore` as minimal protection against repository leaks
- Locally, the `.env` file and the service account keyfile live together in the
  folder `backend/envs/`, which is entirely excluded via `.gitignore` (not a
  single-file ignore, since it would be too easy to forget a new secret in that
  folder)
- The actual runtime value comes from the web host's environment variable
  feature (not in the repository)
- The variables themselves are listed with the integration that uses them
  ([dashboard-backend.md](./dashboard-backend.md))

---

## Database

See [ADR-005](../adr/ADR-005-persistence.md).

- `core/database/`: `openDatabase({ dataDir?, migrations? })` opens PGlite through
  Kysely (`kysely-pglite-dialect`) and applies pending migrations. Without
  `dataDir` the database is in memory (tests)
- Data folder: env variable `DATABASE_DIR`, default `backend/data/`, excluded
  from git
- A failing migration aborts startup
- Schema: one interface per table in `database.types.ts`; migrations as
  TypeScript files (`up`/`down`) listed explicitly in `migrations/index.ts`,
  named `NNNN-description` and applied in that order
- Tables: see the tasks design, "Data model"
- Moving to a PostgreSQL server later: swap the dialect for Kysely's
  `PostgresDialect` with `pg` and a connection string; queries stay unchanged

---

## Local development

`npm start` in `backend/` (`tsx src/server.ts`). No watch mode — a restart
re-fetches the sheet and rescans the mailbox, so restarts stay manual and
deliberate.
