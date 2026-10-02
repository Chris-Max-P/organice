# ADR-001: Frontend stack for the event organisation app

## Status
Accepted

## Scope
Applies exclusively to the **end-user app** (participants, helpers). The admin
dashboard is separate from this and is under no obligation to be a PWA — see
[ADR-003](./ADR-003-admin-dashboard-trennung.md).

## Context
The app should run on iOS, Android, and in the browser (desktop/mobile). The
development team has Angular experience. Implementation follows a design
thinking process with fast prototype/test cycles.

## Decision
**Angular as a PWA**, with optional later extension via **Capacitor** to native
iOS/Android apps.

- Start: Angular + `@angular/pwa` (service worker, manifest)
- If needed: Capacitor wrapper around the same codebase for app store
  distribution

## Rationale
- Uses existing Angular expertise, no new framework needed
- A PWA allows fast iteration without app store review — fits the design
  thinking cycles (prototype/test)
- No rewrite needed should native stores become relevant later (Capacitor wraps
  the existing code)
- Low entry cost; investment in native complexity only after validation

## Rejected alternatives
- **React Native + Next.js** — rejected, as the team's know-how is in Angular,
  not React
- **NativeScript + Angular** — rejected: genuine native rendering, but a smaller
  community/plugin base and no web code sharing (a separate codebase for web
  would be needed)
- **Ionic + Angular + Capacitor (immediately, without the PWA step)** — rejected
  for the start: more initial complexity (native builds, store process) without
  the product/feature set being validated yet
- **Flutter** — rejected: no Angular/TypeScript, separate code for web and mobile

## Consequences
- The PWA's iOS limitations (push only from iOS 16.4, no store listing) are
  accepted for now
- The migration path to native apps stays open, without committing early
