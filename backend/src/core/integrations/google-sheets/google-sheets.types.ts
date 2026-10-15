// Data model (in-memory) — see docs/specs/dashboard-backend.md, "Google Sheets integration"
// Generic table structure (rows × columns), valid for the lifetime of the process.

export type SheetRow = Record<string, string>;

export interface SheetTable {
  headers: string[];
  rows: SheetRow[];
}
