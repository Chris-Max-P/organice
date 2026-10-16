# Tasks — product design

Task distribution during festival preparation: the core team keeps an overview
of all tasks and hands individual tasks to helpers. Project-wide context
(festival size, preparation timeline, how the team works today, the tool
dispute, principles) lives in [general.md](./general.md).

**Scope:** tasks *in preparation*. Organising the on-site work (e.g. a kitchen
shift plan) is itself a preparation task; its result lives elsewhere. Shift
planning is not part of this design.

## 1. Problem

### Core problems

1. **Overview** — it is not easy to grasp what tasks we have to do in a given moment,
   and how far we are with a given area of the festival.
2. **Coordination is difficult** - In WhatsApp, 
   information gets lost in normal chats; many groups quickly become confusing.
3. **Information spread** —
   - **Duplicates** - even in the core orga team, people have a local duplicate of tasks or infos in their own notes,
     making it hard to follow the current state. The same task exists in several
     places, each with a different piece of what is known about it.
   - Files that belong to a task or area lie somewhere in the cloud and are not easy to find
4. **The capable tools are too complicated for everyone.** Notion and PM tools require setup and
  demand that every helper learns them; most helpers have a simple job and
  will not.

### How it is solved today

There is no single system for shared tasks: Notion, Asana, spreadsheets, Miro,
WhatsApp and other messengers, in-person meetings. Tasks are distributed by a
mix of self sign-up, direct asking and volunteering in meetings (see
[general.md](./general.md), section 3).

### Example: the forgotten ingredients

Ingredients for cooking were forgotten because the main organiser had too many
tasks. The shopping was not organised or thought through in advance and
happened spontaneously. It took long, food was late, and the whole evening
schedule slipped. The gap only surfaced *during* the shopping.

Causes:

- The shopping was not recognised as a task of its own ("I'll just do it on the
  side").
- Handing it off would have cost more than doing it: recipes and quantities
  were only in one person's head.

### Product boundary

- The app is **the one place where the shared state lives** — for tasks handed
  over or worked on between people. Personal memory aids stay in each person's
  own tools (section 7).
- Coordination **about a task** (agreements, current information) belongs to
  the task. Cross-area decisions and general organisational chatter stay out —
  unless a decision gets its own task.
- A decision to be made is **a task** ("Decide: two stages yes/no"), done once
  decided. No separate thread concept.

---

## 2. Evidence

Five people across three event-organising teams, plus a grilling session with
the product owner. Four were asked about their work; one was watched doing it.

| Claim | Tag |
|---|---|
| Tooling is mixed, per-person and not overviewable | **Reported** ×5 |
| One team's actual working method | **Observed** ×1 |
| Tasks get forgotten; material needs surface too late | **Reported** |
| Helpers will not learn a complex tool for a simple job | **Reported** |
| The core team is split into an analogue and a digital camp | **Reported** (two groups) |
| Helpers are content seeing only their own tasks | **Assumed** |
| A name is a sufficient identifier within one event | **Assumed** |

### Riskiest assumption

**Does the task app offer users any added value at all, or would they rather
work in their familiar, own tools?**

*Status: untested.* See section 8.

### Other open assumptions

- **Helpers are content seeing only their own tasks.** If wrong, the app reads
  as being handed chores by management rather than building something together —
  corrosive in a volunteer context. Cheapest fix if it breaks: surface the
  event's shared progress without surfacing other tasks' detail.
- **A name is a sufficient identifier.** Anyone who knows a helper's name can
  claim their tasks from a fresh device. Accepted knowingly: the population is a
  small volunteer group with no adversary and nothing sensitive behind the
  identity. If wrong, an organiser-issued claim link replaces name entry.

---

## 3. Concept

**An installed helper app whose default view is my tasks, plus core-team
overviews over all of them.**

The helper installs the web app to their home screen, enters their name once,
and is remembered by the device. Opening it shows their tasks and nothing else.
Each task carries a mutable **description** and an append-only **update
thread**. The core team's views list every task of the event, on phone or
desktop.

The core team may use the richer views; helpers get the minimal one. The
complexity lives on the core-team side and never reaches the helper.

### Two layers

- **Description** — the current state of affairs, what applies *now*. Read
  instead of scrolling. Shared by everyone involved and the core team
  (section 4, "Editing the description").
- **Updates** — append-only, nobody's to overwrite. Entry 1 is the core team's
  original brief, so what was originally asked stays readable forever.

When the core team creates a task, the description they write is stored twice:
as the task's initial description, and as update 1 — the **brief**. The brief
is the helper's basis for knowing what the task needs. A task cannot be created
without one, and it stays the first entry of the thread however far the
description later drifts.

### Alternatives it beat

| Option | Why not |
|---|---|
| **One link per task** — task is the unit; the core team drops a per-task link into the channel the helper already uses; no app, no account | Recommended by the designer, overruled by the product owner: a link in a WhatsApp thread is buried by scrollback within a day, whereas a home-screen icon stays reachable. The objection it was chosen against — that "a list of my tasks" is itself a concept to learn — stands, and is one thing validation should watch for. |
| **The chat is the app** — no helper-facing surface; the board pushes structured messages, the helper answers in their messenger, replies land on the board | The interviewed teams use *different* messengers, making the product hostage to platform APIs, approval and cost — and a chat thread cannot hold budget, deadline and state legibly for the core team. |
| **Roles, task circles and a configurable visibility matrix** — the literal reading of the original notes | This is Asana, which is on the workaround list *because it failed*. There are two fixed roles and one fixed table of who sees and edits what (section 4); nothing is configurable. Task circles return later as an extension (section 6). |

---

## 4. Functional design

### Task

| Element | Description |
|---|---|
| Title | Short name of the task. |
| Description | The current state of affairs — what applies *now*. |
| Update thread | Append-only history. Coordination and current information. Update 1 is the brief. |
| Checklist | Shopping, inventory and packing lists; also sub-tasks and needs (see below). |
| Attachments | Invoices, programme, spreadsheets, … |
| Areas (tags) | Kitchen, technology, decoration, … — mainly for the core team. |
| Category | muss / soll / kann / darf. |
| Deadline | When the task is due. |
| Budget | Money the helper may spend. |
| People involved | Who is working on it. |
| Status | Open or done. |

### Checklist

- An item is text plus a checkbox. Anyone involved may tick it.
- **Rule:** as soon as an item needs its own person, deadline or history, it
  becomes a task of its own. No nested task trees.
- A **need** ("need a van") is added as an open checklist item. It is not a
  category of its own.

### Editing the description

- Everyone involved and the core team may edit it.
- Risk: the core team meddles in a helper's area of responsibility, and the
  helper's work gets lost.
- **Solution:** every change appears automatically in the update thread
  ("Anna changed the description"); earlier versions can be restored. Nothing is
  lost, and meddling becomes visible. The brief (update 1) is never affected.

### Writing on someone's behalf

The core team may write an update *for* someone, marked as "noted by X". This
lets the core team take documentation work off helpers.

### Attachments

- The problem is **scattered files**.
- Files can be uploaded or linked per task. Uploads go to the team's storage and
  are linked automatically, so files don't scatter again.
- The core team decides where files are stored: **one** storage location;
  extendable later if needed.

### Areas (tags)

The core team defines the areas at the start of preparation; they can be
extended at any time. No free typing (avoids "Deko", "deko", "Dekoration").

### Who sees and edits what

| | Helper (own task) | Core team |
|---|---|---|
| Description, checklist, thread, attachments | view and edit | view and edit |
| Areas (tags) | not visible | view and edit |
| Budget, deadline, category | view | view and edit |
| Change who is involved | no | yes |

Helpers see only tasks they are involved in. No hidden core-team notes on a
task: they undermine trust and contradict the handoff.

### No notifications

The app sends no notifications about tasks. People decide for themselves when
they come back to the app, and then see everything there. There is no marker
for what changed since their last visit; the update thread is the history.

---

## 5. Overviews

Four views, each answering different questions:

| View | For | Answers |
|---|---|---|
| **Overview** | Core team | What is open? What has nobody? What is stuck? What is done? Who is working on what? What is due when? |
| **Area view** | Semi-leads | The same, filtered by area. A filter, not a concept of its own. |
| **My tasks** | Everyone | My own tasks. Helpers' default view in the helper app; for core-team members, a tab in their dashboard that filters the tasks to the ones they are involved in. |
| **Meeting overview** | Meeting | What has happened since the last meeting? |

### Core-team task page (first slice)

The first version of the core-team side, reached through the "Aufgaben" menu
item next to the dashboard.

- **Create a task** above the list: "Titel" and "Beschreibung" are both
  required; "Aufgabe anlegen" saves it. Leading and trailing spaces are dropped;
  a field with only spaces counts as empty.
- After saving, the form clears and the new task appears in the list. If saving
  fails, the message "Aufgabe konnte nicht gespeichert werden." appears next to
  the button.
- **The list** shows all tasks of the event, newest first, one line per task:
  title in bold, the description next to it (cut off when it does not fit), and
  the names of the helpers on the right.
- No tasks yet: "Noch keine Aufgaben". Loading and error messages as on the
  dashboard ([admin-dashboard.md](./admin-dashboard.md), "Loading, error and empty states").

### "Stuck"

A task is stuck when it has had **no activity since the last meeting**. This
adapts to the meeting rhythm by itself (months early on, weeks later) and needs
no setting. A missed deadline always counts as stuck.

### Meeting overview

- A meeting is a date in the tool; the page is generated from it — no
  preparation work.
- Blocks: **done**, **has nobody**, **stuck** since the last meeting.
- No **needs something** block: a shopping list has many open items that aren't
  needs, and a pressing need shows as a stuck task anyway. Re-evaluate after
  the pilot.

### Role of the tool in meetings

- The meeting stays analogue, enriched by information from the tool — not
  overlaid by it.
- One person has the tool open and looks things up when needed; the meeting
  overview serves as preparation.
- One person records new tasks and information during the meeting. The analogue
  camp doesn't have to touch anything.

---

## 6. Scope

### Participation minimum

What the analogue camp has to do at minimum:

- **Required:** view own tasks, tap "done".
- **Optional:** write a one-line update now and then.
- Anything beyond that, the core team can record on their behalf.

### In

- Helper app: install to home screen, name-based first-run identity, device
  memory, name re-entry to recover tasks on a new device
- "My tasks" as the default view, showing **only** tasks the person is involved
  in
- Task with the elements of section 4
- Append-only update thread; everyone involved and the core team append; update
  1 is the brief — the description written at creation, mandatory
- Description editable by everyone involved and the core team, with history and
  restore
- Writing an update on someone's behalf ("noted by X")
- Overview, area view and meeting overview for the core team
- "My tasks" tab in the core-team dashboard

### Later — planned extensions

- **Recording meetings** (beyond the date that drives the meeting overview).
- **Browse open tasks and apply.** Helpers can browse tasks that still need
  people and apply for them. Addresses gathering co-organisers — part of the
  problem, but not the first step. Needs a "helpers needed" number per task; a
  task is full once it has as many helpers as it needs. The own-tasks view stays
  the default. Open tasks show only their own details, never who is on them.
- **Reuse** — create a new festival from the last one: tasks, descriptions and
  checklists as a starting point, no history, no people. Probably the strongest
  value over WhatsApp: the festival learns across years, not only individual
  people.
- **Invoices and finances** — invoices as attachments touch the finance part of
  the dashboard; to be delimited separately.
- **More than one file storage location** — only if needed.
- **Task circles.** Visibility per area configurable per role, to avoid
  information overload. Added once the task list becomes unreadable — a scaling
  problem that does not exist yet. Circles must not become something a helper
  has to understand: "my tasks" still shows only their own tasks.

### Out — non-goals

- **Progress as a percentage.** Nobody produces that number honestly. The update
  thread already carries progress in a form the core team can act on: *"brauche
  einen Transporter"* beats *"60 %"*.
- **Effort estimate and scheduled time slot.** Deadline is enough.
- **Raffling tasks.** Solves "nobody volunteers", which is a different problem.
  No evidence volunteers dry up.
- **Notifications of any kind** — push, reminders (core-team-triggered or
  automatic), "what changed" markers. People come back on their own; the
  overview shows stuck tasks.
- **Passwords, email verification, accounts.** Identity stays weak by choice.
- **Editing or deleting an update**, by anyone, including its author.
- **Visibility into tasks a helper is not involved in.**
- **Hidden core-team notes on a task.**
- **Nested task trees.**
- **Bridges into personal tools** (calendar subscriptions, syncs) and per-task
  links for them.

### Architectural consequence

**Decisions (product owner):**

- **Core-team side:** a feature of the existing core-team application — a
  `tasks` feature folder in its frontend and backend, next to participants and
  finance (see [frontend.md](../specs/frontend.md) and
  [backend.md](../specs/backend.md), "Project structure" / "Code structure").
  Core-team members reach the task views through a **menu item next to the
  dashboard** ("Aufgaben").
- **Helper side:** a separate app — the end-user PWA of
  [ADR-001](../adr/ADR-001-frontend-stack.md). It is not a mode or route of the
  core-team application, so
  [ADR-003](../adr/ADR-003-admin-dashboard-trennung.md)'s separation of
  end-user app and admin tool stands.
- **Backend:** both apps use the **existing Express backend**. There is no
  second backend.

**Open consequence:** the helper app is installed, distributed and phone-first,
and helpers must reach the same backend the core team writes to. That does not
fit the local, core-team-only operation of ADR-003 (no access control, no
deployment, data held only in memory). Still to decide before the helper side
can be built: hosting the backend, protecting the admin endpoints once the
backend is reachable from outside, the frontend stack of the helper PWA, and the
team's file storage for attachments.

### Data model

PostgreSQL, see [ADR-005](../adr/ADR-005-persistence.md). Each ticket adds the
tables and columns it needs.

| Table | Columns | From ticket |
|---|---|---|
| `people` | `id`, `name` (unique, the identity), `role` (`core_team` \| `helper`) | 02 |
| `tasks` | `id`, `event_id`, `title`, `description`, `created_at`; later `status`, `deadline`, `budget`, `category` | 01 |
| `task_updates` | `id`, `task_id` → tasks, `author_id` → people (null for the brief), `text`, `created_at`; later `noted_by_id` → people (on-behalf updates), `kind` (`update` \| `description_changed`) | 01 |
| `task_helpers` | `task_id` → tasks, `person_id` → people; primary key on both | 02 |
| `task_description_versions` | `id`, `task_id` → tasks, `text`, `edited_by_id` → people, `created_at` | — |
| `checklist_items` | `id`, `task_id` → tasks, `text`, `done`, `position` | — |
| `task_attachments` | `id`, `task_id` → tasks, `url`, `name`, `created_at` | — |
| `areas` | `id`, `event_id`, `name` (unique per event) | — |
| `task_areas` | `task_id` → tasks, `area_id` → areas; primary key on both | — |
| `meetings` | `id`, `event_id`, `date` | — |

- **People, not helpers:** helpers and core-team members are one list of people.
  A person's role determines what they may do. "Helper" stays the domain term
  for a person with the `helper` role. Semi-leads are core-team members, not a
  role of their own.
- **The brief** is a task's first update (lowest `id`). It is immutable because
  no endpoint edits or deletes updates.
- **The backend aggregates:** API responses are shaped for the view (e.g. a task
  with its helper names), so the frontend never joins tables.

---

## 7. Double maintenance

Nobody wants to maintain their tasks twice, so a task in the app may already be
one too many. But when people work on something together, the one place where
everything about the task lives doesn't exist anyway.

- **What belongs in the app:** a task that several people work on, or whose
  state someone other than the person doing it needs to know. Everything else
  belongs in personal tools.
- **Flexible participation, implicit:** there is no setting. A task works
  whether or not the helper opens the app; the core team records what it learns
  in conversation ("noted by X"). Accepted price: whoever doesn't participate
  shifts the maintenance to the core team, and for those tasks the chasing comes
  back.
- **Pointer in personal tools:** nothing special — people write "it's in the
  app". No per-task link feature.
- **Digital camp:** core-team members who also plan in their own tools maintain
  twice by their own choice. The app only asks for the part others need; it does
  not try to replace personal tools.

---

## 8. Validation — **not done**

Nobody outside the team has been through this flow. The concept above is
unvalidated.

1. **A paper test with someone from the analogue camp.** Ten minutes, without a
   demo. Walk them verbally through the moment they would use it: *"You've
   agreed to sort the beer benches. Two weeks before the festival you find out
   you need a van. What do you do?"* Then show a paper or clickable version and
   watch where they hesitate, backtrack, or ask what something means.
2. **A pilot in one area** (e.g. kitchen) during real preparation; everything
   else runs as before.

Watch for:

1. Does the answer to the van question ever involve **opening an app**, or is it
   always "I message someone"?
2. Do helpers accept that the **description is shared** with the core team, or
   do core-team edits feel like meddling despite the visible history?
3. Does "only my tasks" feel **focused or isolating**?

**Success:** the meeting uses the overview, and coordination on pilot tasks
leaves WhatsApp.

**Failure signal:** tasks in the app go stale because the real state is kept
elsewhere, and nobody in the meeting trusts the overview.

Record every surprise here as it arrives. Surprises are the only findings that
could not have been reasoned out in advance.

---

## 9. Names

The vocabulary the specification should use. Updating `CONTEXT.md` is the
domain-modeling skill's job and is deliberately not done here.

- **Task** — one unit of work handed to one or more people.
- **Description** — the mutable statement of what applies to the task now;
  editable by everyone involved and the core team, with history.
- **Update** — one entry in the append-only thread. Never edited, never deleted.
- **Brief** — update 1: the description the core team writes when creating the
  task, preserved unchanged. The helper's basis for knowing what is needed.
- **Noted by** — marks an update the core team wrote on someone's behalf.
- **Checklist item** — text plus a checkbox on a task.
- **Need** — an open checklist item for something the task requires.
- **Area** — a core-team-defined tag grouping tasks (kitchen, technology, …).
- **Category** — muss / soll / kann / darf.
- **Budget** — the amount of money a helper may spend on a task.
- **Stuck** — no activity since the last meeting, or a missed deadline.
- **Meeting** — a date in the tool that drives the meeting overview.
- **My tasks** — the default view: the tasks a person is involved in.
- **Semi-lead** — a core-team member responsible for an area.

**Known conflict, unresolved by choice:** `CONTEXT.md` defines **Helper** as "a
stated intention, not an assigned duty". This feature makes it a duty. The
product owner has seen the conflict and will resolve it separately.

---

## 10. Handoff to `spec-design`

- The **success and failure signals** (section 8) and the **participation
  minimum** (section 6) become the acceptance criteria.
- The **names** (section 9) become the spec's vocabulary.
- The **converge decisions** (sections 3–7) are constraints, not suggestions. A
  spec that contradicts one is a real conflict: raise it rather than resolve it
  silently.
- The **open assumptions** (section 2) are what the first build exists to test.

A spec should not be written against section 8 while it still says *not done*
without that being a conscious decision.
