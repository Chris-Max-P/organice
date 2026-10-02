// Data model (in-memory) — see docs/specs/spec-backend.md, section 2
// Generic table structure (rows × columns), valid for the lifetime of the process.

export type SheetRow = Record<string, string>;

export interface SheetTable {
  headers: string[];
  rows: SheetRow[];
}
