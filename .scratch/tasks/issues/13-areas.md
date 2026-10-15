# 13: Areas

**What to build:** the core team defines the areas (kitchen, technology, decoration, …) at the start of preparation and can extend them at any time. Tasks are tagged with areas from that list — no free typing. Areas are not visible to helpers.

Data: adds `areas` and `task_areas` (tasks design, "Data model").

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] A core-team member can create areas; names are unique per event
- [ ] A core-team member can tag a task with one or more existing areas
- [ ] Tags can only be chosen from the defined areas
- [ ] Helpers never see areas
- [ ] Tests cover area creation, uniqueness, tagging and that helpers can't see areas
