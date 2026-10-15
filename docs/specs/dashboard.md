# Dashboard – implementation

How the dashboard ([design/admin-dashboard.md](../design/admin-dashboard.md))
is implemented. Setup details: [dashboard-backend.md](./dashboard-backend.md),
[dashboard-frontend.md](./dashboard-frontend.md).

**Architecture note**: the dashboard is part of the admin tool and runs
exclusively locally (no end-user access) — see
[ADR-003](../adr/ADR-003-admin-dashboard-trennung.md). It is separate from the
end-user PWA ([ADR-001](../adr/ADR-001-frontend-stack.md)).

---

## Data sources

- Sheet and mailbox are read once at backend start into an in-memory snapshot
  (see [dashboard-backend.md](./dashboard-backend.md), "Event data at startup").
  A restart is what refreshes the data
- A failing read aborts the backend start; the frontend then shows the error
  state in every widget
- The price is parsed from the trimmed category label (a number followed by
  `€`). Without a match the entry gets `price: null`

---

## Payment matching

- Name comparison is case-insensitive, with whitespace trimmed and normalised.
  Plain string matching, no fuzzy matching
- Initial + surname: first letter of the first word of the mail name vs. first
  letter of the first name, and last word of the mail name vs. last name
- Assumptions: PayPal names have at least two words; a double first name appears
  as one word and is covered by the initial rule. Compound surnames (e.g.
  "von Müller") are not handled separately
- Unclear payments carry a reason: `name` (no `ticketEntryRef`, listed as
  unassignable) or `amount`. If both apply, `name` wins; a readable amount is
  still stored
- A `Payment` only exists for a mail that arrived, so it is either `paid` or
  `unclear`; `open` is derived per sign-up
- Matching candidates are all sign-ups of the loaded event, no `event_id`
  filter (single-event scope)

---

## Participant overview

- The backend groups the sign-ups by a whitelisted field (`category`,
  `wantsToHelp`); neither backend nor frontend sorts
- The frontend discards responses that arrive after the grouping has changed
  again, so a slow request cannot overwrite a newer one
- Labels are rendered raw; the frontend does not parse or shorten them

---

## Finance overview

- Sign-ups with `price: null` count as 0 in both figures
- The backend returns raw numbers rounded to 2 decimal places (defensive against
  floating-point sums); all formatting happens in the frontend
