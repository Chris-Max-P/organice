# Tasks — product design

Task management for event teams: the core team keeps an overview of all tasks
and hands individual tasks to helpers.

## 1. Problem

> A **core-team member** struggles with **knowing where every task actually
> stands, without chasing people for it**, because **any tool that gives them
> that overview forces every helper to learn it too — so helpers resist, keep
> their own systems, and the state fragments across messengers, Notion,
> spreadsheets, Miro and people's heads**, which costs them **forgotten tasks,
> material and decision needs surfacing too late, and organisers spending the
> run-up chasing status instead of enjoying the thing they are building**.

### How it is solved today

There is no single system. Each person mixes tools differently:

- **Shared tasks:** Notion, Asana, spreadsheets, Miro, WhatsApp and other
  messengers, in-person meetings.
- **Personal tasks:** each helper's own private system — Apple Notes, Obsidian
  and the like.

The argument over which tool to use is itself part of the pain, not just a
symptom of it.

### What is problematic about it

- **Tasks are never brought together.** Each tool holds a fragment; nobody has
  the whole picture.
- **Duplicates and scattered information.** The same task exists in several
  places, each with a different piece of what is known about it.
- **Status is not tracked in practice.** The tools could track it, but nobody
  keeps it current, so there is no overview of what is done and what is not.
- **The capable tools are too complicated for everyone.** Notion and PM tools
  demand that every helper learns them; most helpers have a simple job and
  will not.

These share one root cause: an **asymmetry**. Every incumbent buys the
organiser an overview by taxing the helper. Most helpers will never need the
concepts the tool invents, so they opt out — and the overview stays empty.

### Signal — what we would observe if this were solved

Both must hold. Either alone is a failure.

1. The organiser walks into the last pre-event meeting already knowing the state
   of every task. Nobody had to be asked.
2. A helper completes their task having learned nothing. They saw only their own
   work, and never needed a concept the tool invented.

### Go / no-go

**Go.** The asymmetry is unserved by every tool the interviewed teams already
use, and it is narrow enough to build. This frame makes features the enemy:
almost everything in the original notes is organiser-side complexity, and
signal 2 forbids any of it from reaching the helper.

---

## 2. Evidence

Five people across three event-organising teams. Four were asked about their
work; one was watched doing it.

| Claim | Tag |
|---|---|
| Tooling is mixed, per-person and not overviewable | **Reported** ×5 |
| One team's actual working method | **Observed** ×1 |
| Tasks get forgotten; material needs surface too late | **Reported** |
| Helpers will not learn a complex tool for a simple job | **Reported** |
| Helpers are content seeing only their own work | **Assumed** |
| A name is a sufficient identifier within one event | **Assumed** |

### Riskiest assumption

**A helper will go somewhere to report the state of their work.**

Existential, not merely risky. Without two-way updates this product collapses
into any other task or note app — the value is specifically the working-together
mode where both ends write. If helpers do not write back, the board is empty and
the organiser is chasing again, now through a tool nobody updates.

*Status: untested.* See section 6.

### Other open assumptions

- **Helpers are content seeing only their own work.** If wrong, the app reads as
  being handed chores by management rather than building something together —
  corrosive in a volunteer context. Cheapest fix if it breaks: surface the
  event's shared progress without surfacing other people's task detail.
- **A name is a sufficient identifier.** Anyone who knows a helper's name can
  claim their tasks from a fresh device. Accepted knowingly: the population is a
  small volunteer group with no adversary and nothing sensitive behind the
  identity. If wrong, an organiser-issued claim link replaces name entry.

---

## 3. Concept

**An installed helper app whose default view is a dashboard of my tasks, plus
an organiser task view over all of them.**

The helper installs the web app to their home screen, enters their name once,
and is remembered by the device. Opening it shows their dashboard: the tasks
assigned to them and nothing else. Each task carries a mutable **description**
and an append-only **update thread**. The organiser's view lists every task of
the event, on phone or desktop.

The organiser team may use the richer view; helpers get the minimal one. The
complexity lives on the organiser side and never reaches the helper.

### Ownership principle

The organiser **initialises** a task and can **comment** on it. The organiser
**cannot edit its description**. Once handed off, the task's description belongs
to the helper, and the task should reflect who is actually responsible for it.
An organiser overwriting a helper's work is demoralising and undoes the handoff
this product exists to perform.

Two layers with different mutability:

- **Description** — mutable, helper-owned. The living statement of what the task
  actually is, which sharpens as the helper learns the job.
- **Updates** — append-only, nobody's to overwrite. Entry 1 is the organiser's
  original brief, so what was originally asked stays readable forever.

When the organiser creates a task, the description they write is stored twice:
as the task's initial description, and as update 1 — the **brief**. The brief
is the helper's basis for knowing what the task needs. A task cannot be created
without one, and it stays the first entry of the thread however far the
description later drifts.

### Alternatives it beat

| Option | Why not |
|---|---|
| **One link per task** — task is the unit; the organiser drops a per-task link into the channel the helper already uses; no app, no account | Recommended by the designer, overruled by the product owner: a link in a WhatsApp thread is buried by scrollback within a day, whereas a home-screen icon stays reachable. The objection it was chosen against — that "a list of my tasks" is itself a concept to learn — stands, and is one thing validation should watch for. |
| **The chat is the app** — no helper-facing surface; the board pushes structured messages, the helper answers in their messenger, replies land on the board | Best fit for the riskiest assumption, worst product bet. The interviewed teams use *different* messengers, making the product hostage to platform APIs, approval and cost — and a chat thread cannot hold budget, deadline and state legibly for the organiser. |
| **Roles, task circles and a visibility matrix** — the literal reading of the original notes | This is Asana, which is on the workaround list *because it failed*. Building a permission system to hide complexity from helpers is the wrong lever; giving them nothing to hide from is the right one. Task circles return later as an extension (section 5), not as the core mechanism. |

---

## 4. Core flow

> The organiser opens the task view, creates a task and writes its description.
> That description becomes the task's initial description and is also stored as
> **update 1**, the brief — immutable. They assign it to a helper.
>
> The helper opens the installed app on their phone. First time only, they enter
> their name; the device remembers them from then on. The app shows their
> dashboard — their tasks and nothing else. They tap one and read the brief.
>
> As they work they append updates: *"Bierbänke geklärt, brauche noch einen
> Transporter."* They also rewrite the description as the task's real shape
> becomes clear. The brief in update 1 is untouched.
>
> The organiser sees the movement and the material need in their task view — in
> the run-up, not on the day. They can comment back, and can send a reminder to
> the helper when a task has gone quiet.
>
> The helper marks it done. It is done when the app says done.

---

## 5. Scope

### In

- Helper app: install to home screen, name-based first-run identity, device
  memory, name re-entry to recover tasks on a new device
- Helper dashboard as the default view, showing **only** tasks assigned to them
- Task: title, description (helper-editable), deadline, budget (money the helper
  may spend), category (muss / soll / kann / darf), helpers needed, status
- Append-only update thread; both organiser and helper append; update 1 is the
  organiser's brief — the description written at creation, mandatory
- Organiser task view over all tasks of the event, phone and desktop
- Organiser-triggered reminders to a helper, delivered as a push notification

### Later — planned extensions

- **Browse open tasks and apply.** Helpers can browse tasks that still need
  helpers and apply for them. A task is full once it has as many helpers as it
  needs. Built on top of the assigned-tasks feature; the dashboard of own tasks
  stays the default view. Open tasks show only their own details, never who
  else is on which task.
- **Task circles.** Tasks are grouped into circles, and visibility of each
  circle is configurable per role, to avoid information overload. Added once
  the task list becomes unreadable — a scaling problem that does not exist yet.
  Circles must not become something a helper has to understand: a helper's
  dashboard still shows only their own tasks (signal 2).

### Out — non-goals

- **Progress as a percentage.** Nobody produces that number honestly. The update
  thread already carries progress in a form the organiser can act on: *"brauche
  einen Transporter"* beats *"60 %"*.
- **Effort estimate and scheduled time slot.** Deadline and helpers needed are
  enough.
- **Raffling tasks.** Solves "nobody volunteers", which is a different problem.
  No evidence volunteers dry up.
- **Configurable notification settings.** One mechanism, no preferences.
- **Automatic scheduled reminders.** Organiser-triggered only.
- **Passwords, email verification, accounts.** Identity stays weak by choice.
- **Editing or deleting an update**, by anyone, including its author.
- **Visibility into other helpers' tasks**, including who else is on which task.

### Architectural consequence

**Decisions (product owner):**

- **Organiser side:** a feature of the existing core-team application — a
  `tasks` feature folder in its frontend and backend, next to participants and
  finance (see the frontend spec, section 3, and the backend spec, "Code
  structure"). Core-team members reach the task view through a **menu item next
  to the dashboard** ("Aufgaben").
- **Helper side:** a separate app — the end-user PWA of
  [ADR-001](../adr/ADR-001-frontend-stack.md). It is not a mode or route of the
  core-team application, so
  [ADR-003](../adr/ADR-003-admin-dashboard-trennung.md)'s separation of
  end-user app and admin tool stands.
- **Backend:** both apps use the **existing Express backend**. There is no
  second backend.

**Open consequence:** the helper app is installed, distributed and phone-first,
and helpers must reach the same backend the organiser writes to. That does not
fit the local, core-team-only operation of ADR-003 (no access control, no
deployment, data held only in memory). Still to decide before the helper side
can be built: hosting the backend, protecting the admin endpoints
once the backend is reachable from outside, and the frontend stack of the
helper PWA.

### Data model

PostgreSQL, see [ADR-005](../adr/ADR-005-persistence.md). Four tables; each
ticket adds the columns it needs.

| Table | Columns | From ticket |
|---|---|---|
| `people` | `id`, `name` (unique, the identity), `role` (`core_team` \| `helper`) | 02 |
| `tasks` | `id`, `event_id`, `title`, `description` (helper-editable), `created_at`; later `status`, `deadline`, `budget`, `category`, `helpers_needed` | 01 |
| `task_updates` | `id`, `task_id` → tasks, `author_id` → people (null for the brief), `text`, `created_at` | 01 |
| `task_helpers` | `task_id` → tasks, `person_id` → people; primary key on both | 02 |

- **People, not helpers:** helpers and core-team members are one list of people.
  A person's role determines what they may do. "Helper" stays the domain term
  for a person with the `helper` role.
- **The brief** is a task's first update (lowest `id`). It is immutable because
  no endpoint edits or deletes updates.
- **The backend aggregates:** API responses are shaped for the view (e.g. a task
  with its helper names), so the frontend never joins tables.

---

## 6. Validation — **not done**

Nobody outside the team has been through this flow. The concept above is
unvalidated and stage 4 remains open.

**Test to run, aimed at the riskiest assumption.** Take two people who actually
helped at the last event. Ten minutes each, separately. Do not demo the app —
walk them verbally through the moment they would use it: *"You've agreed to sort
the beer benches. Two weeks before the event you find out you need a van. What do
you do?"* Then show a paper or clickable version and watch where they hesitate,
backtrack, or ask what something means.

Watch for three things specifically:

1. Does the answer to that question ever involve **opening an app**, or is it
   always "I message someone"? This is the riskiest assumption, answered.
2. Do they treat the **description as theirs to edit**, or do they read it as the
   organiser's text they should not touch? The ownership principle depends on
   this.
3. Does "only my tasks" feel **focused or isolating**?

Record every surprise here as it arrives. Surprises are the only findings that
could not have been reasoned out in advance.

---

## 7. Names

The vocabulary the specification should use. Updating `CONTEXT.md` is the
domain-modeling skill's job and is deliberately not done here.

- **Task** — one unit of work handed to one or more helpers.
- **Description** — the mutable, helper-owned statement of what the task is.
- **Update** — one entry in the append-only thread. Never edited, never deleted.
- **Brief** — update 1: the description the organiser writes when creating the
  task, preserved unchanged. The helper's basis for knowing what is needed.
- **Reminder** — an organiser-triggered push to a helper about one task.
- **Dashboard** — the helper's default view: the tasks assigned to them.
- **Budget** — the amount of money a helper may spend on a task.

**Known conflict, unresolved by choice:** `CONTEXT.md` defines **Helper** as "a
stated intention, not an assigned duty". This feature makes it a duty. The
product owner has seen the conflict and will resolve it separately.

---

## 8. Handoff to `spec-design`

- The **signal** (section 1) becomes the acceptance criteria.
- The **names** (section 7) become the spec's vocabulary.
- The **converge decisions** (sections 3–5) are constraints, not suggestions. A
  spec that contradicts one is a real conflict: raise it rather than resolve it
  silently.
- The **open assumptions** (section 2) are what the first build exists to test.

A spec should not be written against section 6 while it still says *not done*
without that being a conscious decision.
