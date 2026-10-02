# ADR-003: Separation of end-user PWA and admin dashboard

## Status
Accepted

## Context
The app has two distinct user groups with different requirements:
- **End users** (participants, helpers) — use the app on various devices,
  distributed, see [ADR-001](./ADR-001-frontend-stack.md).
- **Administrators/core team** — use the event dashboard (participant overview,
  finance figures, Google Sheet and mail integration) exclusively locally.
  According to the backend spec, the dashboard is core-team-only anyway, without
  roles or access control for now.

ADR-001 specifies a PWA for the end-user app (offline capability, manifest,
service worker, potentially app store distribution via Capacitor). None of these
properties are required for a dashboard used locally by an administrator.

## Decision
The admin dashboard is built as a **standalone, backend-style tool** — separate
from the end-user PWA:
- Runs locally for the administrator/core team, not distributed to end users
- No PWA obligation (no manifest, service worker, or offline requirement)
- Consists of a Node/Express backend (aggregation, finance figures, Google
  Sheet/mail integration) and a separate Angular frontend that fetches the data
  over REST — no SSR, see [ADR-004](./ADR-004-backend-stack-dashboard.md)

ADR-001 (Angular PWA) applies exclusively to the end-user app.

## Rationale
- Avoids unnecessary PWA complexity for a tool used locally by one person or a
  small team
- Fits the core-team-only scope of the backend spec — no access control needed,
  since there is no external access from distributed devices
- Decouples release cycles: dashboard changes require no rollout to end-user
  devices

## Rejected alternatives
- **Dashboard as an admin route within the same PWA** — rejected: mixes end-user
  and admin interfaces, and would require access control that purely local
  operation does not currently need

## Consequences
- Two separate application parts in the repository (end-user PWA, admin
  dashboard) — the project structure
  ([ADR-002](./ADR-002-projektstruktur.md)) is to be extended accordingly once
  folders are actually split
- For the concrete framework choice for the dashboard backend, see
  [ADR-004](./ADR-004-backend-stack-dashboard.md)
