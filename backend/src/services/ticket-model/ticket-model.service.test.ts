// Unit-Test — reine Mapping-/Preis-Logik, keine Mocks nötig — siehe CLAUDE.md, Schritt 3.

import { describe, it, expect } from '@jest/globals';
import { SheetTable } from '../google-integration/google-integration.types.js';
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

  it('mappt eine Sheet-Zeile auf einen TicketEntry', () => {
    const sheet = buildSheet([
      {
        Zeitstempel: '23.08.2026 12:00:00',
        Vorname: 'Felix',
        Nachname: 'Müller',
        'Ticketkategorie (Preis pro Person inkl. Verpflegung)': '4er / 5er Zimmer',
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
        category: '4er / 5er Zimmer',
        price: 175,
        timestamp: '23.08.2026 12:00:00',
        wantsToHelp: 'Ja',
      },
    ]);
  });

  it('ignoriert die E-Mail-Adresse-Spalte (kein Feld im Ticket-Model)', () => {
    const sheet = buildSheet([
      {
        Zeitstempel: '23.08.2026 12:00:00',
        Vorname: 'Felix',
        Nachname: 'Müller',
        'Ticketkategorie (Preis pro Person inkl. Verpflegung)': '4er / 5er Zimmer',
        Mitmachen: 'Ja',
        'E-Mail-Adresse': 'felix@example.com',
      },
    ]);

    const [entry] = service.mapToTicketEntries(sheet, 'event-1');

    expect(entry).not.toHaveProperty('E-Mail-Adresse');
    expect(entry).not.toHaveProperty('email');
  });

  it.each([
    ['4er / 5er Zimmer', 175],
    ['7er / 8er Zimmer', 160],
    ['Bus / Campervan (begrenzte Stellplätze)', 175],
  ])('löst den Preis für Kategorie "%s" korrekt zu %i € auf', (category, price) => {
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

  it('wirft einen Fehler bei unbekannter Ticketkategorie', () => {
    const sheet = buildSheet([
      {
        Zeitstempel: '23.08.2026 12:00:00',
        Vorname: 'Felix',
        Nachname: 'Müller',
        'Ticketkategorie (Preis pro Person inkl. Verpflegung)': 'Unbekannte Kategorie',
        Mitmachen: 'Ja',
        'E-Mail-Adresse': 'felix@example.com',
      },
    ]);

    expect(() => service.mapToTicketEntries(sheet, 'event-1')).toThrow(/Unbekannte Ticketkategorie/);
  });

  it('mappt mehrere Zeilen', () => {
    const sheet = buildSheet([
      {
        Zeitstempel: '23.08.2026 12:00:00',
        Vorname: 'Felix',
        Nachname: 'Müller',
        'Ticketkategorie (Preis pro Person inkl. Verpflegung)': '4er / 5er Zimmer',
        Mitmachen: 'Ja',
        'E-Mail-Adresse': 'felix@example.com',
      },
      {
        Zeitstempel: '23.08.2026 13:00:00',
        Vorname: 'Anna',
        Nachname: 'Schmidt',
        'Ticketkategorie (Preis pro Person inkl. Verpflegung)': '7er / 8er Zimmer',
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

  it('liefert eine leere Liste für ein leeres Sheet', () => {
    const sheet = buildSheet([]);

    const result = service.mapToTicketEntries(sheet, 'event-1');

    expect(result).toEqual([]);
  });
});
