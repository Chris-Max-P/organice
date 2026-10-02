# Specification: Event Overview & Dashboard – Frontend

---

## Architecture note

This dashboard is part of the admin tool, not the end-user PWA — see
[ADR-003](../adr/ADR-003-admin-dashboard-trennung.md). It runs locally for the
core team only, without PWA requirements (offline, manifest, service worker).

Aggregation, finance calculation, and the Google Sheet / mail integrations stay
server-side in the Node/Express backend (backend spec, sections 2–9). The
frontend fetches prepared data over REST/HTTP and handles presentation and
interaction only. It contains no business logic.

Mails are already fetched server-side on every backend start (backend spec,
section 3), so no manual "fetch mails" button is needed.

### One application for the core team, growing by feature

This frontend is the core team's application, not a single-purpose dashboard.
Further features land here as additional feature folders (section 3) — the next
one is the organiser side of tasks (see
[docs/design/tasks.md](../design/tasks.md)). Helpers will get their own app or
at least their own view onto the same application; which of the two is decided
when the helper side is specified, not here.

### Interim deviation from ADR-004

[ADR-004](../adr/ADR-004-backend-stack-dashboard.md) specifies an **Angular
application** as the dashboard frontend. That decision still stands as the
target.

This iteration is built as **plain HTML, CSS, and JavaScript instead**, because
Angular 22 requires Node `^22.22.3 || ^24.15.0 || >=26` and the development
machine currently runs Node v21.5.0, which the Angular CLI refuses. Rather than
block the frontend entirely, the prototype is built without a framework and
without a build step.

Nothing about the split between frontend and backend changes: the same two REST
endpoints, the same server-side business logic, the same secrets boundary. Only
the rendering technology differs, and only temporarily. Section 11 describes the
migration.

---

## 1. Scope

This is a **prototype**. It covers two widgets against the two existing
endpoints. It deliberately does not solve sorting, filtering, refresh, or
multi-event support.

Out of scope for this iteration, listed under section 11 (Future work):
sort controls, refresh, the tasks feature, a real mobile pass, authentication,
and the migration to Angular.

---

## 2. Stack

- **Plain HTML, CSS, and JavaScript.** No framework, no build step, no bundler,
  no transpiler, no `node_modules` in the frontend.
- **ES modules** (`<script type="module">`) with direct imports between files —
  no global script registration, no namespace objects. Module scripts are subject
  to CORS, so the frontend must be served over HTTP; it will not run from a
  `file://` URL (see section 10).
- **No dependencies.** Everything needed is in the platform: `fetch` for HTTP,
  `Intl.NumberFormat` for currency formatting, `<details>`/`<summary>` for
  expandable rows, CSS grid for layout.
- **No UI component library**, as before. The data is small and already
  aggregated server-side.

Browser target: whichever current browser the core team uses. There is no
transpilation, so the code may use modern syntax directly.

---

## 3. Project structure

The code is organised by feature, with a `core/ shared/ features/` split that
mirrors the Angular structure of
[ADR-002](../adr/ADR-002-projektstruktur.md), so the migration (section 11) maps
folder to folder.

```
frontend/
  index.html                    # page shell: header + one empty dashboard container
  styles.css                    # design tokens, base, page layout; @imports all module CSS
  src/
    main.js                     # entry point: list of widgets, one container each, mounts them
    core/                       # app-wide plumbing, no UI
      config.js                 # API base URL
      http.js                   # getJson(): fetch + response.ok check + JSON
    shared/                     # reusable, feature-agnostic UI and helpers
      format.js                 # de-DE currency and count formatting
      widget-card/
        widget-card.js          # card chrome + loading/error/empty states
        widget-card.css
      segmented-control/
        segmented-control.js    # button group with one active option
        segmented-control.css
    features/
      participants/
        participants.api.js     # fetchParticipants + response typedefs
        participants-widget.js
        participants.css
      finance/
        finance.api.js          # fetchFinanceSummary + response typedefs
        finance-widget.js
        finance.css
```

**Dependency rules**

- `features/*` may import from `shared/` and `core/`. A feature **never imports
  from another feature**. If two features need the same thing, it moves to
  `shared/` (UI, helpers) or `core/` (plumbing).
- `shared/` imports only from `core/` and contains nothing domain-specific.
- `core/` imports nothing from `shared/` or `features/`.
- Something used by one feature only stays in that feature until a second one
  needs it.

**A feature owns** its endpoint calls and response typedefs (`<feature>.api.js`),
its UI modules, and its CSS. Class names are prefixed with the feature name
(`participants__…`, `finance__…`), following the existing BEM-style convention.

**Adding a feature**: create `src/features/<name>/`, add its CSS to the `@import`
list at the top of `styles.css`, and add its `mount` function to the `WIDGETS`
list in `main.js`. Nothing else changes.

`frontend/` is a standalone folder alongside `backend/`. It has no
`package.json` and no dependencies of its own — the files are served exactly as
they are written.

---

## 4. Backend interface

Consumed endpoints (backend spec, section 9). The base URL lives in
`core/config.js` as a single exported constant, defaulting to `http://localhost:3000`. The backend
already sends permissive CORS headers, so no proxy is involved.

| Endpoint | Response |
|---|---|
| `GET /dashboard/participants?groupBy=category\|wantsToHelp` | `{ value, count, entries: { firstName, lastName }[] }[]` |
| `GET /dashboard/finance` | `{ paid: number, expected: number }` |

**Data access**: `core/http.js` exports `getJson(path)`, which wraps `fetch`,
checks `response.ok`, and returns parsed JSON. Each feature's `<feature>.api.js`
exports one async function per endpoint on top of it. A non-2xx response or a
network failure throws; the calling widget catches it and renders the error
state (section 7).

There is no mock layer and no fixture mode. Viewing the dashboard requires a
running backend.

**Response shapes** are documented here and as JSDoc `@typedef` comments in each
feature's `<feature>.api.js`, which give editor autocompletion without a build
step. They mirror the backend types in
`backend/src/features/participants/aggregation.types.ts` and
`backend/src/features/finance/finance.types.ts`; keep them in sync by hand.

---

## 5. Layout

Page title: "Organice Dashboard", used as both `<title>` and the page heading.

Fixed widget order:

- Top left: participant overview
- Top right: finance overview
- Below: further widgets (task status etc., later)

Two-column CSS grid, collapsing to a single column below ~900px. Widgets are
full width when stacked. Interactive elements use tap targets of at least 44px.

This is a desktop-first prototype. Mobile must not break, but there is no
separate mobile design. A real mobile pass is expected later and the participant
table is the part most likely to need it.

---

## 6. Widgets

Each widget module exports a `mount(container)` function that renders itself into
the given element and starts loading its data. `main.js` holds the ordered
`WIDGETS` list, creates one container per entry inside `#dashboard`, and calls
each `mount`. There is no shared state and no communication between widgets.

### 6.1 Widget card (shared)

`shared/widget-card/widget-card.js` provides the chrome shared by every widget: the title, the card
frame, and the three states from section 7. It exports a factory returning the
card element together with the functions that switch its body between states:

- `showLoading()`
- `showError(message)`
- `showEmpty(message)`
- `showContent(node)`

Widgets build their own content nodes and hand them over. They never implement
state handling themselves, so a new widget gets correct loading, error, and empty
behaviour for free.

The card header also has a **controls slot**, filled via `setControls(node)`.
Controls live outside the body, so they survive every state change — the
participant grouping switch stays usable after an error, which it would not if it
were part of the content node.

### 6.2 Participant overview

Card title: "Teilnehmerübersicht".

- **Grouping switch**: the shared segmented control
  (`shared/segmented-control/`) with two options, `category`
  (labelled "Kategorie") and `wantsToHelp` (labelled "Helfer"), defaulting to
  `category`. Clicking re-requests the endpoint. Responses that arrive after the
  grouping has changed again are discarded, so a slow request cannot overwrite a
  newer one; the buttons stay enabled throughout.
- **Total**: the summed count across all groups, shown above the list as
  "Gesamt: 42".
- **Group rows**: one `<details>` element per group. The `<summary>` shows the
  group value and its count; the member list (`firstName lastName`) sits inside
  and appears when expanded. The native element supplies the toggle behaviour and
  keyboard accessibility without any JavaScript.
- **Expansion**: multiple groups may be open simultaneously — the default
  behaviour of independent `<details>` elements. All start collapsed. The list is
  rebuilt when the grouping field changes, so expansion state resets, which is
  correct because the groups are then entirely different.
- **No sorting.** Groups and members render in the order the backend returns.
- **Group labels are rendered raw.** Category values contain the price and an
  emoji (e.g. `4er / 5er Zimmer ➡️ 175€`). These labels are maintained by hand in
  the Google Form and their formatting is known to drift, so the frontend does
  not parse or shorten them.
- **Empty group value**: `wantsToHelp` is an empty string when a participant left
  the field blank, which produces a group with a blank label. Render an empty
  value as "Keine Angabe". This is a display fallback only. Grouping by category
  cannot hit this case — the backend throws on categories without a parseable
  price.

All text is inserted via `textContent`, never `innerHTML`. Group values and
participant names come from a spreadsheet that people type into freely, and
without a framework there is no automatic escaping.

### 6.3 Finance overview

Card title: "Finanzübersicht".

- Shows exactly two figures: **Bezahlt** (`paid`) and **Erwartet** (`expected`).
- No outstanding amount, no progress bar, no percentage.
- Formatted as EUR in `de-DE` (`1.234,50 €`) via
  `new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })`,
  created once in `shared/format.js` and reused. The backend returns raw numbers; all
  formatting is the frontend's responsibility.

---

## 7. Loading, error, and empty states

Both widgets load independently from their own endpoint, so each renders its own
state.

- **Loading**: the text "Wird geladen …" inside the widget body. No spinner and
  no skeleton — a skeleton would have to be shaped per widget, which would move
  the loading state out of `widget-card.js` and into every widget.
- **Error** (network failure or non-2xx): an explicit error message inside the
  widget — "Daten konnten nicht geladen werden". Never a silent blank; this
  mirrors the backend's fail-loudly stance (backend spec, sections 2, 3, 9).
  **No automatic retry** and no retry button, consistent with section 8.
- **Empty** (2xx with no data): a distinct, neutral message — "Noch keine
  Anmeldungen" — clearly different from the error state.

Only the participant overview can be empty, when the endpoint returns no groups.
The finance endpoint always returns two numbers, so `0,00 €` for both is valid
data rather than emptiness; the finance widget renders its two figures and never
calls `showEmpty()`.

The error state is not an edge case. The backend exits on bootstrap failure
(backend spec, section 9), so whenever it fails to start, the frontend still
serves and both widgets show this state.

---

## 8. Refresh behaviour

There is **no refresh UI**. Data loads when the page opens.

The backend reads the Google Sheet and the mailbox once, during its own startup,
and holds the result in memory (backend spec, sections 2, 3, 9). Reloading the
browser therefore re-requests the same data; new sign-ups or payments only
appear after the backend is restarted.

A refresh button would imply a freshness it cannot deliver. Both a refresh
control here and matching re-fetch logic in the backend are planned — see
section 11.

---

## 9. Testing

**There are no automated frontend tests in this iteration.**

The test plan depends on the Angular toolchain — test runner, component testing
utilities, HTTP testing provider — none of which is available without a supported
Node version. Standing up a separate test stack for code that is explicitly
interim would be wasted work.

Tests are written once the Angular setup runs, as part of that migration (see
section 11). Until then the frontend is verified by hand against a running
backend.

The backend keeps its existing test suite; nothing here changes it.

---

## 10. Local development

**Backend**: `npm start` in `backend/` (`tsx src/server.ts`). No watch mode — a
restart re-fetches the sheet and rescans the mailbox, so restarts stay manual and
deliberate. Node v21 runs the backend fine; only Angular requires a newer
version.

**Frontend**: no build, no install, no watch. Edit a file, reload the browser.

The frontend does need to be **served over HTTP** rather than opened as a file,
because ES module imports are blocked under the `file://` origin. Any static
server works:

```bash
npx serve frontend
```

An IDE live preview or built-in web server does the same job. Either way the
frontend is served from a different origin than the backend, which the backend's
permissive CORS configuration already allows.

The frontend needs no credentials of its own: the service account keyfile and
mailbox access live entirely in the backend. Viewing the dashboard in a browser
does require a running backend, and the backend does not start without valid
credentials.

---

## 11. Future work

Explicitly deferred, in rough order of expected need:

- **Migration to Angular**, restoring
  [ADR-004](../adr/ADR-004-backend-stack-dashboard.md). Requires Node
  `^22.22.3 || ^24.15.0 || >=26`. The structure in section 3 is deliberately
  shaped to map onto it: `core/`, `shared/` and `features/` keep their names,
  each `<feature>.api.js` becomes an injectable service in its feature folder,
  `core/http.js` is replaced by `HttpClient`, each widget module becomes a
  standalone component, `widget-card.js` becomes a component with content
  projection, and `format.js` is replaced by `CurrencyPipe`. The REST contract
  and the UI behaviour carry over unchanged.
- **Automated tests** (section 9), written as part of that migration.
- **Refresh**: a refresh button in the frontend plus re-fetch logic in the
  backend (currently data is only read at backend startup).
- **Sorting**: sort controls for groups and members. Neither side sorts today, so
  group order follows sign-up order and may shift as new sign-ups arrive.
- **Tasks feature** (organiser side, [docs/design/tasks.md](../design/tasks.md)):
  a new `features/tasks/` folder. It is the first feature that needs more than a
  widget (a full task list, creating a task), so it will also bring the first
  page-level navigation; that shell belongs in `core/` and is specified together
  with the feature.
- **Further widgets**: each with its own feature folder and endpoint, following
  the existing pattern.
- **Mobile pass**: a genuine responsive design, starting with the participant
  table.
- **UI component library**: revisit if a widget needs real grid features.
