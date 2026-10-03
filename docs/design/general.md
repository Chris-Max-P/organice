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

## 3. Target group & roles (assumption, to be confirmed)

- **Organiser** — creates events, manages task circles, sees everything
- **Circle/area lead** — is responsible for a task circle, distributes tasks
  within the circle
- **Helper / participant** — sees tasks according to visibility, takes on tasks

The role model and permissions are to be specified in more detail in a follow-up
prompt.

## Feature overview
Feature descriptions found in docs/design

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
