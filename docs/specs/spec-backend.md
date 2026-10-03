# Specification: Event Overview & Dashboard – Backend

---

## Feature overview

| # | Feature | Purpose (short) | Chapter |
|---|---|---|---|
| 1 | Event service | Create an event, `event_id` as the base reference for all services (implementation deferred, currently single-event scope) | [Section 1](#1-event-service) |
| 2 | Google integration service | Read a private Google Sheet via a service account over the Sheets API v4, in-memory, re-fetched on every app start | [Section 2](#2-google-integration-service) |
| 3 | Mail integration service | Search a hardcoded IMAP mailbox provider-independently by sender/subject/time range; parse PayPal payment mails (amount, name) | [Section 3](#3-mail-integration-service) |
| 4 | Secrets management service | Central storage of values worth protecting (keyfile, sheet ID, mail credentials) via `.env` + `.gitignore` (`backend/envs/`), server-side | [Section 4](#4-secrets-management-service) |
| 5 | Ticket/participant model | Map sheet rows to `TicketEntry` (hardcoded column mapping + category→price lookup) | [Section 5](#5-ticketparticipant-model) |
| 6 | Payment matching service | Assign payment mails to TicketEntries via string name matching (full name / initial+surname); derived status open/paid/unclear, manually overridable | [Section 6](#6-payment-matching-service) |
| 7 | Aggregation service | Generic grouping of TicketEntries by a field (`category`, `wantsToHelp`) → `{ value, count, entries }[]` | [Section 7](#7-aggregation-service) |
| 8 | Finance service | Figures `{ paid, expected }` from TicketEntry prices + derived payment status, rounded raw numbers | [Section 8](#8-finance-service) |
| 9 | Dashboard data API | Express REST API per widget (`/dashboard/participants`, `/dashboard/finance`); bootstrap (sheet + mail + matching) before `app.listen`, in-memory | [Section 9](#9-dashboard-data-api) |
| 10 | Database | PostgreSQL via Kysely; PGlite in-process now, a PostgreSQL server later; migrations applied before `app.listen` | [Section 10](#10-database) |
| 11 | Tasks API | `GET /tasks/all`, `POST /tasks`; tasks and their update thread, persisted | [Section 11](#11-tasks-api) |

---

## Architecture note

This dashboard is part of the admin tool, not the end-user PWA — see
[ADR-003](../adr/ADR-003-admin-dashboard-trennung.md). It runs locally for the
core team only, without PWA requirements (offline, manifest, service worker).

The admin tool grows by feature: the organiser side of tasks
([docs/design/tasks.md](../design/tasks.md)) is added to this backend as a new
feature folder. Helpers get their own app (the end-user PWA of
[ADR-001](../adr/ADR-001-frontend-stack.md)), which uses this same backend —
there is no second backend. Persistence is PGlite now and a PostgreSQL server
later ([ADR-005](../adr/ADR-005-persistence.md)). Hosting and protecting the admin
endpoints once helpers reach the backend from outside are still open (see the
tasks design, "Architectural consequence").

### Code structure

Organised by feature, using the same `core/ features/` vocabulary as the
frontend (frontend spec, section 3):

```
backend/src/
  server.ts                         # opens the database, loads event data, then app.listen (section 9)
  app.ts                            # createApp(eventData, db): mounts each feature router
  core/                             # shared by all features, loaded once at startup
    database/                       # section 10
    event-data/
      event-data.types.ts           # EventData { ticketEntries, payments }
      event-id.ts                   # EVENT_ID placeholder (section 9)
      load-event-data.ts            # sheet + mail + mapping + matching (section 9)
    integrations/
      google-sheets/                # section 2
      mail/                         # section 3
    ticket-model/                   # section 5
    payment-matching/               # section 6
  features/
    participants/                   # GET /dashboard/participants
      participants.routes.ts
      participants.types.ts         # GroupByField whitelist
      aggregation.service.ts        # section 7
    finance/                        # GET /dashboard/finance
      finance.routes.ts
      finance.service.ts            # section 8
    tasks/                          # GET /tasks/all, POST /tasks (section 11)
      tasks.routes.ts
      tasks.service.ts
      tasks.types.ts
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
mount it in `app.ts`. No shared class has to change.

---

## 1. Event service

**Model**
- Event: id, name, created_at
- Participant list: derived directly from the Google Sheet responses (1:1, no
  separate management mechanism) → corresponds to the ticket/participant model
  in section 5
- Helper list: logic to follow later
- No invitation mechanism, no roles, no access control (core-team-only for now)

**Responsibility**
- Create an event
- Base reference (event_id) for all other services
- Central storage, because "shared project" means all team members see the same
  state — which only works with server-side/central data storage, not purely in
  the browser

**Open questions**
- None open.

**Status**
- Implementation deferred for now: the scope is currently limited to a single
  event (see section 3), and no existing service references `event_id`. The
  module will be built once multi-event capability is needed.

---

## 2. Google integration service

**Responsibility**
- Access to a Google Sheet via a **service account** (Google Cloud) – the sheet
  is shared with the service account like with a normal Google user, and
  otherwise stays private; no OAuth consent flow, no user login
- Auth: the service account JSON keyfile is loaded server-side; the Google Auth
  Library uses it to generate the required access tokens automatically
- Data retrieval via the **Google Sheets API v4**:
  `GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}`
  with a bearer token in the request; the response is JSON (an array of rows) –
  no CSV parsing needed any more
- Sheet data is re-fetched from the sheet on **every app start** – no
  persistence, no cache. The data only lives in the process's memory and is
  rebuilt fresh on every restart
- **Must run server-side**: primarily because the service account keyfile is a
  secret (it must not appear in the frontend bundle) – the access token is
  generated server-side from the keyfile, and a browser has no sensible way to
  authenticate with it anyway

**Technical implementation**
- Library: **`google-auth-library`** (npm) – the official Google client library;
  it handles loading the keyfile and generating/renewing the access tokens
  (scope `spreadsheets.readonly`)
- Configuration via environment variables, managed through secrets management
  (see section 4):
  - `SHEET_ID` – spreadsheet ID (from the sheet URL)
  - `SHEET_NAME` – name of the worksheet (corresponds to the range parameter of
    the Sheets API, e.g. `Formularantworten 1`)
  - `GOOGLE_SERVICE_ACCOUNT_KEY_FILE` – path to the service account JSON keyfile
- The keyfile and the `.env` file live together in a dedicated folder (`envs/`)
  that is entirely excluded from version control

**Data model (in-memory)**
- A generic table structure (rows × columns), valid for the lifetime of the
  process

**Note / trade-off**
- Access exclusively via the service account, no public visibility – the sheet
  stays private, and the previous privacy trade-off (a public sharing link,
  readable by anyone with the URL) disappears entirely
- A sheet has exactly **one worksheet** – no `gid` management/selection of
  multiple sheets needed; the range references the sheet name/cell range instead
  (e.g. `Formularantworten 1!A:Z`)

**Error behaviour**
- If the sheet is unreachable at app start (network error, missing/invalid
  sharing, invalid keyfile, etc.), an error is thrown. No silent display, no
  empty or stale state without notice.

**Open questions**
- None open.

---

## 3. Mail integration service

**Responsibility**
- The mailbox is hardcoded (one mailbox at the web host, IMAP access)
- Mails searchable by criteria (sender, subject, time range)
- The provider should be irrelevant (no provider-specific code)
- **Must run server-side**: IMAP is a TCP-based protocol, and browser JavaScript
  has no API access to raw sockets/IMAP

**Technical implementation**
- Library: **`imapflow`** (npm) – actively maintained, TypeScript-typed,
  provider-independent standard IMAP client
- Required credentials: email, password, IMAP host, port
- Configuration for now **not via UI**, but through **environment variables**
  (e.g. `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_HOST`, `MAIL_PORT`), managed through
  secrets management (see section 4) – no input form in this version

**Query logic (replaces the earlier polling/IMAP IDLE approach)**
- Mails are fetched automatically on **every app start**
- No manual "fetch mails" button needed, since they are re-fetched on every app
  start anyway
- No background polling, no IMAP IDLE in this version
- Since nothing is persisted (see section 6, trade-off), there is no stored
  "last fetch" timestamp – every query searches **all** mails matching the filter
  criteria (sender/subject)

**Error behaviour**
- If the mailbox is unreachable while fetching (at app start), an error is
  thrown. No silent display.

**Scope**
- For now only a **single event** is supported – no need to assign payment mails
  to several concurrently running events. With multiple active events, this
  assignment logic would have to follow.

**Mail parsing (PayPal payment confirmation) – resolved**
- The mail is HTML, not an image → the body is retrievable as text/HTML over
  IMAP, no OCR needed
- Sender filter criterion: `service@paypal.de`
- Subject: "Du hast eine Zahlung erhalten"
- Amount: from the label/value pair "Erhaltener Betrag" (more robust than from
  running text)
- Name: from the heading "[Name] hat dir [Betrag] gesendet" via regex
  (`(.+?) hat dir`)
- Additionally available, optionally usable: transaction code, transaction date

**Open questions**
- None open.

---

## 4. Secrets management service

**Purpose**: central, reusable storage of values worth protecting (service
account keyfile, spreadsheetId/range, mail credentials) – these must not end up
in the repository/codebase, and especially not in the frontend bundle.

**Common options**

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
- Affects: the service account keyfile (JSON), spreadsheetId and sheet
  name/range (section 2), mail credentials email/password/host/port (section 3)
- Runs exclusively server-side — never include it in the frontend bundle

**Open questions**
- None open.

---

## 5. Ticket/participant model

**Model**
- TicketEntry: id (row number in the Google Sheet, 1-based, header = row 1 →
  first data row = 2), event_id, firstName, lastName, name (composed), category,
  price (fixed per category), timestamp, wantsToHelp
- `id` serves the payment matching service (section 6) as `ticketEntryRef`;
  `firstName`/`lastName` are needed there in addition to the composed `name` for
  the initial+surname match

**Responsibility**
- The sheet structure is fixed per event → direct column→field mapping,
  hardcoded in the first draft (no UI mapping tool)
- Column mapping (as of the current form):
  - `Zeitstempel` → `timestamp`
  - `Vorname` + `Nachname` → `firstName`, `lastName`, as well as the composed
    `name`
  - `Ticketkategorie (Preis pro Person inkl. Verpflegung)` → `category`
  - `Mitmachen` → `wantsToHelp` (feeds into the participant list and is also a
    valid aggregation criterion, see section 7)
  - `E-Mail-Adresse` → **ignored**, no field in the ticket model
- Price assignment: the price is **parsed out of the category label** with the
  pattern `/(\d+)\s*€/`, not looked up in a fixed table. The labels carry the
  price in their text, e.g. `4er / 5er Zimmer ➡️ 175€`
- The label is trimmed before parsing. A category with no parseable price throws
  an error — no default and no guessed value, consistent with the fail-loudly
  behaviour of sections 2/3
- Rationale: the category labels are maintained by hand in the Google Form, so
  wording and spacing change over time. A fixed price table breaks on every such
  edit, and breaks silently — parsing the label keeps a single source of truth in
  the form
- Consequence: new categories work without a code change, as long as the label
  contains a price. The trade-off is a dependency on the label format; if someone
  removes the price from a label, the sheet import fails loudly
- Provision of the list for the frontend (dashboard/aggregation) over the API

**Open questions**
- None open.

---

## 6. Payment matching service

**Model**
- Payment: ticketEntryRef (optional — empty when `unclearReason: name`), amount
  (optional — empty when `unclearReason: amount`), paidAt, status
  (**paid/unclear** — no `open`, see below), unclearReason (name/amount — only
  set when status=unclear), manuallyOverridden (bool)
- A Payment arises exclusively from a payment mail that actually arrived
  (section 3) — hence no `open` on this model; that state only exists as a
  derived value (see below)
- **Derived payment status per TicketEntry** (open/paid/unclear; consumed by
  sections 7/8/9, not stored directly on `Payment`):
  - `paid`, when at least one assigned Payment has `status: paid`
  - `unclear`, when no `paid` Payment exists but at least one with
    `unclearReason: amount` does
  - `open`, when no assigned Payment exists
  - Payments with `unclearReason: name` (no `ticketEntryRef`) remain visible as a
    separate list not assigned to any TicketEntry ("unassignable payments")

**Responsibility**
- Matching by name, **plain string matching is sufficient** (no fuzzy matching).
  A match exists when at least one of the following rules applies (comparison
  case-insensitive, whitespace trimmed/normalised):
  1. **Full name match**: `firstName + " " + lastName` (from the sheet) equals
     the name extracted from the mail
  2. **Initial+surname match**: the first letter of the first word in the mail
     name equals the first letter of the first name (sheet), AND the last word in
     the mail name equals the surname (sheet) — covers humorously deviating
     PayPal account names (e.g. "Felix Müller" → "Fuck Müller")
  - Assumption: PayPal names always consist of at least two words; a double first
    name is expected to appear as one concatenated word in the PayPal name, so it
    is automatically covered by rule 2. Other special cases (e.g. compound
    surnames such as "von Müller") are not handled separately for now.
- The amount is read automatically (see section 3) but does **not** feed into the
  automatic matching – checking the amount is done manually by a human. If the
  amount cannot be read unambiguously, it is not taken over (no guessed/best
  effort value)
- On ambiguity: the entry is marked "unclear" instead of being assigned
  automatically, with the reason in the field `unclearReason`:
  - `unclearReason: name` — no match, several matches, or the name from the mail
    is not parseable (so name matching is not unambiguously possible)
  - `unclearReason: amount` — name matching unambiguous, but the amount not
    unambiguously readable
  - If both cases apply simultaneously, `unclearReason: name` takes precedence
    (it blocks the actual assignment); an amount that is nevertheless readable is
    still stored
- Status manually overridable (e.g. correction by a helper) — lives only in the
  memory of the running process, no persistence (see trade-off below)
- Processes raw data from section 3 (mail), and therefore necessarily runs where
  that data is available: server-side
- The Payment↔TicketEntry relationship is **1:n without aggregation** – one
  TicketEntry can have several assigned Payments (e.g. double/partial payment);
  there is no automatic summing/threshold logic per TicketEntry; the human
  decides based on the individual entries
- Runs **automatically on every app start**, directly after the sheet fetch
  (section 2) and the mail query (section 3) – no manual trigger, consistent with
  the pattern of the two preceding services
- Matching candidates: all TicketEntries of the currently loaded event, no
  `event_id` filtering (fitting the current "one event only" scope, see
  section 3)

**Note / trade-off**
- Mail data and payment status are rebuilt from the mails on every app start (no
  persistence, see section 3) – a manual correction ("unclear" → "paid")
  therefore does not survive a restart of the server. Accepted for the MVP, since
  only very few mails/events occur so far; persistence can be added later if
  needed.

**Open questions**
- None open.

---

## 7. Aggregation service

**Responsibility**
- Generic: takes a TicketEntry field as the grouping criterion ("group by field
  X", e.g. `category` or `wantsToHelp`)
- Output: per distinct value one entry with a count + the list of the
  corresponding participants (`firstName`/`lastName` separately, not the composed
  `name` field)
- Format: an array of objects `{ value, count, entries: { firstName, lastName }[] }[]`;
  no sorting by the service — the processing order of the TicketEntries
- **Neither side sorts today.** The frontend renders groups and members in the
  order received (see the frontend spec, section 6.2), so the order follows
  sign-up order and can shift as new sign-ups arrive. Sort controls are deferred;
  when they arrive they belong in the frontend
- Runs server-side in the Node/Express backend, directly on the TicketEntries
  (section 5); the result is delivered over the REST API (section 9)

**Open questions**
- None open.

---

## 8. Finance service

**Responsibility**
- **Paid**: the summed price of all TicketEntries whose derived payment status
  (section 6, `determineTicketPaymentStatus`) is "paid"
- **Expected**: the summed price of **all** TicketEntries, regardless of payment
  status (open/unclear/paid) — corresponds to the full expected revenue if
  everyone who signed up pays
- The payment status is calculated by the finance service itself (internally
  using `PaymentMatchingService.determineTicketPaymentStatus`, section 6) — the
  caller passes only TicketEntries + Payments (raw data), analogous to the
  aggregation service (section 7)
- Return format: raw numbers (`{ paid: number, expected: number }`), rounded to 2
  decimal places (defensively against floating point summation) — no
  currency/text formatting in the backend, that is the frontend's job (see the
  "Interface to the frontend" section)
- Runs server-side in the Node/Express backend; the result is delivered over the
  REST API (section 9)

**Open questions**
- None open.

---

## 9. Dashboard data API

**Responsibility**
- The Node/Express backend provides the prepared dashboard data (participant
  overview, finance overview, later task status) over a **REST API**
- At app start: sheet data is re-fetched and the mail query is executed (see
  sections 2 + 3); aggregation (section 7) and finance figures (section 8) are
  calculated on that basis and delivered over the API
- The fixed order of the widgets is determined by the Angular frontend (see the
  frontend spec):
  - Top left: participant overview
  - Top right: finance overview
  - Below: further widgets (task status etc., later)

**Endpoints**
- `GET /dashboard/participants?groupBy=<category|wantsToHelp>` — delivers the
  participant overview as an aggregation (section 7) over the field chosen via
  query parameter. `groupBy` is mandatory and checked against a fixed whitelist
  (`category`, `wantsToHelp`); a missing or invalid value returns
  `400 Bad Request`.
- `GET /dashboard/finance` — delivers the finance overview
  (`{ paid, expected }`, section 8) without parameters.
- One endpoint per widget (instead of a single aggregated `/dashboard`), so the
  frontend can load widgets independently; for further widgets in the future
  (task status etc.), another endpoint is added following the same pattern.
- Each endpoint is its own feature router (`features/participants/`,
  `features/finance/`, see "Code structure"), mounted in `app.ts`. There is no
  central dashboard service bundling them.

**Data storage / bootstrap**
- The sheet fetch, mail query, and payment matching run once in
  `loadEventData()` (`core/event-data/`) before the HTTP server starts
  (`app.listen`); the result, an `EventData` snapshot (TicketEntries +
  Payments), afterwards lives only in the process's memory (see sections 2/3)
  and is handed to every feature router — no re-fetch per request
- If the bootstrap fails (sheet or mail unreachable, see error behaviour in
  sections 2/3), the server does not start (process abort) — there is never a
  reachable server without a data state
- `event_id`: since the event service is deferred (section 1), a fixed
  placeholder value is used in `loadEventData()`
- Tasks are the first feature with data written at runtime rather than read at
  startup; they are persisted in the database (sections 10 and 11), not in
  `EventData`

**Technical implementation**
- Framework: **Express**, CORS via the `cors` middleware without origin
  restriction (fits the core-team-only/no-access-control scope, ADR-003)
- Server port configurable via the environment variable `PORT`, with a default
  fallback
- Endpoint tests via **`supertest`** against the Express app (without a real
  server/port)

**Open questions**
- None open.

---

## 10. Database

See [ADR-005](../adr/ADR-005-persistence.md).

- `core/database/`: `openDatabase({ dataDir?, migrations? })` opens PGlite through
  Kysely (`kysely-pglite-dialect`) and applies pending migrations. Without
  `dataDir` the database is in memory (tests)
- Data folder: env variable `DATABASE_DIR`, default `backend/data/`, excluded
  from git
- Startup: `server.ts` opens the database alongside `loadEventData()`; the
  server only listens once both succeed. A failing migration aborts startup.
  Ctrl+C / SIGTERM closes the database cleanly
- Schema: one interface per table in `database.types.ts`; migrations as
  TypeScript files (`up`/`down`) listed explicitly in `migrations/index.ts`,
  named `NNNN-description` and applied in that order
- Tables: see the tasks design, "Data model"
- Moving to a PostgreSQL server later: swap the dialect for Kysely's
  `PostgresDialect` with `pg` and a connection string; queries stay unchanged

---

## 11. Tasks API

Feature router `features/tasks/`, mounted in `app.ts` with the database.
Responses are aggregated by the backend and shaped for the view.

**Endpoints**

```
GET /tasks/all
→ 200  [{ "id": 1, "title": "Getränke besorgen", "description": "50 Kisten Wasser …" }]

POST /tasks
   body { "title": "Getränke besorgen", "description": "50 Kisten Wasser …" }
→ 201  { "id": 1, "title": "Getränke besorgen", "description": "50 Kisten Wasser …" }
→ 400  { "error": "title and description are required" }
```

- `GET /tasks/all` returns all tasks of the event (`EVENT_ID`), newest first
- `POST /tasks` returns `400` when `title` or `description` is missing, not a
  string, or only whitespace. Values are trimmed before saving
- Creating a task writes the task and its first update (the brief, `author_id`
  null, same text as the description) in one transaction
- There is no endpoint to edit or delete an update; that keeps the brief
  immutable
- Later tickets extend the task object: `helperNames: string[]` (02), the
  update thread (03), further fields (05), `status` (06)

---

## Interface to the frontend

The dashboard frontend is a standalone Angular application (client-side rendered,
no SSR, see [ADR-004](../adr/ADR-004-backend-stack-dashboard.md)). It obtains the
prepared data over the REST API (section 9) from the Node/Express backend.
Business logic (aggregation, finance calculation, Google Sheet/mail integration)
stays entirely server-side; the frontend handles pure presentation/interaction.

---

## Design thinking & lean notes (backend)

- **Fake it before you build it**: Google Forms/Sheets as the ticketing solution
  is already the lean MVP – it validates the need before a dedicated ticket
  database is built.
- **Test mail matching manually first**: before automated matching (section 6),
  check the procedure by hand on 1–2 real events (Wizard of Oz principle).
- **Smallest slice first**: pure read integration before write logic/automation.
- **Roles deliberately later**: no access control/roles in the MVP (section 1) –
  introduce the role model only when the app is released to helpers
  (build-measure-learn instead of upfront overengineering).
