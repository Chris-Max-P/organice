// Unit test — pure mapping/price logic, no mocks needed — see CLAUDE.md, step 3.

import { describe, it, expect } from '@jest/globals';
import { SheetTable } from '../integrations/google-sheets/google-sheets.types.js';
import { TicketModelService } from './ticket-model.service.js';

function buildSheet(rows: Record<string, string>[]): SheetTable {
  const headers = [
    'Zeitstempel',
    'Vorname',
    'Nachname',
    'Ticketkategorie (Preis pro Person inkl. Verpflegung)',
    'Mitmachen',
    'E-Mail-Adresse',
  ];
  return { headers, rows };
}

describe('TicketModelService', () => {
  const service = new TicketModelService();

  it('maps a sheet row to a TicketEntry', () => {
    const sheet = buildSheet([
      {
        Zeitstempel: '23.08.2026 12:00:00',
        Vorname: 'Felix',
        Nachname: 'Müller',
        'Ticketkategorie (Preis pro Person inkl. Verpflegung)': '4er / 5er Zimmer ➡️ 175€',
        Mitmachen: 'Ja',
        'E-Mail-Adresse': 'felix@example.com',
      },
    ]);

    const result = service.mapToTicketEntries(sheet, 'event-1');

    expect(result).toEqual([
      {
        id: 2,
        event_id: 'event-1',
        firstName: 'Felix',
        lastName: 'Müller',
        name: 'Felix Müller',
        category: '4er / 5er Zimmer ➡️ 175€',
        price: 175,
        timestamp: '23.08.2026 12:00:00',
        wantsToHelp: 'Ja',
        comment: '',
      },
    ]);
  });

  it('ignores the E-Mail-Adresse column (not a field of the ticket model)', () => {
    const sheet = buildSheet([
      {
        Zeitstempel: '23.08.2026 12:00:00',
        Vorname: 'Felix',
        Nachname: 'Müller',
        'Ticketkategorie (Preis pro Person inkl. Verpflegung)': '4er / 5er Zimmer ➡️ 175€',
        Mitmachen: 'Ja',
        'E-Mail-Adresse': 'felix@example.com',
      },
    ]);

    const [entry] = service.mapToTicketEntries(sheet, 'event-1');

    expect(entry).not.toHaveProperty('E-Mail-Adresse');
    expect(entry).not.toHaveProperty('email');
  });

  it.each([
    ['4er / 5er Zimmer ➡️ 175€', 175],
    ['7er / 8er Zimmer ➡️ 160€', 160],
    ['Bus / Campervan (begrenzte Stellplätze)  ➡️ 175€', 175],
    ['2er Zimmer ➡️ 190€', 190],
    ['2er Zimmer (Ausgebucht) ➡️ 190€', 190],
    ['4er ➡️ 175€', 175],
    ['4er / 5er Zimmer ➡️ 175€ ', 175],
  ])('resolves the price for category "%s" to %i €', (category, price) => {
    const sheet = buildSheet([
      {
        Zeitstempel: '23.08.2026 12:00:00',
        Vorname: 'Felix',
        Nachname: 'Müller',
        'Ticketkategorie (Preis pro Person inkl. Verpflegung)': category,
        Mitmachen: 'Ja',
        'E-Mail-Adresse': 'felix@example.com',
      },
    ]);

    const [entry] = service.mapToTicketEntries(sheet, 'event-1');

    expect(entry.price).toBe(price);
  });

  it.each(['Kategorie ohne Preis', '145', ''])(
    'keeps the entry with price null and a comment when category "%s" contains no price',
    (category) => {
      const sheet = buildSheet([
        {
          Zeitstempel: '23.08.2026 12:00:00',
          Vorname: 'Felix',
          Nachname: 'Müller',
          'Ticketkategorie (Preis pro Person inkl. Verpflegung)': category,
          Mitmachen: 'Ja',
          'E-Mail-Adresse': 'felix@example.com',
        },
      ]);

      const [entry] = service.mapToTicketEntries(sheet, 'event-1');

      expect(entry.category).toBe(category);
      expect(entry.price).toBeNull();
      expect(entry.comment).toBe('Kein Preis in Kategorie');
    },
  );

  it('maps multiple rows', () => {
    const sheet = buildSheet([
      {
        Zeitstempel: '23.08.2026 12:00:00',
        Vorname: 'Felix',
        Nachname: 'Müller',
        'Ticketkategorie (Preis pro Person inkl. Verpflegung)': '4er / 5er Zimmer ➡️ 175€',
        Mitmachen: 'Ja',
        'E-Mail-Adresse': 'felix@example.com',
      },
      {
        Zeitstempel: '23.08.2026 13:00:00',
        Vorname: 'Anna',
        Nachname: 'Schmidt',
        'Ticketkategorie (Preis pro Person inkl. Verpflegung)': '7er / 8er Zimmer ➡️ 160€',
        Mitmachen: 'Nein',
        'E-Mail-Adresse': 'anna@example.com',
      },
    ]);

    const result = service.mapToTicketEntries(sheet, 'event-1');

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(3);
    expect(result[1].name).toBe('Anna Schmidt');
  });

  it('returns an empty list for an empty sheet', () => {
    const sheet = buildSheet([]);

    const result = service.mapToTicketEntries(sheet, 'event-1');

    expect(result).toEqual([]);
  });
});
