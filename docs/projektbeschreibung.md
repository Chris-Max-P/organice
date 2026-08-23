# Projektbeschreibung: App für Event- und Aufgabenorganisation

*Stand: 13. August 2026 — Grundlagendokument für weitere Prompts (Spezifikation, Produkt-Design, Architektur)*

## 1. Hintergrund

Die vorangegangene Tool-Recherche in diesem Projekt zeigte: Es gibt kein bestehendes Tool, das Governance, Aufgabenorganisation, Finanzen, Gäste-/Fahrtplanung und Kommunikation für selbstorganisierte Gruppen in einem abdeckt. Statt bestehende Bausteine zu kombinieren (Nextcloud, Loomio, Engelsystem, Open Collective …), soll nun eine eigene App entwickelt werden — zunächst mit reduziertem, klar abgegrenztem Funktionsumfang.

## 2. Projektabgrenzung

### 2.1 In diesem Schritt enthalten

- **Event-Übersicht** — Events als gemeinsame Projekte anlegen, Dashboard mit Kennzahlen
- **Aufgaben** — Aufgabenverwaltung mit Rollen-Sichtbarkeit, Übernahme-Funktion, Kategorisierung

### 2.2 Bewusst ausgeklammert (spätere Ausbaustufen)

Aus der Recherche als relevant identifiziert, aber nicht Teil dieses Zuschnitts: Entscheidungsfindung/Konsent-Prozesse, Finanz-Detailverwaltung (Buchungen, Belege), Gäste-/Fahrtplanung, Wiki/Dokumentenablage, Kommunikationsfunktionen (Chat, Foren).

## 3. Zielgruppe & Rollen (Annahme, zu bestätigen)

- **Organisator:in** — legt Events an, verwaltet Aufgabenkreise, sieht alles
- **Kreis-/Bereichsverantwortliche:r** — verantwortet einen Aufgabenkreis, verteilt Aufgaben innerhalb des Kreises
- **Helfer:in / Teilnehmer:in** — sieht Aufgaben gemäß Sichtbarkeit, übernimmt Aufgaben

Rollenmodell und Rechte sind in einem Folge-Prompt genauer zu spezifizieren.

## 4. Funktionsübersicht

### 4.1 Event-Übersicht

**Hinweis zur Architektur**: Die Event-Übersicht/Dashboard richtet sich an Administrator:innen/Kernteam und wird ausschließlich lokal genutzt (kein Endnutzer-Zugriff) — siehe [ADR-003](./adr/ADR-003-admin-dashboard-trennung.md). Sie ist getrennt von der Endnutzer-PWA (Abschnitt 4.2, [ADR-001](./adr/ADR-001-frontend-stack.md)) zu betrachten.

**Event erstellen**
- Ein Event wird als gemeinsames Projekt angelegt (mehrere Personen wirken daran mit, keine reine Einzel-Verwaltung)

**Dashboard**
- Teilnehmerzahlen (Ist-Stand, evtl. im Verhältnis zu einer Zielgröße)
- Finanzstand (Kennzahl-Ebene — Details bewusst außerhalb des Scopes, siehe 2.2)
- Status der Aufgaben (z. B. Anteil erledigt/offen/in Arbeit, evtl. nach Kreis oder Kategorie)

### 4.2 Aufgaben

**Aufgabenübersicht und Verantwortlichkeiten**

Aufgabenliste, je Aufgabe mit:
- Beschreibung
- Umfang (Aufwand/Größe)
- Zeitpunkt
- Helfer vorhanden / Helfer gebraucht (Soll-Ist)
- Fortschritt / aktueller Stand (ggf. in %)
- Status (offen → verteilt → voll, sobald Helferbedarf gedeckt)

**Aufgabenkreise**
- Gruppierung von Aufgaben in Kreise
- Sichtbarkeit pro Rolle konfigurierbar, um Informations-Overload zu vermeiden

**Offene Aufgaben**
- Liste offener Aufgaben mit Kurzbeschreibung, aktuell Verantwortlichem, Funktion „Aufgabe übernehmen"
- Idee: Aufgaben verlosen (Mechanismus zur Zuteilung statt/ergänzend zu freiwilliger Übernahme) — Status: zu klären, ob und wie

**Aufgaben-Kategorien**
- Vierstufig: muss / soll / kann / darf (Moscow-artige Priorisierung)

*Hinweis: Der letzte Punkt der Ursprungsliste war im Input leer — ggf. in einem Folge-Prompt ergänzen.*

## 5. Qualitätsziele für die weitere Planung

Da hohe Software-Qualität explizit Ziel ist, sollten Folge-Prompts u. a. adressieren:
- Klare, testbare fachliche Spezifikation je Feature (Akzeptanzkriterien)
- Datenmodell (Event, Aufgabe, Aufgabenkreis, Rolle, Nutzer:in, Sichtbarkeitsregeln)
- Rechte-/Rollenkonzept inkl. Sichtbarkeitslogik der Aufgabenkreise
- Architekturentscheidung (Frontend/Backend-Aufteilung, Hosting/Self-Hosting, Datenhaltung)
- Erweiterbarkeit im Blick auf die ausgeklammerten Bereiche (Finanzen, Gäste, Governance) — Datenmodell sollte spätere Integration nicht verbauen
- Nicht-funktionale Anforderungen: Mehrbenutzerfähigkeit/Gleichzeitigkeit, Mobilfreundlichkeit, Datenschutz (Teilnehmerdaten), Barrierefreiheit

## 6. Offene Fragen für die weitere Planung

1. Zielplattform: Web-App, native App, oder beides?
2. Hosting: self-hosted (passend zur bisherigen Präferenz für Open-Source-Bausteine) oder verwalteter Dienst?
3. Wie viele Events parallel / wie viele Teilnehmer:innen pro Event als Auslegungsgröße?
4. Wie wird der „Finanzstand" im Dashboard berechnet, wenn Finanz-Detailverwaltung nicht Teil des Scopes ist — manuelle Eingabe einer Kennzahl oder spätere Schnittstelle?
5. Verlosungsmechanismus für Aufgaben: gewünscht oder nur Idee?
6. Genauer Zuschnitt von Rollen/Rechten über die drei angenommenen Rollen hinaus?

## 7. Weiteres Vorgehen

Dieses Dokument dient als Grundlage für Folge-Prompts zu:
- **Fachliche Spezifikation** (Datenmodell, User Stories, Akzeptanzkriterien je Feature)
- **Produkt-Design** (Screens/Flows für Dashboard, Aufgabenliste, Aufgabe-übernehmen-Flow)
- **System-Architektur** (Tech-Stack, Datenhaltung, Rollen-/Rechtekonzept, Hosting)
- **Weitere Planung** (Roadmap für ausgeklammerte Bereiche, Test-/Qualitätsstrategie)
