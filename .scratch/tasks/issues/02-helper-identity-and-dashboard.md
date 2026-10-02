# 02: Helper identity and dashboard

**What to build:** a core-team member assigns a task to a helper by name. The helper opens the app, enters their name once, and the device remembers them. Their dashboard (the default view) shows only the tasks assigned to them. They open a task and read the brief first, because it is their basis for knowing what the task needs. Entering the same name on a new device brings their tasks back.

This is the first ticket of the helper app: a separate end-user PWA (ADR-001), not part of the core-team application, using the same Express backend.

**Blocked by:** 01, and these open decisions:

- [ ] Frontend stack of the helper PWA
- [ ] Hosting: the backend must be reachable from helpers' phones, which ADR-003's local-only operation doesn't cover
- [ ] Protecting the admin endpoints once the backend is reachable from outside

**Status:** blocked — open decisions

- [ ] A core-team member can assign a task to a helper by name
- [ ] First run asks for the helper's name; later launches on the same device skip it
- [ ] The dashboard shows only tasks assigned to that helper: no unassigned tasks, no other helpers' tasks
- [ ] Opening a task shows the brief prominently
- [ ] Re-entering the name on a new device shows the same tasks
- [ ] No password, email or account is involved
- [ ] Tests cover assignment, name-based identity and that helpers can't see other helpers' tasks
