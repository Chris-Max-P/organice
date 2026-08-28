# ADR-004: Backend stack for the admin dashboard

## Status
Accepted

## Context
[ADR-003](./ADR-003-admin-dashboard-trennung.md) separates the admin dashboard
from the end-user PWA, but does not yet fix the concrete technology. The options
for the server-side Google Sheet/mail integration were:
- Server-side code within an Angular SSR app (`@angular/ssr`)
- A standalone Node/Express backend, decoupled from Angular

The backend spec (section 2, Google integration service) requires the sheet link
(a secret) and Google sheet access to stay strictly server-side and never end up
in the frontend bundle. With Angular SSR, this separation is not structurally
enforced but has to be actively ensured through the build setup — with the risk
that server-only code accidentally lands in the client bundle.

## Decision
The admin dashboard consists of two separate parts:
- A **standalone Node/Express backend** that holds all secrets as well as the
  Google Sheet and mail integration, and provides the prepared data over a
  **REST API**
- An **Angular application as the dashboard frontend** (client-side rendered, no
  SSR, no PWA obligation per ADR-003), which fetches this data over REST/HTTP
  from the backend and displays it

There is no server-side rendering — the Node/Express backend serves exclusively
JSON over REST, never pre-rendered HTML pages.

## Rationale
- Secrets (sheet link, mail credentials) are structurally separated from the
  Angular frontend: Angular runs purely client-side in the browser and never gets
  access to the server-side integration logic, only to the REST responses
- Uses the existing Angular expertise for the dashboard frontend as well
  (cf. [ADR-001](./ADR-001-frontend-stack.md))
- Node/Express stays responsible for the actual integration logic — less setup
  effort for sheet/mail access than Angular SSR, and it fits the lean/MVP
  approach of the specs ("smallest slice first")

## Rejected alternatives
- **Angular SSR** (server-side code directly in the Angular app) — rejected:
  additional risk that server-only code (secrets, `imapflow`) accidentally ends
  up in the client bundle; no advantage over separate parts, since the UI is not
  shared with the end-user PWA anyway (ADR-003)
- **Server-side rendered HTML pages** (e.g. a template engine such as EJS)
  instead of a REST API — rejected in favour of an Angular SPA for the dashboard
  frontend

## Consequences
- Node/Express serves only JSON over REST endpoints; for the concrete structure
  of the endpoints see the backend spec, section 9
- No code sharing (components/templates) between the end-user PWA and the
  dashboard; TypeScript interfaces/models can still be shared if needed. The
  dashboard frontend currently copies the three response interfaces rather than
  extracting a shared package — see the frontend spec, section 4
- Sheet data needs no persistence: it is loaded fresh from the sheet on every app
  start and only held in memory (see backend spec, section 2)
- Payment status likewise needs no persistence: it is rebuilt from the mails on
  every app start (see backend spec, section 6). Consequence: manual corrections
  do not survive a restart, accepted for the MVP given the currently low mail
  volume
- The dashboard backend therefore needs no database or persistence layer for now
- No manual "fetch mails" button is needed, since mails are re-fetched on every
  app start anyway
