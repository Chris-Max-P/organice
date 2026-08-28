# Project description: App for event and task organisation

*As of: 13 August 2026 — foundational document for further prompts
(specification, product design, architecture)*

## 1. Background

The preceding tool research in this project showed: there is no existing tool
that covers governance, task organisation, finances, guest/travel planning, and
communication for self-organised groups in one place. Instead of combining
existing building blocks (Nextcloud, Loomio, Engelsystem, Open Collective …), a
dedicated app is now to be developed — initially with a reduced, clearly
delimited feature set.

## 2. Project scope

### 2.1 Included in this step

- **Event overview** — create events as shared projects, dashboard with key
  figures
- **Tasks** — task management with role-based visibility, a take-over function,
  and categorisation

### 2.2 Deliberately excluded (later stages)

Identified as relevant by the research, but not part of this cut: decision
making/consent processes, detailed finance management (bookings, receipts),
guest/travel planning, wiki/document storage, communication features (chat,
forums).

## 3. Target group & roles (assumption, to be confirmed)

- **Organiser** — creates events, manages task circles, sees everything
- **Circle/area lead** — is responsible for a task circle, distributes tasks
  within the circle
- **Helper / participant** — sees tasks according to visibility, takes on tasks

The role model and permissions are to be specified in more detail in a follow-up
prompt.

## 4. Feature overview

### 4.1 Event overview

**Architecture note**: the event overview/dashboard is aimed at
administrators/the core team and is used exclusively locally (no end-user
access) — see [ADR-003](./adr/ADR-003-admin-dashboard-trennung.md). It is to be
considered separately from the end-user PWA (section 4.2,
[ADR-001](./adr/ADR-001-frontend-stack.md)).

**Create an event**
- An event is created as a shared project (several people contribute to it, it is
  not purely single-person administration)

**Dashboard**
- Participant numbers (actual figure, possibly in relation to a target)
- Finance state (at the level of key figures — details deliberately out of scope,
  see 2.2)
- Task status (e.g. share done/open/in progress, possibly by circle or category)

### 4.2 Tasks

**Task overview and responsibilities**

Task list, per task with:
- Description
- Scope (effort/size)
- Point in time
- Helpers available / helpers needed (target vs actual)
- Progress / current state (possibly as a percentage)
- Status (open → distributed → full, once the helper demand is covered)

**Task circles**
- Grouping of tasks into circles
- Visibility configurable per role, to avoid information overload

**Open tasks**
- List of open tasks with a short description, the currently responsible person,
  and a "take on task" function
- Idea: raffle tasks (a mechanism for allocation instead of/in addition to
  voluntary take-over) — status: to be clarified whether and how

**Task categories**
- Four levels: must / should / could / may (MoSCoW-style prioritisation)

*Note: the last item of the original list was empty in the input — to be added in
a follow-up prompt if needed.*

## 5. Quality goals for further planning

Since high software quality is an explicit goal, follow-up prompts should address
among other things:
- A clear, testable functional specification per feature (acceptance criteria)
- The data model (event, task, task circle, role, user, visibility rules)
- A permission/role concept including the visibility logic of task circles
- Architecture decisions (frontend/backend split, hosting/self-hosting, data
  storage)
- Extensibility with a view to the excluded areas (finances, guests, governance)
  — the data model should not block later integration
- Non-functional requirements: multi-user capability/concurrency, mobile
  friendliness, data protection (participant data), accessibility

## 6. Open questions for further planning

1. Target platform: web app, native app, or both?
2. Hosting: self-hosted (in line with the previous preference for open-source
   building blocks) or a managed service?
3. How many events in parallel / how many participants per event as a sizing
   assumption?
4. How is the "finance state" on the dashboard calculated when detailed finance
   management is not part of the scope — manual entry of a key figure or a later
   interface?
5. Raffle mechanism for tasks: wanted, or just an idea?
6. The precise cut of roles/permissions beyond the three assumed roles?

## 7. Next steps

This document serves as the basis for follow-up prompts on:
- **Functional specification** (data model, user stories, acceptance criteria per
  feature)
- **Product design** (screens/flows for the dashboard, task list, take-on-task
  flow)
- **System architecture** (tech stack, data storage, role/permission concept,
  hosting)
- **Further planning** (roadmap for the excluded areas, test/quality strategy)
