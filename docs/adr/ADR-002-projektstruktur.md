# ADR-002: Projektstruktur für Dokumentation & KI-gestützte Entwicklung

## Status
Angenommen

## Kontext
Es fallen laufend Artefakte wie Specs und ADRs an. Die Entwicklung erfolgt KI-gestützt mit Claude.

## Entscheidung
- Eigener Ordner `/docs` für Anhänge wie Specs und ADRs, getrennt vom Anwendungscode
- KI-gestützte Entwicklung mit Claude Code: Projektkontext wird über eine `CLAUDE.md` im Root bereitgestellt (Architektur-Überblick, Verweis auf `/docs/adr` und `/docs/specs`, Coding-Konventionen), sodass Claude bei jeder Session automatisch den relevanten Kontext lädt

## Ordnerstruktur

```
/
├── CLAUDE.md
├── docs/
│   ├── adr/
│   │   ├── ADR-001-frontend-stack.md
│   │   └── ADR-002-projektstruktur.md
│   └── specs/
├── src/
│   └── app/
│       ├── core/          # Singleton-Services, Guards, Interceptors
│       ├── shared/        # Wiederverwendbare Components, Pipes, Directives
│       ├── features/      # Feature-Module (z. B. events, tickets, auth)
│       └── layout/        # Shell-Components (Header, Nav, Footer)
├── public/                # Statische Assets (Manifest, Icons, robots.txt) — unverändert ins Build-Output kopiert
└── ...
```

## Begründung
- `/docs` im Repo hält Dokumentation versioniert, zentral und für Claude als Kontext direkt zugreifbar
- `CLAUDE.md` gibt Claude Code bei jeder Session automatisch den relevanten Projektkontext
- Angular-Struktur trennt Core/Shared/Features nach gängigem Standard — skaliert gut mit wachsender Feature-Zahl
