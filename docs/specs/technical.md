# Technical planning

Project context: [general.md](../design/general.md).

## 1. Quality goals for further planning

Since high software quality is an explicit goal, follow-up prompts should address
among other things:
- A clear, testable functional specification per feature (acceptance criteria)
- The data model per feature
- A permission/role concept
- Architecture decisions (frontend/backend split, hosting/self-hosting, data
  storage)
- Extensibility with a view to the excluded areas (finances, guests, governance)
  — the data model should not block later integration
- Non-functional requirements: multi-user capability/concurrency, mobile
  friendliness, data protection (participant data; Matrix foundation: open spec for safe communication -> usable?), accessibility

## 2. Open questions for further planning

1. Hosting: self-hosted (in line with the previous preference for open-source
   building blocks) or a managed service?
2. How many events in parallel?

Answered: target platform (PWA, [ADR-001](../adr/ADR-001-frontend-stack.md)),
participants per event ([general.md](../design/general.md), section 2), raffling
tasks (out, see [tasks.md](../design/tasks.md)), roles
([general.md](../design/general.md), section 4).
