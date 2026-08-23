// TicketEntry-Model — siehe docs/specs/spec-backend.md, Abschnitt 5
// firstName/lastName werden zusätzlich zum zusammengesetzten `name` gehalten,
// weil der Payment-Matching-Service (Abschnitt 6) sie getrennt für den
// Initial+Nachname-Match benötigt.

export interface TicketEntry {
  /** Entspricht der Zeilennummer im Google Sheet (1-basiert, Kopfzeile = Zeile 1). */
  id: number;
  event_id: string;
  firstName: string;
  lastName: string;
  name: string;
  category: string;
  price: number;
  timestamp: string;
  wantsToHelp: string;
}
