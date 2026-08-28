# Specification: Event Overview & Dashboard – Frontend

---

## Architecture note

This dashboard is part of the admin tool, not the end-user PWA — see
[ADR-003](../adr/ADR-003-admin-dashboard-trennung.md). It runs locally for the
core team only, without PWA requirements (offline, manifest, service worker).

The dashboard is a standalone **Angular application** (client-side rendered, no
SSR) — see [ADR-004](../adr/ADR-004-backend-stack-dashboard.md). Aggregation,
finance calculation, and the Google Sheet / mail integrations stay server-side
in the Node/Express backend (backend spec, sections 2–9). The frontend fetches
prepared data over REST/HTTP and handles presentation and interaction only. It
contains no business logic.

Mails are already fetched server-side on every backend start (backend spec,
section 3), so no manual "fetch mails" button is needed.

---

## 1. Scope

This is a **prototype**. It covers two widgets against the two existing
endpoints. It deliberately does not solve sorting, filtering, refresh, or
multi-event support.

Out of scope for this iteration, listed under section 10 (Future work):
sort controls, refresh, task-status widgets, a real mobile pass, authentication.

---

## 2. Stack

- **Angular 22**, standalone components, signals. No router (single view; trivial
  to add later), no SSR, no PWA, no authentication.
- **No UI component library.** Layout is plain CSS with CSS grid; the participant
  list is a hand-rolled table. The data is small and already aggregated
  server-side, so a grid library would not earn its dependency here. Choosing one
  (DevExtreme, Angular Material) is an open decision, deferred until a widget
  actually needs grid features.
- Test runner and tooling follow the Angular CLI defaults.

---

## 3. Project structure

```
frontend/src/app/
  app.component.ts                    # shell
  app.config.ts                       # provideHttpClient, LOCALE_ID, locale data
  dashboard/
    dashboard-page.component.ts       # CSS grid layout, hosts the widgets
    api/
      dashboard-api.service.ts        # HttpClient calls against the REST API
      dashboard.models.ts             # response interfaces
    widgets/
      widget-card/                    # shared chrome + loading/error/empty states
      participants-widget/
      finance-widget/
```

`frontend/` is a standalone project alongside `backend/`, with its own
`node_modules`. No npm workspaces — ADR-003/004 keep the two applications
deliberately separate, and Angular's toolchain works best undisturbed.

---

## 4. Backend interface

Consumed endpoints (backend spec, section 9). Base URL comes from
`environment.ts` (`apiBaseUrl`, default `http://localhost:3000`). No dev proxy —
the backend already sends permissive CORS headers.

| Endpoint | Response |
|---|---|
| `GET /dashboard/participants?groupBy=category\|wantsToHelp` | `{ value, count, entries: { firstName, lastName }[] }[]` |
| `GET /dashboard/finance` | `{ paid: number, expected: number }` |

**Models** are copied into `dashboard.models.ts` with a comment pointing at
backend spec sections 7–9. Three trivial interfaces do not justify a shared
package build step; if the shared surface grows, extracting a shared package is
the intended next step (see [ADR-004](../adr/ADR-004-backend-stack-dashboard.md),
"Konsequenzen").

**Data access**: `DashboardApiService` calls `HttpClient` directly — there is no
mock layer or fixture mode. Components consume the service through
`rxResource` (`@angular/core/rxjs-interop`), which supplies the loading, error,
and value states described in section 7 and re-runs when the grouping field
signal changes. If `rxResource` is not stable in Angular 22, fall back to
`toSignal` with explicit state handling.

Keeping HTTP behind the service keeps components free of URL construction and
makes both independently testable.

---

## 5. Layout

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

### 6.1 Widget card (shared)

`WidgetCardComponent` provides the chrome shared by every widget: a title, the
card frame, and the three states from section 7. Widgets project their own
content and never implement state handling themselves. New widgets get correct
loading, error, and empty behaviour for free.

### 6.2 Participant overview

- **Grouping switch**: a segmented control between `category` and `wantsToHelp`,
  defaulting to `category`. Switching re-requests the endpoint.
- **Total**: the summed count across all groups, shown above the list.
- **Group rows**: one row per group showing the group value and its count.
  Clicking a row expands the member list (`firstName lastName`) beneath it.
- **Expansion**: multiple groups may be open simultaneously. All groups start
  collapsed. Expansion state resets when the grouping field changes, because the
  groups are then entirely different.
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

### 6.3 Finance overview

- Shows exactly two figures: **Bezahlt** (`paid`) and **Erwartet** (`expected`).
- No outstanding amount, no progress bar, no percentage.
- Formatted as EUR in `de-DE` (`1.234,50 €`) via `CurrencyPipe`, with
  `LOCALE_ID` set to `de-DE` and German locale data registered. The backend
  returns raw numbers; all formatting is the frontend's responsibility.

---

## 7. Loading, error, and empty states

Both widgets load independently from their own endpoint, so each renders its own
state.

- **Loading**: a skeleton or spinner inside the widget body.
- **Error** (network failure or non-2xx): an explicit error message inside the
  widget — "Daten konnten nicht geladen werden". Never a silent blank; this
  mirrors the backend's fail-loudly stance (backend spec, sections 2, 3, 9).
  **No automatic retry** and no retry button, consistent with section 8.
- **Empty** (2xx with no data): a distinct, neutral message — "Noch keine
  Anmeldungen" — clearly different from the error state.

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
section 10.

---

## 9. Local development

Both applications run in parallel, started from a root `package.json` using
`concurrently`. The root package exists only for orchestration and holds no
shared dependencies.

- **Frontend**: `ng serve`, hot module replacement on change.
- **Backend**: `npm start` (`tsx src/server.ts`). **No watch mode** — a restart
  re-fetches the sheet and rescans the mailbox, so restarts stay manual and
  deliberate.

The frontend needs no credentials of its own: the service account keyfile and
mailbox access live entirely in the backend. Viewing the dashboard in a browser
does require a running backend, and the backend does not start without valid
credentials.

### Testing

- **Participant widget**: renders groups, expanding a row reveals members,
  switching the grouping field triggers a reload, all three states render.
- **Finance widget**: both figures render with `de-DE` EUR formatting, all three
  states render.
- **`DashboardApiService`**: correct URL and `groupBy` query parameter.
- **Not tested**: `AppComponent` and the grid layout of `DashboardPageComponent`
  — CSS placement is not meaningfully unit-testable.

HTTP is tested with `provideHttpClientTesting`; no backend is involved. No
mocking framework is used at this size — standalone components and the testing
HTTP provider are sufficient. `ng-mocks` may be introduced later where it
genuinely reduces complexity.

---

## 10. Future work

Explicitly deferred, in rough order of expected need:

- **Refresh**: a refresh button in the frontend plus re-fetch logic in the
  backend (currently data is only read at backend startup).
- **Sorting**: sort controls for groups and members. Neither side sorts today, so
  group order follows sign-up order and may shift as new sign-ups arrive.
- **Further widgets**: task status and others, each with its own endpoint
  following the existing pattern.
- **Mobile pass**: a genuine responsive design, starting with the participant
  table.
- **UI component library**: revisit if a widget needs real grid features.
- **Shared model package**: if the interfaces shared with the backend grow beyond
  a handful.
