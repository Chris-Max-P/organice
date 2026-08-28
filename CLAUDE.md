# CLAUDE.md

Context for Claude Code. For details see the respective ADR in `/docs`.

## Implementation process
For every module we implement, we follow these steps. Guide me through them one
by one when I tell you we are implementing a module.
1. Tell me which questions are still open before the module can be implemented.
   List all questions first, then walk me through them one at a time. For every
   decision, give me relevant background on the options. Update the specs
   according to my answers.
2. Create the folder structure and files with empty methods.
3. Write tests (test-driven development).
4. Start the implementation.
5. Verify that the tests pass.
6. Git: create a new branch, commit the changes and push.

## UI language
All user-facing strings in the admin dashboard are **German**, hardcoded, without
`@angular/localize`. The dashboard is used exclusively by a German-speaking core
team, the Google Form columns are German, and the PayPal payment mails are
German. This is a deliberate exception to the English-only rule, which applies to
code, identifiers, comments, tests, and documentation — not to user-facing copy.

## ADR overview

| ADR | Topic | Summary |
|---|---|---|
| [ADR-001](./docs/adr/ADR-001-frontend-stack.md) | Frontend stack | Angular as a PWA, optionally Capacitor for native apps later |
| [ADR-002](./docs/adr/ADR-002-projektstruktur.md) | Project structure & AI-assisted development | `/docs` folder for attachments/ADRs, AI-assisted development with Claude |
| [ADR-003](./docs/adr/ADR-003-admin-dashboard-trennung.md) | Admin dashboard separation | The admin dashboard is a standalone, locally used backend tool, separate from the end-user PWA |
| [ADR-004](./docs/adr/ADR-004-backend-stack-dashboard.md) | Admin dashboard backend stack | Node/Express backend (REST API) + separate Angular frontend, no SSR |
