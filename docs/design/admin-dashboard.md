
**Architecture note**: the event overview/dashboard is aimed at
administrators/the core team and is used exclusively locally (no end-user
access) — see [ADR-003](./adr/ADR-003-admin-dashboard-trennung.md). It is to be
considered separately from the end-user PWA (section 4.2,
[ADR-001](./adr/ADR-001-frontend-stack.md)).

**Create an event**
- An event is created as a shared project (several people contribute to it, it is
  not purely single-person administration)

**Dashboard**
- Participant numbers (actual figure, possibly in relation to a target)
- Finance state (at the level of key figures — details deliberately out of scope,
  see 2.2)
- Task status (e.g. share done/open/in progress, possibly by circle or category)