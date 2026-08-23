# ADR-003: Trennung Endnutzer-PWA und Admin-Dashboard

## Status
Angenommen

## Kontext
Die App hat zwei unterschiedliche Nutzergruppen mit unterschiedlichen Anforderungen:
- **Endnutzer:innen** (Teilnehmer:innen, Helfer:innen) — nutzen die App auf verschiedenen Geräten, verteilt, siehe [ADR-001](./ADR-001-frontend-stack.md).
- **Administrator:innen/Kernteam** — nutzen das Event-Dashboard (Teilnehmerübersicht, Finanzstand, Google-Sheet- und Mail-Integration) ausschließlich lokal. Laut Backend-Spec ist das Dashboard ohnehin "Kernteam-only", vorerst ohne Rollen/Zugriffsschutz.

ADR-001 legt für die Endnutzer-App eine PWA fest (Offline-Fähigkeit, Manifest, Service Worker, potenziell App-Store-Distribution via Capacitor). Diese Eigenschaften sind für ein lokal vom Administrator genutztes Dashboard nicht erforderlich.

## Entscheidung
Das Admin-Dashboard wird als **eigenständiges, backend-artiges Tool** umgesetzt — getrennt von der Endnutzer-PWA:
- Läuft lokal beim Administrator/Kernteam, keine Distribution an Endnutzer:innen
- Kein PWA-Zwang (kein Manifest, Service Worker, Offline-Anforderung)
- Besteht aus einem Node/Express-Backend (Aggregation, Finanzkennzahlen, Google-Sheet-/Mail-Integration) und einem separaten Angular-Frontend, das die Daten per REST bezieht — kein SSR, siehe [ADR-004](./ADR-004-backend-stack-dashboard.md)

ADR-001 (Angular PWA) gilt ausschließlich für die Endnutzer-App.

## Begründung
- Vermeidet unnötige PWA-Komplexität für ein Tool, das nur lokal von einer Person/einem kleinen Team genutzt wird
- Passt zum "Kernteam-only"-Scope der Backend-Spec — kein Zugriffsschutz nötig, da kein Fremdzugriff über verteilte Geräte
- Entkoppelt Release-Zyklen: Dashboard-Änderungen erfordern keinen Rollout an Endnutzer-Geräte

## Verworfene Alternativen
- **Dashboard als Admin-Route innerhalb derselben PWA** — verworfen: vermischt Endnutzer- und Admin-Oberfläche, würde Zugriffsschutz erfordern, den es beim rein lokalen Betrieb aktuell nicht braucht

## Konsequenzen
- Zwei getrennte Anwendungsteile im Repo (Endnutzer-PWA, Admin-Dashboard) — Projektstruktur ([ADR-002](./ADR-002-projektstruktur.md)) ist bei konkreter Ordnertrennung entsprechend zu erweitern
- Konkrete Framework-Wahl für das Dashboard-Backend siehe [ADR-004](./ADR-004-backend-stack-dashboard.md)
