# Spezifikation: Event-Übersicht & Dashboard – Backend

---

## Hinweis zur Architektur

Dieses Dashboard ist Teil des Admin-Tools, nicht der Endnutzer-PWA — siehe [ADR-003](../adr/ADR-003-admin-dashboard-trennung.md). Es läuft ausschließlich lokal beim Administrator/Kernteam, ohne PWA-Anforderungen (Offline, Manifest, Service Worker).

---

## 1. Event-Service

**Model**
- Event: id, name, erstellt_am
- Teilnehmerliste: direkt aus Google-Sheet-Antworten abgeleitet (1:1, kein eigener Verwaltungsmechanismus) → entspricht dem Ticket-/Teilnehmer-Model aus Abschnitt 5
- Helferliste: Logik folgt später
- Kein Einladungsmechanismus, keine Rollen, kein Zugriffsschutz (Kernteam-only vorerst)

**Verantwortung**
- Event anlegen
- Basis-Referenz (event_id) für alle anderen Services
- Zentrale Speicherung, da "gemeinsames Projekt" bedeutet: alle Team-Mitglieder sehen denselben Stand — geht nur mit serverseitiger/zentraler Datenhaltung, nicht rein im Browser

**Offene Fragen**
- Keine offen.

---

## 2. Google-Integration-Service

**Verantwortung**
- Zugriff auf ein Google Sheet über einen **Service Account** (Google Cloud) – das Sheet wird dem Service Account wie einem normalen Google-Nutzer explizit freigegeben, Sheet bleibt ansonsten privat; kein OAuth-Consent-Flow, kein Nutzer-Login
- Auth: Service-Account-JSON-Keyfile wird serverseitig geladen, die Google Auth Library erzeugt daraus automatisch die benötigten Access-Tokens
- Datenabruf über die **Google Sheets API v4**: `GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}` mit Bearer-Token im Request; Response ist JSON (Array von Zeilen) – kein CSV-Parsing mehr nötig
- Sheet-Daten werden bei **jedem App-Start** neu vom Sheet abgerufen – keine Persistierung, kein Cache. Die Daten leben nur im Arbeitsspeicher des Prozesses und werden bei jedem Neustart frisch aufgebaut
- **Muss serverseitig laufen**: jetzt primär, weil das Service-Account-Keyfile ein Secret ist (darf nicht im Frontend-Bundle stehen) – der Access-Token wird serverseitig aus dem Keyfile erzeugt, ein Browser hat ohnehin keinen sinnvollen Weg, sich damit zu authentifizieren

**Technische Umsetzung**
- Library: **`google-auth-library`** (npm) – offizielle Google-Client-Library, übernimmt Laden des Keyfiles und Erzeugen/Erneuern der Access-Tokens (Scope `spreadsheets.readonly`)
- Konfiguration über Environment-Variablen, verwaltet über Secrets-Management (siehe Abschnitt 4):
  - `SHEET_ID` – Spreadsheet-ID (aus der Sheet-URL)
  - `SHEET_NAME` – Name des Tabellenblatts (entspricht dem Range-Parameter der Sheets API, z. B. `Formularantworten 1`)
  - `GOOGLE_SERVICE_ACCOUNT_KEY_FILE` – Pfad zum Service-Account-JSON-Keyfile
- Keyfile und `.env`-Datei liegen gemeinsam in einem eigenen, vollständig von der Versionskontrolle ausgeschlossenen Ordner (`envs/`)

**Daten-Model (In-Memory)**
- Generische Tabellenstruktur (Zeilen × Spalten), gültig für die Laufzeit des Prozesses

**Hinweis / Trade-off**
- Zugriff ausschließlich über Service Account, keine öffentliche Einsehbarkeit – das Sheet bleibt privat, der bisherige Datenschutz-Trade-off (öffentlicher Freigabelink, für jeden mit URL einsehbar) entfällt vollständig
- Ein Sheet hat genau **ein Tabellenblatt** – keine `gid`-Verwaltung/Auswahl mehrerer Blätter nötig; Range referenziert stattdessen Blattname/Zellbereich (z. B. `Formularantworten 1!A:Z`)

**Fehlerverhalten**
- Ist das Sheet beim App-Start nicht erreichbar (Netzwerkfehler, fehlende/ungültige Freigabe, ungültiges Keyfile etc.), wird ein Fehler geworfen. Keine stille Anzeige, kein leerer/veralteter Zustand ohne Hinweis.

**Offene Fragen**
- Keine offen.

---

## 3. Mail-Integration-Service

**Verantwortung**
- Postfach ist hardcoded (ein Postfach beim Webhoster, IMAP-Zugriff)
- Mails nach Kriterien durchsuchbar (Absender, Betreff, Zeitraum)
- Provider soll dabei egal sein (kein providerspezifischer Code)
- **Muss serverseitig laufen**: IMAP ist ein TCP-basiertes Protokoll, Browser-JavaScript hat keinen API-Zugriff auf rohe Sockets/IMAP

**Technische Umsetzung**
- Library: **`imapflow`** (npm) – aktiv gepflegt, TypeScript-typisiert, providerunabhängiger IMAP-Standard-Client
- Benötigte Zugangsdaten: E-Mail, Passwort, IMAP-Host, Port
- Konfiguration vorerst **nicht über UI**, sondern über **Environment-Variablen** (z. B. `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_HOST`, `MAIL_PORT`), verwaltet über Secrets-Management (siehe Abschnitt 4) – kein Eingabeformular in dieser Version

**Abfrage-Logik (ersetzt vorherigen Polling-/IMAP-IDLE-Ansatz)**
- Mails werden bei **jedem App-Start** automatisch abgefragt
- Kein manueller "Mails abfragen"-Button nötig, da ohnehin bei jedem App-Start neu abgefragt wird
- Kein Hintergrund-Polling, kein IMAP IDLE in dieser Version
- Da nichts persistiert wird (siehe Abschnitt 6, Trade-off), gibt es keinen gespeicherten "letzter Abruf"-Zeitpunkt – jede Abfrage durchsucht **alle** Mails, die dem Filterkriterium (Absender/Betreff) entsprechen

**Fehlerverhalten**
- Ist das Postfach beim Abfragen (App-Start) nicht erreichbar, wird ein Fehler geworfen. Keine stille Anzeige.

**Scope**
- Vorerst wird nur **ein einzelnes Event** unterstützt – keine Zuordnung von Zahlungsmails zu mehreren gleichzeitig laufenden Events nötig. Bei mehreren aktiven Events müsste diese Zuordnungslogik nachgezogen werden.

**Mail-Parsing (PayPal-Zahlungsbestätigung) – geklärt**
- Mail ist HTML, kein Bild → Body per IMAP als Text/HTML abrufbar, kein OCR nötig
- Filterkriterium Absender: `service@paypal.de`
- Betreff: "Du hast eine Zahlung erhalten"
- Betrag: aus Label-Wert-Paar „Erhaltener Betrag" (robuster als aus Fließtext)
- Name: aus Überschrift „[Name] hat dir [Betrag] gesendet" per Regex (`(.+?) hat dir`)
- Zusätzlich verfügbar, optional nutzbar: Transaktionscode, Transaktionsdatum

**Offene Fragen**
- Keine offen.

---

## 4. Secrets-Management-Service

**Zweck**: Zentrale, wiederverwendbare Ablage schützenswerter Werte (Service-Account-Keyfile, spreadsheetId/Range, Mail-Zugangsdaten) – dürfen nicht im Repository/Codebase landen, insbesondere nicht im Frontend-Bundle.

**Gängige Optionen**

| Option | Aufwand | Eignung |
|---|---|---|
| `.env`-Datei + `.gitignore` | Minimal | Basis-Schutz gegen versehentlichen Commit, Datei liegt aber unverschlüsselt auf dem Server |
| Environment-Variablen im Hosting-Admin-Panel | Gering | Von den meisten Webhostern/Deploy-Plattformen angeboten, Werte verschlüsselt beim Anbieter hinterlegt, nicht im Repo sichtbar |
| Dedizierter Cloud-Secrets-Manager (Google Secret Manager, AWS Secrets Manager, Azure Key Vault) | Mittel | Sinnvoll bei bestehender Cloud-Infra – hier aktuell nicht gegeben |
| Open-Source-Secrets-Tools (Infisical, Doppler, HashiCorp Vault) | Mittel–Hoch | Für Team-übergreifendes Secret-Sharing, Versionierung, Rotation – ab mehreren Umgebungen/Personen sinnvoll |

**Entscheidung für MVP**
- `.env` + `.gitignore` als Minimalschutz gegen Repo-Leaks
- Lokal liegen `.env`-Datei und Service-Account-Keyfile gemeinsam im Ordner `backend/envs/`, der vollständig über `.gitignore` ausgeschlossen ist (kein einzelnes Datei-Ignore, da sonst leicht ein neues Secret im Ordner vergessen wird)
- Tatsächlicher Laufzeitwert über das Environment-Variable-Feature des Webhosters (nicht im Repo)
- Betrifft: Service-Account-Keyfile (JSON), spreadsheetId und Sheet-Name/Range (Abschnitt 2), Mail-Zugangsdaten E-Mail/Passwort/Host/Port (Abschnitt 3)
- Läuft ausschließlich serverseitig — niemals ins Frontend-Bundle einbinden

**Offene Fragen**
- Keine offen.

---

## 5. Ticket-/Teilnehmer-Model

**Model**
- TicketEntry: id (Zeilennummer im Google Sheet, 1-basiert, Kopfzeile = Zeile 1 → erste Dateneile = 2), event_id, firstName, lastName, name (zusammengesetzt), category, price (fix je Kategorie), timestamp, wantsToHelp
- `id` dient dem Payment-Matching-Service (Abschnitt 6) als `ticketEntryRef`; `firstName`/`lastName` werden dort zusätzlich zum zusammengesetzten `name` für den Initial+Nachname-Match benötigt

**Verantwortung**
- Sheet-Struktur ist pro Event fix → direktes Mapping Spalte→Feld, im ersten Entwurf hardcoded (kein UI-Mapping-Tool)
- Spalten-Mapping (Stand aktuelles Formular):
  - `Zeitstempel` → `timestamp`
  - `Vorname` + `Nachname` → `firstName`, `lastName`, sowie zusammengesetzt `name`
  - `Ticketkategorie (Preis pro Person inkl. Verpflegung)` → `category`
  - `Mitmachen` → `wantsToHelp` (fließt in die Teilnehmerliste ein, wird aber nicht aggregiert, siehe Abschnitt 7)
  - `E-Mail-Adresse` → **ignoriert**, kein Feld im Ticket-Model
- Preis-Zuordnung (fest hardcodiert, Kategorie-String → Preis):

  | Kategorie | Preis |
  |---|---|
  | 4er / 5er Zimmer | 175 € |
  | 7er / 8er Zimmer | 160 € |
  | Bus / Campervan (begrenzte Stellplätze) | 175 € |

- Bereitstellung der Liste für Frontend (Dashboard/Aggregation) über API

**Offene Fragen**
- Preis-Tabelle basiert auf den bisher beobachteten Formular-Antworten — falls das Formular weitere Kategorien anbietet, die noch nicht ausgewählt wurden, fehlen diese in der Lookup-Tabelle und müssten ergänzt werden.

---

## 6. Payment-Matching-Service

**Model**
- Payment: ticketEntryRef (optional — leer bei `unclearReason: name`), amount (optional — leer bei `unclearReason: amount`), paidAt, status (**paid/unclear** — kein `open`, siehe unten), unclearReason (name/amount — nur gesetzt wenn status=unclear), manuallyOverridden (bool)
- Eine Payment entsteht ausschließlich aus einer tatsächlich eingegangenen Zahlungs-Mail (Abschnitt 3) — daher kein `open` auf diesem Model, dieser Zustand existiert nur abgeleitet (siehe unten)
- **Abgeleiteter Zahlungsstatus pro TicketEntry** (open/paid/unclear; wird von Abschnitt 7/8/9 konsumiert, nicht direkt auf `Payment` gespeichert):
  - `paid`, wenn mindestens eine zugeordnete Payment `status: paid` hat
  - `unclear`, wenn keine `paid`-Payment existiert, aber mindestens eine mit `unclearReason: amount`
  - `open`, wenn keine zugeordnete Payment existiert
  - Payments mit `unclearReason: name` (kein `ticketEntryRef`) bleiben als eigenständige, keinem TicketEntry zugeordnete Liste sichtbar ("nicht zuordenbare Payments")

**Verantwortung**
- Matching über Name, **reines String-Matching ausreichend** (kein Fuzzy-Matching). Ein Treffer liegt vor, wenn mindestens eine der folgenden Regeln zutrifft (Vergleich jeweils case-insensitive, Whitespace getrimmt/normalisiert):
  1. **Vollname-Match**: `firstName + " " + lastName` (aus Sheet) entspricht dem aus der Mail extrahierten Namen
  2. **Initial+Nachname-Match**: erster Buchstabe des ersten Worts im Mail-Namen entspricht dem ersten Buchstaben des Vornamens (Sheet), UND das letzte Wort im Mail-Namen entspricht dem Nachnamen (Sheet) — deckt humorvoll abweichende PayPal-Kontonamen ab (z. B. „Felix Müller" → „Fuck Müller")
  - Annahme: PayPal-Namen bestehen immer aus mindestens zwei Wörtern; ein Doppel-Vorname wird im PayPal-Namen als ein zusammengeschriebenes Wort erwartet, wird also von Regel 2 automatisch mit abgedeckt. Andere Sonderfälle (z. B. zusammengesetzte Nachnamen wie „von Müller") werden vorerst nicht gesondert behandelt.
- Betrag wird automatisch ausgelesen (siehe Abschnitt 3), fließt aber **nicht** ins automatische Matching ein – Prüfung der Betragshöhe erfolgt manuell durch einen Menschen. Ist der Betrag nicht eindeutig auslesbar, wird er nicht übernommen (kein Rate-/Best-Effort-Wert)
- Bei Mehrdeutigkeit: Eintrag als "unclear" markiert statt automatisch zugeordnet, mit Grund im Feld `unclearReason`:
  - `unclearReason: name` — kein Treffer, mehrere Treffer, oder Name aus Mail nicht parsebar (Namens-Matching also nicht eindeutig möglich)
  - `unclearReason: amount` — Namens-Matching eindeutig, aber Betrag nicht eindeutig auslesbar
  - Treffen beide Fälle gleichzeitig zu, hat `unclearReason: name` Vorrang (blockiert die eigentliche Zuordnung); ein trotzdem lesbarer Betrag wird dennoch mitgespeichert
- Status manuell überschreibbar (z. B. Korrektur durch Helfer) — lebt nur im Arbeitsspeicher des laufenden Prozesses, keine Persistierung (siehe Trade-off unten)
- Verarbeitet Rohdaten aus Abschnitt 3 (Mail), läuft daher zwangsläufig dort, wo diese Daten verfügbar sind: serverseitig
- Beziehung Payment↔TicketEntry ist **1:n ohne Aggregation** – ein TicketEntry kann mehrere zugeordnete Payments haben (z. B. Doppel-/Teilzahlung), es gibt keine automatische Summenbildung/Schwellenwert-Logik pro TicketEntry; der Mensch entscheidet anhand der einzelnen Einträge
- Läuft **automatisch bei jedem App-Start**, direkt im Anschluss an Sheet-Abruf (Abschnitt 2) und Mail-Abfrage (Abschnitt 3) – kein manueller Trigger, konsistent mit dem Muster der beiden vorgelagerten Services
- Matching-Kandidaten: alle TicketEntries des aktuell geladenen Events, keine `event_id`-Filterung (passend zum aktuellen Scope „nur ein Event", siehe Abschnitt 3)

**Hinweis / Trade-off**
- Mail-Daten und Zahlungsstatus werden bei jedem App-Start neu aus den Mails aufgebaut (keine Persistenz, siehe Abschnitt 3) – eine manuelle Korrektur ("unclear" → "paid") überlebt daher keinen Neustart des Servers. Akzeptiert für den MVP, da bisher nur sehr wenige Mails/Events anfallen; Persistenz kann bei Bedarf später ergänzt werden.

**Offene Fragen**
- Keine offen.

---

## 7. Aggregations-Service

**Verantwortung**
- Generisch: nimmt Sheet-Spaltenüberschrift als Gruppierungskriterium ("gruppiere nach Spalte X")
- Output: Anzahl + Namensliste je Ausprägung
- Läuft serverseitig im Node/Express-Backend, direkt auf den TicketEntries (Abschnitt 5); Ergebnis wird über die REST-API (Abschnitt 9) ausgeliefert
- `wantsToHelp` (Spalte `Mitmachen`) wird nicht als Aggregationskriterium herangezogen — nur Kategorie/andere Sheet-Spalten

**Offene Fragen**
- Keine offen.

---

## 8. Finanz-Service

**Verantwortung**
- **Bezahlt**: Summe aller TicketEntries mit Status "paid"
- **Erwartet**: Summe aller TicketEntries inkl. "unclear" markierter Payments
- Währung/Formatierung fix
- Läuft serverseitig im Node/Express-Backend, Ergebnis wird über die REST-API (Abschnitt 9) ausgeliefert

**Offene Fragen**
- Keine offen.

---

## 9. Dashboard-Daten-API

**Verantwortung**
- Node/Express-Backend stellt die aufbereiteten Dashboard-Daten (Teilnehmerübersicht, Finanzübersicht, künftig Aufgabenstatus) über eine **REST-API** bereit
- Bei App-Start: Sheet-Daten werden neu abgerufen und Mail-Abfrage ausgeführt (siehe Abschnitte 2 + 3); Aggregation (Abschnitt 7) und Finanzkennzahlen (Abschnitt 8) werden auf dieser Basis berechnet und über die API ausgeliefert
- Feste Reihenfolge der Widgets wird vom Angular-Frontend festgelegt (siehe Frontend-Spec):
  - Oben links: Teilnehmerübersicht
  - Oben rechts: Finanzübersicht
  - Darunter: weitere Widgets (Aufgabenstatus etc., später)

**Offene Fragen**
1. Konkrete Struktur/Aufteilung der REST-Endpunkte (z. B. ein aggregierter `/dashboard`-Endpoint vs. einzelne Endpunkte je Widget) — noch zu spezifizieren.

---

## Schnittstelle zum Frontend

Das Dashboard-Frontend ist eine eigenständige Angular-Anwendung (client-seitig gerendert, kein SSR, siehe [ADR-004](../adr/ADR-004-backend-stack-dashboard.md)). Sie bezieht die aufbereiteten Daten über die REST-API (Abschnitt 9) vom Node/Express-Backend. Business-Logik (Aggregation, Finanzberechnung, Google-Sheet-/Mail-Integration) bleibt vollständig serverseitig; das Frontend übernimmt reine Darstellung/Interaktion.

---

## Design Thinking & Lean-Hinweise (Backend)

- **Fake it before you build it**: Google Forms/Sheets als Ticketing-Lösung ist bereits der Lean-MVP – validiert den Bedarf, bevor eine eigene Ticket-Datenbank gebaut wird.
- **Mail-Matching zuerst manuell testen**: Vor automatisiertem Matching (Abschnitt 6) das Verfahren an 1–2 echten Events von Hand prüfen (Wizard-of-Oz-Prinzip).
- **Kleinster Slice zuerst**: Reine Leseintegration vor Schreiblogik/Automatisierung.
- **Rollen bewusst später**: Kein Zugriffsschutz/Rollen im MVP (Abschnitt 1) – Rollenmodell erst einführen, wenn App für Helfer freigegeben wird (Build-Measure-Learn statt Vorab-Overengineering).
