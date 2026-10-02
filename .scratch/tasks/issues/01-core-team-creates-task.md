# 01: Core team creates a task and sees it in the task view

**What to build:** the organiser side of tasks inside the existing core-team application. A core-team member opens the new "Aufgaben" menu item next to the dashboard, creates a task with a title and a description, and sees it in the task list. The description becomes the task's initial description and is also stored as update 1, the brief, which never changes.

Source: `docs/design/tasks.md` ("Architectural consequence"). This is a `tasks` feature folder in the existing core-team frontend and the existing Express backend, and it brings the first page-level navigation (frontend spec, section 11).

**Blocked by:** no other ticket, but this open decision must be made and recorded first:

- [x] Backend: reuse the existing Express backend
- [x] Core-team access: a menu item ("Aufgaben") next to the dashboard in the core-team application
- [x] Frontend: the existing core-team frontend (the helper PWA's stack is decided in ticket 02)
- [ ] Persistence: where tasks, updates and helper assignments are stored (the backend has no database today)

**Status:** blocked — open decision

- [ ] The core-team application has a menu with "Dashboard" and "Aufgaben"
- [ ] A core-team member can create a task with a title and a description
- [ ] A task cannot be created without a description
- [ ] On creation, the description is stored as the task's description and as update 1 (the brief)
- [ ] The brief cannot be edited or deleted by anyone
- [ ] The task view lists all tasks of the event and shows each task's brief
- [ ] Tasks survive a backend restart
- [ ] Tests cover task creation, the mandatory description and the immutable brief
