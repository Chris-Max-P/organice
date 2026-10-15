# 04: Shared description with history

**What to build:** everyone involved in a task and the core team can rewrite its description as the task's real shape becomes clear. Every change appears automatically in the update thread ("Anna changed the description"), and earlier versions can be restored, so nothing is lost and meddling becomes visible. The brief (update 1) stays unchanged, so what was originally asked stays readable.

Data: adds `task_description_versions` and `task_updates.kind` (`update` | `description_changed`) (tasks design, "Data model").

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] A helper involved in the task can edit its description
- [ ] A core-team member can edit the description of any task
- [ ] Every edit adds a "description changed" entry to the thread, naming who changed it
- [ ] Earlier versions can be viewed and restored; a restore is itself a change and appears in the thread
- [ ] Editing or restoring the description never changes the brief
- [ ] Tests cover edits from both sides, the thread entry, restore and that the brief is unaffected
