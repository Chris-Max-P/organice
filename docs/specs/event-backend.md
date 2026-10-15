# Event – backend

Design: [design/event.md](../design/event.md).

**Not yet implemented.** The scope is a single event, and no existing service
references `event_id` beyond the `EVENT_ID` placeholder (see
[backend.md](./backend.md), "Startup"). This module is built once multi-event
support is needed.

**Model**

- Event: `id`, `name`, `created_at`
- Participant list: derived directly from the Google Sheet answers (1:1, no
  separate management) — the sign-ups of the dashboard ([design/admin-dashboard.md](../design/admin-dashboard.md))
- Helper list: to follow
- No invitation mechanism, no roles, no access control (core-team-only for now)

**Responsibility**

- Create an event
- Base reference (`event_id`) for all other services
- Central, server-side storage: an event is a shared project, so all team
  members must see the same state — which does not work with data held only in
  the browser
- With several active events, payment mails must be assigned to an event (see
  [dashboard-backend.md](./dashboard-backend.md), "Mail integration")
