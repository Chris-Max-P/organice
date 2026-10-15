# 14: Writing an update on someone's behalf

**What to build:** a core-team member can write an update *for* someone involved in the task, marked as "noted by X". This lets the core team take documentation work off helpers who don't use the app.

Data: adds `task_updates.noted_by_id` (tasks design, "Data model").

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] A core-team member can write an update with another person involved in the task as its author
- [ ] The thread shows such updates as "noted by X"
- [ ] Helpers can't write on someone else's behalf
- [ ] Tests cover on-behalf updates, that an author not involved in the task is refused, and that helpers are refused
