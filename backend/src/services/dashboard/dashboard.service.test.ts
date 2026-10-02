// Unit-Test — Zusammenspiel Aggregation + Finanz-Service auf Rohdaten, keine Mocks nötig — siehe CLAUDE.md, Schritt 3.

import { describe, it, expect } from '@jest/globals';
import { TicketEntry } from '../ticket-model/ticket-model.types.js';
import { Payment } from '../payment-matching/payment-matching.types.js';
import { DashboardService } from './dashboard.service.js';

function buildTicket(overrides: Partial<TicketEntry> = {}): TicketEntry {
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

function buildPayment(overrides: Partial<Payment> = {}): Payment {
  return {
    id: 'payment-1',
    ticketEntryRef: 2,
    amount: 175,
    paidAt: new Date('2026-08-23T12:00:00Z'),
    status: 'paid',
    manuallyOverridden: false,
    ...overrides,
  };
}

describe('DashboardService', () => {
  it('gruppiert die Teilnehmer nach dem angegebenen Feld (category)', () => {
    const tickets = [
      buildTicket({ id: 2, firstName: 'Felix', lastName: 'Müller', category: '4er / 5er Zimmer' }),
      buildTicket({ id: 3, firstName: 'Anna', lastName: 'Schmidt', category: '7er / 8er Zimmer' }),
    ];
    const service = new DashboardService(tickets, []);

    const result = service.getParticipants('category');

    expect(result).toEqual([
      { value: '4er / 5er Zimmer', count: 1, entries: [{ firstName: 'Felix', lastName: 'Müller' }] },
      { value: '7er / 8er Zimmer', count: 1, entries: [{ firstName: 'Anna', lastName: 'Schmidt' }] },
    ]);
  });

  it('gruppiert die Teilnehmer nach dem angegebenen Feld (wantsToHelp)', () => {
    const tickets = [
      buildTicket({ id: 2, firstName: 'Felix', lastName: 'Müller', wantsToHelp: 'Ja' }),
      buildTicket({ id: 3, firstName: 'Anna', lastName: 'Schmidt', wantsToHelp: 'Nein' }),
    ];
    const service = new DashboardService(tickets, []);

    const result = service.getParticipants('wantsToHelp');

    expect(result).toEqual([
      { value: 'Ja', count: 1, entries: [{ firstName: 'Felix', lastName: 'Müller' }] },
      { value: 'Nein', count: 1, entries: [{ firstName: 'Anna', lastName: 'Schmidt' }] },
    ]);
  });

  it('berechnet die Finanzübersicht aus TicketEntries und Payments', () => {
    const tickets = [buildTicket({ id: 2, price: 175 }), buildTicket({ id: 3, price: 160 })];
    const payments = [buildPayment({ ticketEntryRef: 2, status: 'paid' })];
    const service = new DashboardService(tickets, payments);

    const result = service.getFinanceSummary();

    expect(result).toEqual({ paid: 175, expected: 335 });
  });
});
