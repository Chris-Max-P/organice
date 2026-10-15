# Dashboard

The core team's event overview: who has signed up and how much has been paid.
Implementation: [specs/dashboard.md](../specs/dashboard.md).

---

## Scope

- Participant numbers (actual figure, possibly in relation to a target)
- Finance state at the level of key figures — details deliberately out of scope
- Task status (e.g. share done/open/in progress, possibly by circle or category)
  — later
- One event at a time; creating an event is a feature of its own
  ([event.md](./event.md))
- Used by the core team only, on their own computer

Page title and heading: the event's name. Fixed widget order:

- Top left: participant overview
- Top right: finance overview
- Below: further widgets (task status etc., later)

---

## Data sources

- **Sign-ups** come from the Google Form; its answer sheet is the ticketing
  solution. One answer is one sign-up (ticket): name, ticket category, sign-up
  time, and whether the person wants to help. The email address is not used.
- **Payments** come from PayPal payment confirmation mails in the event's
  mailbox. Each mail yields the payer's name and the amount received.
- **Ticket price** is taken from the category label in the form (e.g.
  `4er / 5er Zimmer ➡️ 175€`), not from a separate price list. The form stays the
  single source of truth: new categories and price changes need no change to the
  app. If a label contains no price, the sign-up is still shown and counts as 0
  in the finance figures. A malformed answer never prevents the dashboard from
  loading.
- **Freshness**: new sign-ups or payments only appear after the app is
  restarted. There is no refresh button, because it would imply a freshness the
  app cannot deliver.
- **Fail loudly**: if the sheet or the mailbox cannot be read, the dashboard
  shows an error — never an empty or outdated state without notice.

---

## Payment matching

Each payment is assigned to a sign-up automatically, by name only. A payment
matches a sign-up when the payer's name is

1. the sign-up's full name, or
2. the same first initial and the same last name — this covers jokey PayPal
   account names ("Felix Müller" → "Fuck Müller").

- The amount does **not** affect the matching. A person checks it. An amount
  that cannot be read is not guessed.
- A payment is **unclear** instead of assigned when the name matches nobody,
  matches several people or cannot be read — it is then listed as
  "unassignable" — or when the name matches but the amount cannot be read.
- One sign-up can have **several payments** (double or partial payment). They
  are not added up or checked against the price; the core team decides from the
  individual payments.

**Payment status per sign-up**

| Status | When |
|---|---|
| Paid | at least one of its payments is paid |
| Unclear | no paid payment, but one whose amount could not be read |
| Open | no payment |

**Manual correction** (later): the core team can correct a status (e.g.
unclear → paid). The correction is lost when the app restarts — accepted for
the MVP.

---

## Participant overview

Card title: "Teilnehmerübersicht".

- **Grouping switch**: "Kategorie" (default) or "Helfer" (whether the person
  wants to help).
- **Total**: the number of sign-ups across all groups ("Gesamt: 42").
- **Groups**: one row per group with its label and count; expanding a row lists
  its members (first and last name). Several groups may be open at once; all
  start collapsed, and switching the grouping collapses them again.
- **No sorting.** Groups and members appear in sign-up order, so the order can
  shift as new sign-ups arrive.
- **Labels are shown exactly as typed** in the form, including price and emoji.
- A blank answer is shown as **"Keine Angabe"**.

## Finance overview

Card title: "Finanzübersicht".

- Exactly two figures:
  - **Bezahlt** — the summed price of all sign-ups with status paid
  - **Erwartet** — the summed price of all sign-ups, regardless of status: the
    full revenue if everyone who signed up pays
- No outstanding amount, no progress bar, no percentage.
- Shown in euros, German format (`1.234,50 €`).

## Loading, error and empty states

Each widget loads on its own and shows its own state:

- **Loading**: "Wird geladen …"
- **Error**: "Daten konnten nicht geladen werden" — never a silent blank. No
  automatic retry and no retry button.
- **Empty**: "Noch keine Anmeldungen" — clearly different from the error. Only
  the participant overview can be empty; `0,00 €` in the finance overview is a
  real figure, not emptiness.

---

## Lean notes

- **Fake it before you build it**: Google Forms/Sheets as the ticketing solution
  is the lean MVP – it validates the need before a dedicated ticketing system is
  built.
- **Test payment matching manually first**: before relying on the automatic
  matching, check the procedure by hand on 1–2 real events (Wizard of Oz
  principle).
- **Smallest slice first**: reading data before writing it.
- **Roles deliberately later**: no access control or roles in the MVP — introduce
  them only when the app is released to helpers.
