# Dashboard – backend

Technical setup of the dashboard's data sources. What the dashboard shows:
[design/admin-dashboard.md](../design/admin-dashboard.md), implementation: [dashboard.md](./dashboard.md). General backend setup: [backend.md](./backend.md).

---

## Event data at startup

- `loadEventData()` (`core/event-data/`) runs the sheet fetch, the mail query
  and the payment matching once, before `app.listen`
- The result, an `EventData` snapshot (TicketEntries + Payments), lives only in
  the process's memory and is handed to every feature router — no re-fetch per
  request, no persistence, no cache
- If the sheet or the mailbox is unreachable, an error is thrown and the server
  does not start (see [backend.md](./backend.md), "Startup"). No silent display,
  no empty or stale state without notice

---

## Google Sheets integration

`core/integrations/google-sheets/`

- Access to a private Google Sheet via a **service account** (Google Cloud) – the
  sheet is shared with the service account like with a normal Google user, and
  otherwise stays private; no OAuth consent flow, no user login
- Library: **`google-auth-library`** (npm) – loads the keyfile and
  generates/renews the access tokens (scope `spreadsheets.readonly`)
- Data retrieval via the **Google Sheets API v4**:
  `GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}`
  with a bearer token; the response is JSON (an array of rows)
- A sheet has exactly **one worksheet**; the range references the sheet name
  (e.g. `Formularantworten 1!A:Z`)
- **Must run server-side**: the keyfile is a secret and must not appear in the
  frontend bundle; a browser has no sensible way to authenticate with it anyway

**Configuration** (environment variables, see [backend.md](./backend.md),
"Secrets"):

- `SHEET_ID` – spreadsheet ID (from the sheet URL)
- `SHEET_NAME` – name of the worksheet (e.g. `Formularantworten 1`)
- `GOOGLE_SERVICE_ACCOUNT_KEY_FILE` – path to the service account JSON keyfile

---

## Mail integration

`core/integrations/mail/`

- One hardcoded mailbox at the web host, IMAP access
- Library: **`imapflow`** (npm) – provider-independent standard IMAP client; no
  provider-specific code
- Mails are searchable by sender, subject and time range. Payment mails are
  filtered by sender `service@paypal.de` and subject "Du hast eine Zahlung
  erhalten"
- No background polling, no IMAP IDLE. Since nothing is persisted, there is no
  "last fetch" timestamp – every query searches **all** matching mails
- **Must run server-side**: IMAP is TCP-based, and browser JavaScript has no
  access to raw sockets
- Only a **single event** is supported, so payment mails need no assignment to
  an event

**Configuration** (environment variables, see [backend.md](./backend.md),
"Secrets"): `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_HOST`, `MAIL_PORT`. No input
form.

---

## Not yet implemented: manual payment status override

The `Payment` model carries `manuallyOverridden`, but nothing sets it yet.

- The core team can override a payment's status (e.g. "unclear" → "paid")
- The override lives only in the memory of the running process: payments are
  rebuilt from the mails on every start, so an override does not survive a
  restart. Accepted for the MVP; persistence can be added later if needed
