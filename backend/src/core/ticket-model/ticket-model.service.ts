// Ticket/participant model service — see docs/specs/spec-backend.md, section 5

import { SheetTable } from '../integrations/google-sheets/google-sheets.types.js';
import { TicketEntry } from './ticket-model.types.js';

const COLUMN_TIMESTAMP = 'Zeitstempel';
const COLUMN_FIRST_NAME = 'Vorname';
const COLUMN_LAST_NAME = 'Nachname';
const COLUMN_CATEGORY = 'Ticketkategorie (Preis pro Person inkl. Verpflegung)';
const COLUMN_WANTS_TO_HELP = 'Mitmachen';

// The price is extracted directly from the ticket category (e.g. "4er / 5er Zimmer ➡️ 175€"),
// because the category labels in the sheet are maintained by hand and spelling/whitespace
// can change — a fixed price table would break again on every sheet edit.
const PRICE_PATTERN = /(\d+)\s*€/;

export class TicketModelService {
  mapToTicketEntries(sheet: SheetTable, event_id: string): TicketEntry[] {
    return sheet.rows.map((row, index) => {
      const firstName = row[COLUMN_FIRST_NAME] ?? '';
      const lastName = row[COLUMN_LAST_NAME] ?? '';
      const category = (row[COLUMN_CATEGORY] ?? '').trim();
      const priceMatch = category.match(PRICE_PATTERN);
      if (!priceMatch) {
        throw new Error(`No price found in ticket category: "${category}"`);
      }
      const price = Number(priceMatch[1]);

      return {
        id: index + 2,
        event_id,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        category,
        price,
        timestamp: row[COLUMN_TIMESTAMP] ?? '',
        wantsToHelp: row[COLUMN_WANTS_TO_HELP] ?? '',
      };
    });
  }
}
