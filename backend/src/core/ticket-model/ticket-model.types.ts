// TicketEntry model — see docs/specs/spec-backend.md, section 5
// firstName/lastName are kept in addition to the combined `name`, because the
// payment matching service (section 6) needs them separately for the
// initial+surname match.

export interface TicketEntry {
  /** Matches the row number in the Google Sheet (1-based, header = row 1). */
  id: number;
  event_id: string;
  firstName: string;
  lastName: string;
  name: string;
  category: string;
  /** null if the category contains no parseable price — see `comment`. */
  price: number | null;
  timestamp: string;
  wantsToHelp: string;
  /** Short note on import problems of this entry, empty if there are none. */
  comment: string;
}
