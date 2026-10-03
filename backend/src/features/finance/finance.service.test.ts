// Unit test — pure summation on raw data, no mocks needed — see CLAUDE.md, step 3.

import { describe, it, expect } from '@jest/globals';
import { TicketEntry } from '../../core/ticket-model/ticket-model.types.js';
import { Payment } from '../../core/payment-matching/payment-matching.types.js';
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
    comment: '',
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

  it('sums "expected" over all TicketEntries regardless of payment status', () => {
    const tickets = [
      buildTicket({ id: 2, price: 175 }),
      buildTicket({ id: 3, price: 160 }),
      buildTicket({ id: 4, price: 175 }),
    ];

    const result = service.calculateSummary(tickets, []);

    expect(result.expected).toBe(510);
  });

  it('counts TicketEntries with price null as 0', () => {
    const tickets = [buildTicket({ id: 2, price: 175 }), buildTicket({ id: 3, price: null })];
    const payments = [buildPayment({ ticketEntryRef: 3, status: 'paid' })];

    const result = service.calculateSummary(tickets, payments);

    expect(result).toEqual({ paid: 0, expected: 175 });
  });

  it('sums "paid" only over TicketEntries with derived status "paid"', () => {
    const tickets = [buildTicket({ id: 2, price: 175 }), buildTicket({ id: 3, price: 160 })];
    const payments = [buildPayment({ ticketEntryRef: 2, status: 'paid' })];

    const result = service.calculateSummary(tickets, payments);

    expect(result.paid).toBe(175);
    expect(result.expected).toBe(335);
  });

  it('does not count unclear(amount) Payments as "paid", but the ticket stays part of "expected"', () => {
    const tickets = [buildTicket({ id: 2, price: 175 })];
    const payments = [
      buildPayment({ ticketEntryRef: 2, status: 'unclear', unclearReason: 'amount', amount: undefined }),
    ];

    const result = service.calculateSummary(tickets, payments);

    expect(result.paid).toBe(0);
    expect(result.expected).toBe(175);
  });

  it('ignores unassignable Payments (unclearReason "name", no ticketEntryRef)', () => {
    const tickets = [buildTicket({ id: 2, price: 175 })];
    const payments = [buildPayment({ ticketEntryRef: undefined, status: 'unclear', unclearReason: 'name' })];

    const result = service.calculateSummary(tickets, payments);

    expect(result.paid).toBe(0);
    expect(result.expected).toBe(175);
  });

  it('counts TicketEntries without an assigned Payment ("open") in "expected" but not in "paid"', () => {
    const tickets = [buildTicket({ id: 2, price: 175 })];

    const result = service.calculateSummary(tickets, []);

    expect(result.paid).toBe(0);
    expect(result.expected).toBe(175);
  });

  it('counts the ticket price for "paid" only once when a TicketEntry has several Payments (1:n)', () => {
    const tickets = [buildTicket({ id: 2, price: 175 })];
    const payments = [
      buildPayment({ ticketEntryRef: 2, status: 'unclear', unclearReason: 'amount', amount: undefined }),
      buildPayment({ ticketEntryRef: 2, status: 'paid', amount: 175 }),
    ];

    const result = service.calculateSummary(tickets, payments);

    expect(result.paid).toBe(175);
  });

  it('rounds sums to 2 decimal places (floating-point safety)', () => {
    const tickets = [buildTicket({ id: 2, price: 0.1 }), buildTicket({ id: 3, price: 0.2 })];

    const result = service.calculateSummary(tickets, []);

    expect(result.expected).toBe(0.3);
  });

  it('returns 0/0 for no TicketEntries', () => {
    const result = service.calculateSummary([], []);

    expect(result).toEqual({ paid: 0, expected: 0 });
  });
});
