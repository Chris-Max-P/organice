# Organice

An app for organising self-organised group events. The current scope covers a
local-only admin dashboard for a single event: participant overview, finance
figures, and the Google Sheet / mail integrations that feed them.

## Language

### Event

**Event**:
A gathering organised as a shared project by a core team. Currently only one
event is supported at a time.
_Avoid_: Project, camp

**Core Team**:
The small group of people who organise an Event and are the only users of the
admin dashboard. There is no role model or access control.
_Avoid_: Admin, organiser (as a distinct role)

### Participants

**Participant**:
One person attending an Event. Derived one-to-one from a single Google Form
submission — one form row is exactly one person, never a group booking.
_Avoid_: Attendee, guest, ticket holder, member

**TicketEntry**:
The model name for a Participant as read from the Google Sheet. Same concept as
Participant, not a separate one; prefer "Participant" in prose and UI, and
reserve "TicketEntry" for code that maps sheet rows.

**Ticket Category**:
The accommodation option a Participant chose, which determines their price. The
category label is maintained by hand in the Google Form and carries the price
inside the text (e.g. `4er / 5er Zimmer ➡️ 175€`).
_Avoid_: Ticket type, room type, price class

**Helper**:
A Participant who indicated in the form that they want to help. This is a stated
intention, not an assigned duty — there is no task assignment in this scope.
_Avoid_: Volunteer, staff

### Payments

**Payment**:
A single received payment, derived from one PayPal confirmation mail. A Payment
only exists because money actually arrived; it is never created in advance.
_Avoid_: Transaction, transfer, booking

**Payment Status**:
The state of a single Participant's payment, derived from the Payments matched
to them: `paid`, `unclear`, or `open`. It is computed, never stored on the
Payment itself.

**Unclear**:
A Payment that could not be confidently attributed — either the name could not
be matched, or the amount could not be read. Requires a human decision.
_Avoid_: Pending, failed, error

**Paid**:
The summed price of all Participants whose Payment Status is `paid` — money
actually received.
_Avoid_: Revenue, income, actual

**Expected**:
The summed price of all Participants regardless of Payment Status — the full
amount if everyone who signed up pays.
_Avoid_: Target, forecast, planned

### Dashboard

**Widget**:
One self-contained panel on the dashboard, backed by its own API endpoint and
loading independently of the others.
_Avoid_: Card, tile, panel, module

**Aggregation Group**:
Participants sharing one value of a grouping field, delivered as the value, a
count, and the list of members.
_Avoid_: Bucket, cluster, segment

**Grouping Field**:
The Participant field an aggregation groups by. Currently `category` or
`wantsToHelp`.
_Avoid_: Dimension, facet, axis
