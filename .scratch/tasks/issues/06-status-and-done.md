# 06: Status and done

**What to build:** a helper marks their task done, or the core team does it on their behalf, and the core-team task view shows each task's status. A task is done when the app says it's done. Status values are open and done; a done task can be reopened.

Data: adds `tasks.status` (tasks design, "Data model").

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] A new task is open
- [ ] An assigned helper can mark the task done
- [ ] A core-team member can mark any task done
- [ ] Everyone involved and the core team can reopen a done task
- [ ] The core-team task view shows each task's status and makes open and done tasks easy to tell apart
- [ ] Tests cover marking done from both sides, reopening, and its visibility in the task view
