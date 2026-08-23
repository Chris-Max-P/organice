# CLAUDE.md

Kontext für Claude Code. Details siehe jeweilige ADR in `/docs`.

## Vorgehen beim Implementieren
In jedem Modul das wir implementieren, gehen wir wie folgt vor. Du führst mich durch die einzelnen Schritte, wenn ich dir sage, dass wir ein Modul implementieren.
1. sag mir: welche Fragen sind noch offen, um das Modul implementieren zu können. Gib mir die ganze Liste an Fragen aus und führe mich danach einzeln durch die Fragen. Gib mir bei jeder Entscheidung relevante Hintergrundinfos über die Möglichkeiten.
2. erstelle Ordnerstruktur und files mit leeren Methoden
3. schreibe Tests (test-driven development)
4. starte Implementierung
5. prüfe ob Tests laufen

## ADR-Übersicht

| ADR | Thema | Zusammenfassung |
|---|---|---|
| [ADR-001](./docs/adr/ADR-001-frontend-stack.md) | Frontend-Stack | Angular als PWA, später optional Capacitor für native Apps |
| [ADR-002](./docs/adr/ADR-002-projektstruktur.md) | Projektstruktur & KI-Entwicklung | `/docs`-Ordner für Anhänge/ADRs, KI-gestützte Entwicklung mit Claude |
| [ADR-003](./docs/adr/ADR-003-admin-dashboard-trennung.md) | Admin-Dashboard-Trennung | Admin-Dashboard ist eigenständiges, lokal genutztes Backend-Tool, getrennt von der Endnutzer-PWA |
| [ADR-004](./docs/adr/ADR-004-backend-stack-dashboard.md) | Backend-Stack Admin-Dashboard | Node/Express-Backend (REST-API) + separates Angular-Frontend, kein SSR |
