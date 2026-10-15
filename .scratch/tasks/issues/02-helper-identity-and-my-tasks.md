# 02: Helper identity and "my tasks"

**What to build:** a core-team member assigns a task to a helper by name. The helper opens the app, enters their name once, and the device remembers them. Their "my tasks" view (the default view) shows only the tasks they are involved in. They open a task and read the brief first, because it is their basis for knowing what the task needs. Entering the same name on a new device brings their tasks back.

This is the first ticket of the helper app: a separate end-user PWA (ADR-001), not part of the core-team application, using the same Express backend.

Data: this ticket adds the `people` table (helpers and core-team members, distinguished by `role`) and the `task_helpers` table (tasks design, "Data model"). `GET /tasks/all` gains `helperNames: string[]`, aggregated by the backend, so the core-team task list shows assigned helpers on the right.

**Blocked by:** 01, and these open decisions:

- [ ] Frontend stack of the helper PWA
- [ ] Hosting: the backend must be reachable from helpers' phones, which ADR-003's local-only operation doesn't cover
- [ ] Protecting the admin endpoints once the backend is reachable from outside

**Status:** blocked — open decisions

- [ ] A core-team member can assign a task to a helper by name; a task can have several helpers
- [ ] Only the core team can change who is involved
- [ ] Helpers and core-team members are stored as people with a role
- [ ] The core-team task list shows the assigned helper names
- [ ] First run asks for the helper's name; later launches on the same device skip it
- [ ] "My tasks" shows only tasks the helper is involved in: no unassigned tasks, no tasks they are not involved in
- [ ] Opening a task shows the brief prominently
- [ ] Re-entering the name on a new device shows the same tasks
- [ ] No password, email or account is involved
- [ ] Tests cover assignment (including several helpers per task), that helpers can't change who is involved, name-based identity and that helpers can't see tasks they are not involved in
