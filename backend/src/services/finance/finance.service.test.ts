// Unit-Test — reine Summenbildung auf Rohdaten, keine Mocks nötig — siehe CLAUDE.md, Schritt 3.

import { describe, it, expect } from '@jest/globals';
import { TicketEntry } from '../ticket-model/ticket-model.types.js';
import { Payment } from '../payment-matching/payment-matching.types.js';
import { FinanceService } from './finance.service.js';

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

describe('FinanceService', () => {
  const service = new FinanceService();

  it('summiert "Erwartet" über alle TicketEntries, unabhängig vom Zahlungsstatus', () => {
    const tickets = [
      buildTicket({ id: 2, price: 175 }),
      buildTicket({ id: 3, price: 160 }),
      buildTicket({ id: 4, price: 175 }),
    ];

    const result = service.calculateSummary(tickets, []);

    expect(result.expected).toBe(510);
  });

  it('summiert "Bezahlt" nur über TicketEntries mit abgeleitetem Status "paid"', () => {
    const tickets = [buildTicket({ id: 2, price: 175 }), buildTicket({ id: 3, price: 160 })];
    const payments = [buildPayment({ ticketEntryRef: 2, status: 'paid' })];

    const result = service.calculateSummary(tickets, payments);

    expect(result.paid).toBe(175);
    expect(result.expected).toBe(335);
  });

  it('zählt unclear(amount)-Payments nicht zu "Bezahlt", Ticket bleibt aber Teil von "Erwartet"', () => {
    const tickets = [buildTicket({ id: 2, price: 175 })];
    const payments = [
      buildPayment({ ticketEntryRef: 2, status: 'unclear', unclearReason: 'amount', amount: undefined }),
    ];

    const result = service.calculateSummary(tickets, payments);

    expect(result.paid).toBe(0);
    expect(result.expected).toBe(175);
  });

  it('ignoriert nicht zuordenbare Payments (unclearReason "name", kein ticketEntryRef)', () => {
    const tickets = [buildTicket({ id: 2, price: 175 })];
    const payments = [buildPayment({ ticketEntryRef: undefined, status: 'unclear', unclearReason: 'name' })];

    const result = service.calculateSummary(tickets, payments);

    expect(result.paid).toBe(0);
    expect(result.expected).toBe(175);
  });

  it('zählt TicketEntries ohne zugeordnete Payment ("open") in "Erwartet", aber nicht in "Bezahlt"', () => {
    const tickets = [buildTicket({ id: 2, price: 175 })];

    const result = service.calculateSummary(tickets, []);

    expect(result.paid).toBe(0);
    expect(result.expected).toBe(175);
  });

  it('zählt bei mehreren Payments pro TicketEntry (1:n) den Ticketpreis für "Bezahlt" nur einmal', () => {
    const tickets = [buildTicket({ id: 2, price: 175 })];
    const payments = [
      buildPayment({ ticketEntryRef: 2, status: 'unclear', unclearReason: 'amount', amount: undefined }),
      buildPayment({ ticketEntryRef: 2, status: 'paid', amount: 175 }),
    ];

    const result = service.calculateSummary(tickets, payments);

    expect(result.paid).toBe(175);
  });

  it('rundet Summen auf 2 Nachkommastellen (Floating-Point-Sicherheit)', () => {
    const tickets = [buildTicket({ id: 2, price: 0.1 }), buildTicket({ id: 3, price: 0.2 })];

    const result = service.calculateSummary(tickets, []);

    expect(result.expected).toBe(0.3);
  });

  it('liefert 0/0 für keine TicketEntries', () => {
    const result = service.calculateSummary([], []);

    expect(result).toEqual({ paid: 0, expected: 0 });
  });
});
