# 01: Core team creates a task and sees it in the task view

**What to build:** the organiser side of tasks inside the existing core-team application. A core-team member opens the new "Aufgaben" menu item next to the dashboard, creates a task with a title and a description, and sees it in the task list. The description becomes the task's initial description and is also stored as update 1, the brief, which never changes.

Source: `docs/design/tasks.md` ("Architectural consequence", "Data model"). This is a `tasks` feature folder in the existing core-team frontend (frontend spec, section 12) and the existing Express backend (backend spec, section 11), and it brings the first page-level navigation.

**Blocked by:** no other ticket. Decisions:

- [x] Backend: reuse the existing Express backend
- [x] Core-team access: a menu item ("Aufgaben") next to the dashboard in the core-team application
- [x] Frontend: the existing core-team frontend (the helper PWA's stack is decided in ticket 02)
- [x] Persistence: PGlite now, a PostgreSQL server later ([ADR-005](../../../docs/adr/ADR-005-persistence.md)), set up in ticket 00
- [x] Tables: this ticket adds `tasks` and `task_updates` (tasks design, "Data model"); `people` and `task_helpers` come with ticket 02
- [x] API: `GET /tasks/all` and `POST /tasks` (backend spec, section 11)
- [x] Brief immutability: there is no endpoint to edit or delete an update
- [x] Brief author: the brief has no author (`author_id` is null); it always comes from the core team
- [x] Navigation: a hand-written hash router (`#/` and `#/aufgaben`), about 15 lines; replaced when demand grows
- [x] UI: create form above the list, one-line list items (frontend spec, section 12)
- [x] Tests: backend only; the frontend stays without automated tests for the prototype

**Status:** ready

- [ ] The core-team application has a menu with "Dashboard" and "Aufgaben", switched via hash routing
- [ ] The database is passed to `createApp` and the tasks router uses it
- [ ] Migration `0001-create-tasks` creates `tasks` and `task_updates`
- [ ] A core-team member can create a task with a title and a description
- [ ] A task cannot be created without a title or a description (`400`)
- [ ] On creation, the description is stored on the task and as its first update (the brief), in one transaction
- [ ] There is no endpoint to edit or delete an update
- [ ] The task view lists all tasks of the event, newest first, one line each: title in bold, description truncated with an ellipsis, assigned helper names on the right (empty until ticket 02)
- [ ] After saving, the form clears and the new task appears; a failed save shows an error next to the button
- [ ] An empty list shows "Noch keine Aufgaben"
- [ ] Tasks survive a backend restart
- [ ] Backend tests cover task creation, the mandatory title and description, the brief stored as update 1, and the list order
