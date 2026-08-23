// Ticket-/Teilnehmer-Model-Service — siehe docs/specs/spec-backend.md, Abschnitt 5

import { SheetTable } from '../google-integration/google-integration.types.js';
import { TicketEntry } from './ticket-model.types.js';

const COLUMN_TIMESTAMP = 'Zeitstempel';
const COLUMN_FIRST_NAME = 'Vorname';
const COLUMN_LAST_NAME = 'Nachname';
const COLUMN_CATEGORY = 'Ticketkategorie (Preis pro Person inkl. Verpflegung)';
const COLUMN_WANTS_TO_HELP = 'Mitmachen';

const PRICE_TABLE: Record<string, number> = {
  '4er / 5er Zimmer': 175,
  '7er / 8er Zimmer': 160,
  'Bus / Campervan (begrenzte Stellplätze)': 175,
};

export class TicketModelService {
  mapToTicketEntries(sheet: SheetTable, event_id: string): TicketEntry[] {
    return sheet.rows.map((row, index) => {
      const firstName = row[COLUMN_FIRST_NAME] ?? '';
      const lastName = row[COLUMN_LAST_NAME] ?? '';
      const category = row[COLUMN_CATEGORY] ?? '';
      const price = PRICE_TABLE[category];
      if (price === undefined) {
        throw new Error(`Unbekannte Ticketkategorie: "${category}"`);
      }

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
