# CLAUDE.md

## Documentation

- **`docs/design/`** — user needs from a design perspective: the problem to
  solve and the decisions on how to solve it, with no technical detail. May
  include user stories; should include functional, non-technical acceptance
  criteria. These docs are persistent: they are the source of truth and the
  basis for everything else.
  - **`docs/design/features-backlog.md`** — a list of features that don't have
    their own design doc yet. When a feature gets its own doc, remove it from
    the backlog.
- **`docs/specs/`** — translate the design docs into specifications of how the
  solution is implemented. They range from high-level descriptions to low-level
  detail, may get technical, and usually contain the data model. Specs are
  usually temporary implementation planners, not persisted: they are derived
  from the design docs, and the ADRs already persist the important technical
  decisions.
- **`docs/adr/`** — a record of the architectural decisions made along the way.
  See [adr-overview.md](./docs/adr/adr-overview.md) for the index.
