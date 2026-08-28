# ADR-002: Project structure for documentation & AI-assisted development

## Status
Accepted

## Context
Artefacts such as specs and ADRs accumulate continuously. Development is
AI-assisted using Claude.

## Decision
- A dedicated `/docs` folder for attachments such as specs and ADRs, separate
  from the application code
- AI-assisted development with Claude Code: project context is provided through a
  `CLAUDE.md` in the root (architecture overview, references to `/docs/adr` and
  `/docs/specs`, coding conventions), so that Claude automatically loads the
  relevant context in every session

## Folder structure

```
/
├── CLAUDE.md
├── docs/
│   ├── adr/
│   │   ├── ADR-001-frontend-stack.md
│   │   └── ADR-002-projektstruktur.md
│   └── specs/
├── src/
│   └── app/
│       ├── core/          # Singleton services, guards, interceptors
│       ├── shared/        # Reusable components, pipes, directives
│       ├── features/      # Feature modules (e.g. events, tickets, auth)
│       └── layout/        # Shell components (header, nav, footer)
├── public/                # Static assets (manifest, icons, robots.txt) — copied unchanged into the build output
└── ...
```

This `src/app` structure applies to the **end-user PWA**. The admin dashboard is
a separate application ([ADR-003](./ADR-003-admin-dashboard-trennung.md)) and
uses a leaner structure fitted to its size — see the frontend spec.

## Rationale
- `/docs` in the repository keeps documentation versioned, central, and directly
  accessible to Claude as context
- `CLAUDE.md` gives Claude Code the relevant project context in every session
- The Angular structure separates core/shared/features along common standards —
  it scales well as the number of features grows
