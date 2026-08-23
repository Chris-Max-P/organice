# ADR-001: Frontend-Stack für Event-Orga-App

## Status
Angenommen

## Geltungsbereich
Betrifft ausschließlich die **Endnutzer-App** (Teilnehmer:innen, Helfer:innen). Das Admin-Dashboard ist davon getrennt und folgt keinem PWA-Zwang — siehe [ADR-003](./ADR-003-admin-dashboard-trennung.md).

## Kontext
Die App soll auf iOS, Android und im Browser (Desktop/Mobile) laufen. Entwicklerteam hat Angular-Erfahrung. Umsetzung erfolgt im Design-Thinking-Prozess mit schnellen Prototyp-/Testzyklen.

## Entscheidung
**Angular als PWA**, mit optionaler späterer Erweiterung via **Capacitor** zu nativen iOS-/Android-Apps.

- Start: Angular + `@angular/pwa` (Service Worker, Manifest)
- Bei Bedarf: Capacitor-Wrapper um dieselbe Codebasis für App-Store-Distribution

## Begründung
- Nutzt vorhandene Angular-Expertise, kein neues Framework nötig
- PWA ermöglicht schnelle Iteration ohne App-Store-Review — passt zu Design-Thinking-Zyklen (Prototype/Test)
- Kein Rewrite nötig, falls native Stores später relevant werden (Capacitor wrapped bestehenden Code)
- Geringe Einstiegskosten, Investition in native Komplexität erst nach Validierung

## Verworfene Alternativen
- **React Native + Next.js** — verworfen, da Team-Know-how in Angular liegt, nicht React
- **NativeScript + Angular** — verworfen: echtes natives Rendering, aber kleinere Community/Plugin-Basis, kein Web-Code-Sharing (separate Codebasis für Web nötig)
- **Ionic + Angular + Capacitor (sofort, ohne PWA-Zwischenschritt)** — verworfen für den Start: mehr initiale Komplexität (native Builds, Store-Prozess), ohne dass Produkt/Feature-Set bereits validiert ist
- **Flutter** — verworfen: kein Angular/TypeScript, getrennter Code für Web und Mobile

## Konsequenzen
- iOS-Einschränkungen der PWA (Push erst ab iOS 16.4, kein Store-Listing) werden vorerst akzeptiert
- Migrationspfad zu nativen Apps bleibt offen, ohne frühzeitige Festlegung
