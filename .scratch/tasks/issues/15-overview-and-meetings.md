# 15: Overview, area view and meeting overview

**What to build:** the core-team task view answers: what is open, what has nobody, what is stuck, what is done, who is working on what, what is due when. The area view is the same, filtered by area. A meeting is a date in the tool; the meeting overview is generated from it and shows what is done, has nobody, and is stuck since the last meeting.

A task is **stuck** when it has had no activity since the last meeting; a missed deadline always counts as stuck.

Data: adds `meetings` (tasks design, "Data model").

**Blocked by:** 03, 05, 06, 13

**Status:** ready-for-agent

- [ ] A core-team member can add a meeting by date
- [ ] The overview marks open, done, unassigned and stuck tasks and shows people and deadlines
- [ ] The overview can be filtered by area
- [ ] The meeting overview shows the blocks done, has nobody and stuck since the previous meeting
- [ ] Stuck is derived from activity and deadlines; there is no setting
- [ ] Tests cover the stuck rule, the area filter and the meeting overview blocks
