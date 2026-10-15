# Dashboard – frontend

Technical setup of the dashboard page. What the dashboard shows:
[design/admin-dashboard.md](../design/admin-dashboard.md), implementation: [dashboard.md](./dashboard.md). General frontend setup:
[frontend.md](./frontend.md).

---

## Layout

Two-column CSS grid, collapsing to a single column below ~900px. Widgets are
full width when stacked. Interactive elements use tap targets of at least 44px.

Desktop-first: mobile must not break, but there is no separate mobile design.

---

## Widgets

Each widget is a feature folder (`features/participants/`, `features/finance/`)
whose widget module exports a `mount(container)` function that renders itself
into the given element and starts loading its data. `main.js` holds the ordered
`WIDGETS` list; the dashboard page creates one container per entry inside the
grid and calls each `mount`. There is no shared state and no communication
between widgets.

### Widget card

`shared/widget-card/widget-card.js` provides the chrome shared by every widget:
the title, the card frame, and the loading, error and empty states. It exports a
factory returning the card element together with the functions that switch its
body between states:

- `showLoading()`
- `showError(message)`
- `showEmpty(message)`
- `showContent(node)`

Widgets build their own content nodes and hand them over. They never implement
state handling themselves, so a new widget gets correct loading, error, and empty
behaviour for free. The loading state is text, not a skeleton — a skeleton would
have to be shaped per widget, which would move the loading state out of the
card and into every widget.

The card header also has a **controls slot**, filled via `setControls(node)`.
Controls live outside the body, so they survive every state change — e.g. the
participant grouping switch stays usable after an error.

### Segmented control

`shared/segmented-control/` is a button group with one active option, used for
the participant grouping switch.

### Formatting

`shared/format.js` holds the `de-DE` currency and count formatting. The currency
formatter is created once
(`new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })`) and
reused. The backend returns raw numbers; all formatting is the frontend's job.
