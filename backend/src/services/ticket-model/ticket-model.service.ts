// Ticket-/Teilnehmer-Model-Service — siehe docs/specs/spec-backend.md, Abschnitt 5

import { SheetTable } from '../google-integration/google-integration.types.js';
import { TicketEntry } from './ticket-model.types.js';

const COLUMN_TIMESTAMP = 'Zeitstempel';
const COLUMN_FIRST_NAME = 'Vorname';
const COLUMN_LAST_NAME = 'Nachname';
const COLUMN_CATEGORY = 'Ticketkategorie (Preis pro Person inkl. Verpflegung)';
const COLUMN_WANTS_TO_HELP = 'Mitmachen';

// Der Preis wird direkt aus der Ticketkategorie extrahiert (z.B. "4er / 5er Zimmer ➡️ 175€"),
// da die Kategorie-Labels im Sheet manuell gepflegt werden und sich Schreibweisen/Leerzeichen
// ändern können — eine feste Preistabelle wäre bei jeder Sheet-Änderung erneut gebrochen.
const PRICE_PATTERN = /(\d+)\s*€/;

export class TicketModelService {
  mapToTicketEntries(sheet: SheetTable, event_id: string): TicketEntry[] {
    return sheet.rows.map((row, index) => {
      const firstName = row[COLUMN_FIRST_NAME] ?? '';
      const lastName = row[COLUMN_LAST_NAME] ?? '';
      const category = (row[COLUMN_CATEGORY] ?? '').trim();
      const priceMatch = category.match(PRICE_PATTERN);
      if (!priceMatch) {
        throw new Error(`Kein Preis in Ticketkategorie gefunden: "${category}"`);
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
