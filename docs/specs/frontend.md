# Frontend setup

How the core team's frontend is set up. Feature behaviour lives in the design
docs and the feature specs (e.g. [dashboard-frontend.md](./dashboard-frontend.md)).

---

## Architecture note

This frontend is the core team's application (the admin tool), not the end-user
PWA — see [ADR-003](../adr/ADR-003-admin-dashboard-trennung.md). It runs locally
for the core team only, without PWA requirements (offline, manifest, service
worker).

Business logic stays server-side in the Node/Express backend
([backend.md](./backend.md)). The frontend fetches prepared data over REST/HTTP
and handles presentation and interaction only.

The application grows by feature: each feature is a feature folder (see
"Project structure") and, if it is a page of its own, a menu item. Helpers get
their own app, the end-user PWA of [ADR-001](../adr/ADR-001-frontend-stack.md),
which talks to the same backend; it is not part of this application.

### Interim deviation from ADR-004

[ADR-004](../adr/ADR-004-backend-stack-dashboard.md) specifies an **Angular
application** as the frontend. That decision still stands as the target.

This iteration is built as **plain HTML, CSS, and JavaScript instead**, because
Angular 22 requires Node `^22.22.3 || ^24.15.0 || >=26` and the development
machine currently runs Node v21.5.0, which the Angular CLI refuses. Rather than
block the frontend entirely, the prototype is built without a framework and
without a build step.

Nothing about the split between frontend and backend changes: the same REST
endpoints, the same server-side business logic, the same secrets boundary. Only
the rendering technology differs, and only temporarily.

---

## Stack

- **Plain HTML, CSS, and JavaScript.** No framework, no build step, no bundler,
  no transpiler, no `node_modules` in the frontend.
- **ES modules** (`<script type="module">`) with direct imports between files —
  no global script registration, no namespace objects. Module scripts are subject
  to CORS, so the frontend must be served over HTTP; it will not run from a
  `file://` URL (see "Local development").
- **No dependencies.** Everything needed is in the platform: `fetch` for HTTP,
  `Intl.NumberFormat` for formatting, `<details>`/`<summary>` for expandable
  rows, CSS grid for layout.
- **No UI component library.** The data is small and already prepared
  server-side.

Browser target: whichever current browser the core team uses. There is no
transpilation, so the code may use modern syntax directly.

---

## Project structure

The code is organised by feature, with a `core/ shared/ features/` split that
mirrors the Angular structure of
[ADR-002](../adr/ADR-002-projektstruktur.md), so a later migration maps folder
to folder.

```
frontend/
  index.html                    # page shell: header with menu + one empty page container
  styles.css                    # design tokens, base, page layout; @imports all module CSS
  src/
    main.js                     # entry point: registers the pages with the router
    core/                       # app-wide plumbing, no UI
      config.js                 # API base URL
      http.js                   # getJson(), postJson()
      router.js                 # hash router
    shared/                     # reusable, feature-agnostic UI and helpers
    features/
      participants/             # dashboard-frontend.md
      finance/                  # dashboard-frontend.md
      tasks/                    # tasks page
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
list at the top of `styles.css`, and either add its `mount` function to the
dashboard's widget list (a widget, see
[dashboard-frontend.md](./dashboard-frontend.md)) or register it as a page with
the router in `main.js` and add a menu link in `index.html` (a page). Nothing
else changes.

`frontend/` is a standalone folder alongside `backend/`. It has no
`package.json` and no dependencies of its own — the files are served exactly as
they are written.

---

## Backend access

The base URL lives in `core/config.js` as a single exported constant, defaulting
to `http://localhost:3000`. The backend already sends permissive CORS headers, so
no proxy is involved.

`core/http.js` exports `getJson(path)` and `postJson(path, body)`, which wrap
`fetch`, check `response.ok`, and return parsed JSON. Each feature's
`<feature>.api.js` exports one async function per endpoint on top of it. A
non-2xx response or a network failure throws; the caller catches it and renders
an error state.

There is no mock layer and no fixture mode. Using the frontend requires a
running backend.

**Response shapes** are documented as JSDoc `@typedef` comments in each
feature's `<feature>.api.js`, which give editor autocompletion without a build
step. They mirror the backend's `*.types.ts` files of the same feature; keep
them in sync by hand.

---

## Navigation

- A menu in the page header, one item per page. The active item is highlighted
- `core/router.js`: a hand-written hash router. `#/` (and an empty or unknown
  hash) shows the dashboard; each further page registers its own path (e.g.
  `#/aufgaben`). It listens to `hashchange`, so the back button, refresh and
  bookmarks work without server configuration
- `main.js` registers the pages with the router. Each page is mounted into the
  page container when shown

---

## Rendering untrusted text

All text from the backend is inserted via `textContent`, never `innerHTML`.
Much of it comes from free text people typed (form answers, task titles), and
without a framework there is no automatic escaping.

---

## Testing

**There are no automated frontend tests in this iteration.**

The test plan depends on the Angular toolchain — test runner, component testing
utilities, HTTP testing provider — none of which is available without a supported
Node version. Standing up a separate test stack for code that is explicitly
interim would be wasted work. Until then the frontend is verified by hand against
a running backend.

---

## Local development

No build, no install, no watch. Edit a file, reload the browser.

The frontend does need to be **served over HTTP** rather than opened as a file,
because ES module imports are blocked under the `file://` origin. Any static
server works:

```bash
npx serve frontend
```

An IDE live preview or built-in web server does the same job. Either way the
frontend is served from a different origin than the backend, which the backend's
permissive CORS configuration already allows.

The frontend needs no credentials of its own; they live entirely in the backend
([backend.md](./backend.md), "Secrets"). The backend does not start without
valid credentials.
