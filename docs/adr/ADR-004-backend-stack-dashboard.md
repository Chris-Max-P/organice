# ADR-004: Backend-Stack für Admin-Dashboard

## Status
Angenommen

## Kontext
[ADR-003](./ADR-003-admin-dashboard-trennung.md) trennt das Admin-Dashboard von der Endnutzer-PWA, legt aber die konkrete Technologie noch nicht fest. Zur Wahl standen für die serverseitige Google-Sheet-/Mail-Integration:
- Serverseitiger Code innerhalb einer Angular-SSR-App (`@angular/ssr`)
- Ein eigenständiges Node/Express-Backend, entkoppelt von Angular

Die Backend-Spec (Abschnitt 2, Google-Integration-Service) verlangt, dass Sheet-Link (Secret) und Google-CSV-Zugriff strikt serverseitig bleiben und nie im Frontend-Bundle landen. Bei Angular SSR ist diese Trennung nicht strukturell erzwungen, sondern muss über das Build-Setup aktiv sichergestellt werden (Gefahr, dass server-only Code versehentlich im Client-Bundle landet).

## Entscheidung
Das Admin-Dashboard besteht aus zwei getrennten Teilen:
- Einem **eigenständigen Node/Express-Backend**, das sämtliche Secrets sowie die Google-Sheet- und Mail-Integration hält und die aufbereiteten Daten über eine **REST-API** bereitstellt
- Einer **Angular-Anwendung als Dashboard-Frontend** (client-seitig gerendert, kein SSR, kein PWA-Zwang gemäß ADR-003), die diese Daten per REST/HTTP vom Backend abruft und darstellt

Es gibt kein Server-Side Rendering mehr — das Node/Express-Backend liefert ausschließlich JSON über REST, keine fertig gerenderten HTML-Seiten.

## Begründung
- Secrets (Sheet-Link, Mail-Zugangsdaten) sind strukturell vom Angular-Frontend getrennt: Angular läuft rein client-seitig im Browser und bekommt nie Zugriff auf die serverseitige Integrationslogik, nur auf die REST-Antworten
- Nutzt vorhandene Angular-Expertise auch fürs Dashboard-Frontend (vgl. [ADR-001](./ADR-001-frontend-stack.md))
- Node/Express bleibt für die eigentliche Integrationslogik zuständig — geringerer Setup-Aufwand für Sheet-/Mail-Zugriff als Angular SSR, passt zum Lean/MVP-Ansatz der Specs ("Kleinster Slice zuerst")

## Verworfene Alternativen
- **Angular SSR** (serverseitiger Code direkt in der Angular-App) — verworfen: zusätzliches Risiko, dass server-only Code (Secrets, `imapflow`) versehentlich in den Client-Bundle gelangt; kein Vorteil gegenüber getrennten Teilen, da UI ohnehin nicht mit der Endnutzer-PWA geteilt wird (ADR-003)
- **Serverseitig gerenderte HTML-Seiten** (z. B. Template-Engine wie EJS) statt REST-API — verworfen zugunsten einer Angular-SPA für das Dashboard-Frontend

## Konsequenzen
- Node/Express liefert nur JSON über REST-Endpunkte; konkrete Struktur/Aufteilung der Endpunkte ist noch offen — nächster Punkt
- Kein Codesharing (Komponenten/Templates) zwischen Endnutzer-PWA und Dashboard; TypeScript-Interfaces/Models können bei Bedarf dennoch geteilt werden
- Sheet-Daten benötigen keine Persistenz: sie werden bei jedem App-Start frisch vom Sheet geladen und nur im Arbeitsspeicher gehalten (siehe Backend-Spec, Abschnitt 2)
- Zahlungsstatus benötigt ebenfalls keine Persistenz: wird bei jedem App-Start neu aus den Mails aufgebaut (siehe Backend-Spec, Abschnitt 6) – Konsequenz: manuelle Korrekturen überleben keinen Neustart, akzeptiert für den MVP bei aktuell geringem Mail-Aufkommen
- Damit kommt das Dashboard-Backend vorerst ohne eigene Datenbank/Persistenzschicht aus
- Kein manueller "Mails abfragen"-Button mehr nötig, da Mails ohnehin bei jedem App-Start neu abgefragt werden
