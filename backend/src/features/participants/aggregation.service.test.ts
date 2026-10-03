// Unit test — pure grouping logic, no mocks needed — see CLAUDE.md, step 3.

import { describe, it, expect } from '@jest/globals';
import { TicketEntry } from '../../core/ticket-model/ticket-model.types.js';
import { AggregationService } from './aggregation.service.js';

function buildEntry(overrides: Partial<TicketEntry>): TicketEntry {
  return {
    id: 2,
    event_id: 'event-1',
    firstName: 'Felix',
    lastName: 'Müller',
    name: 'Felix Müller',
    category: '4er / 5er Zimmer',
    price: 175,
    timestamp: '23.08.2026 12:00:00',
    wantsToHelp: 'Ja',
    ...overrides,
  };
}

describe('AggregationService', () => {
  const service = new AggregationService();

  it('groups TicketEntries by category', () => {
    const entries = [
      buildEntry({ id: 2, firstName: 'Felix', lastName: 'Müller', category: '4er / 5er Zimmer' }),
      buildEntry({ id: 3, firstName: 'Anna', lastName: 'Schmidt', category: '7er / 8er Zimmer' }),
      buildEntry({ id: 4, firstName: 'Tom', lastName: 'Weber', category: '4er / 5er Zimmer' }),
    ];

    const result = service.aggregateBy(entries, 'category');

    expect(result).toEqual([
      {
        value: '4er / 5er Zimmer',
        count: 2,
        entries: [
          { firstName: 'Felix', lastName: 'Müller' },
          { firstName: 'Tom', lastName: 'Weber' },
        ],
      },
      {
        value: '7er / 8er Zimmer',
        count: 1,
        entries: [{ firstName: 'Anna', lastName: 'Schmidt' }],
      },
    ]);
  });

  it('groups TicketEntries by wantsToHelp', () => {
    const entries = [
      buildEntry({ id: 2, firstName: 'Felix', lastName: 'Müller', wantsToHelp: 'Ja' }),
      buildEntry({ id: 3, firstName: 'Anna', lastName: 'Schmidt', wantsToHelp: 'Nein' }),
      buildEntry({ id: 4, firstName: 'Tom', lastName: 'Weber', wantsToHelp: 'Ja' }),
    ];

    const result = service.aggregateBy(entries, 'wantsToHelp');

    expect(result).toEqual([
      {
        value: 'Ja',
        count: 2,
        entries: [
          { firstName: 'Felix', lastName: 'Müller' },
          { firstName: 'Tom', lastName: 'Weber' },
        ],
      },
      {
        value: 'Nein',
        count: 1,
        entries: [{ firstName: 'Anna', lastName: 'Schmidt' }],
      },
    ]);
  });

  it('keeps processing order (no sorting)', () => {
    const entries = [
      buildEntry({ id: 2, firstName: 'Zoe', lastName: 'Adler', category: 'Bus / Campervan (begrenzte Stellplätze)' }),
      buildEntry({ id: 3, firstName: 'Anna', lastName: 'Bauer', category: '4er / 5er Zimmer' }),
    ];

    const result = service.aggregateBy(entries, 'category');

    expect(result.map((group) => group.value)).toEqual([
      'Bus / Campervan (begrenzte Stellplätze)',
      '4er / 5er Zimmer',
    ]);
  });

  it('returns an empty list for no TicketEntries', () => {
    const result = service.aggregateBy([], 'category');

    expect(result).toEqual([]);
  });

  it('converts non-string field values (e.g. price) to strings', () => {
    const entries = [
      buildEntry({ id: 2, firstName: 'Felix', lastName: 'Müller', price: 175 }),
      buildEntry({ id: 3, firstName: 'Anna', lastName: 'Schmidt', price: 160 }),
    ];

    const result = service.aggregateBy(entries, 'price');

    expect(result).toEqual([
      { value: '175', count: 1, entries: [{ firstName: 'Felix', lastName: 'Müller' }] },
      { value: '160', count: 1, entries: [{ firstName: 'Anna', lastName: 'Schmidt' }] },
    ]);
  });
});
