# ADR overview

| ADR | Topic | Summary |
|---|---|---|
| [ADR-001](./ADR-001-frontend-stack.md) | Frontend stack | Angular as a PWA, optionally Capacitor for native apps later |
| [ADR-002](./ADR-002-projektstruktur.md) | Project structure & AI-assisted development | `/docs` folder for attachments/ADRs, AI-assisted development with Claude |
| [ADR-003](./ADR-003-admin-dashboard-trennung.md) | Admin dashboard separation | The admin dashboard is a standalone, locally used backend tool, separate from the end-user PWA |
| [ADR-004](./ADR-004-backend-stack-dashboard.md) | Admin dashboard backend stack | Node/Express backend (REST API) + separate Angular frontend, no SSR. Frontend is temporarily plain HTML/JS/CSS — see [frontend.md](../specs/frontend.md) |
| [ADR-005](./ADR-005-persistence.md) | Persistence | PostgreSQL: PGlite (in-process, npm) for local dev and tests now, a PostgreSQL server once the backend is hosted |
| [ADR-006](./ADR-006-ui-language.md) | UI language | Admin dashboard copy is German and hardcoded, no i18n — an exception to the English-only rule |
