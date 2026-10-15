# 05: Task fields

**What to build:** a task carries a deadline, a budget (money the helper may spend) and a category (muss / soll / kann / darf). The core team sets the fields; helpers see them on their tasks, together with who else is involved.

Data: adds `tasks.deadline`, `tasks.budget` and `tasks.category` (tasks design, "Data model").

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] A core-team member can set deadline, budget and category
- [ ] Category is limited to muss / soll / kann / darf
- [ ] Helpers can view but not change deadline, budget and category
- [ ] Helpers see who else is involved in their task
- [ ] The core-team task view shows the fields
- [ ] Tests cover the fields, category validation, and that helpers can't change them
