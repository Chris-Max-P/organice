# Spezifikation: Event-Übersicht & Dashboard – Frontend

---

## Hinweis zur Architektur

Dieses Dashboard ist Teil des Admin-Tools, nicht der Endnutzer-PWA — siehe [ADR-003](../adr/ADR-003-admin-dashboard-trennung.md). Es läuft ausschließlich lokal beim Administrator/Kernteam, ohne PWA-Anforderungen (Offline, Manifest, Service Worker).

Das Dashboard ist eine eigenständige **Angular-Anwendung** (client-seitig gerendert, kein SSR) — siehe [ADR-004](../adr/ADR-004-backend-stack-dashboard.md). Aggregation, Finanzberechnung und Google-Sheet-/Mail-Integration laufen weiterhin serverseitig im Node/Express-Backend (Backend-Spec, Abschnitte 2–9); das Frontend ruft die aufbereiteten Daten per REST/HTTP ab und übernimmt Darstellung/Interaktion, enthält aber keine eigene Business-Logik.

Mails werden bereits serverseitig bei jedem App-Start automatisch abgefragt (Backend-Spec, Abschnitt 3) — ein manueller "Mails abfragen"-Button ist daher nicht nötig.

---

## 1. Darstellung

**Verantwortung**
- Abruf der Dashboard-Daten vom Backend per REST (siehe Backend-Spec, Abschnitt 9) und clientseitiges Rendering
- Feste Widget-Reihenfolge:
  - Oben links: Teilnehmerübersicht
  - Oben rechts: Finanzübersicht
  - Darunter: weitere Widgets (Aufgabenstatus etc., später)

**Offene Fragen**
- Keine offen.

---

## Design Thinking & Lean-Hinweise (Frontend)

- **Dashboard-Prototyp vor Integration**: Layout zuerst mit Mock-Daten/statischem HTML testen, um zu prüfen, ob die Darstellung (Widget-Anordnung, Aggregationsansicht) den Bedarf trifft, bevor die echte REST-Anbindung steht.
