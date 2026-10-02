// Daten-Model (In-Memory) — siehe docs/specs/spec-backend.md, Abschnitt 2
// Generische Tabellenstruktur (Zeilen × Spalten), gültig für die Laufzeit des Prozesses.

export type SheetRow = Record<string, string>;

export interface SheetTable {
  headers: string[];
  rows: SheetRow[];
}
