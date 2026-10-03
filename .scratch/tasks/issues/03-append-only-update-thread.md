# 03: Append-only update thread

**What to build:** a helper and a core-team member can both add updates to a task. Both see the whole thread in order, starting with the brief as update 1. The core team sees helper updates in the task view.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] A helper can append an update to their own task
- [ ] A core-team member can append an update (comment) to any task
- [ ] The thread shows all updates in order, with the brief always first
- [ ] Nobody, including the author, can edit or delete an update
- [ ] Helper updates show up in the core-team task view
- [ ] Tests cover appending from both sides and that edit/delete is refused
