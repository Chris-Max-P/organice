// Integration test of the finance route via supertest — see CLAUDE.md, step 3.

import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../../app.js';
import { Payment } from '../../core/payment-matching/payment-matching.types.js';
import { TicketEntry } from '../../core/ticket-model/ticket-model.types.js';

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

describe('GET /dashboard/finance', () => {
  it('returns the finance summary computed from TicketEntries and Payments', async () => {
    const ticketEntries = [buildTicket({ id: 2, price: 175 }), buildTicket({ id: 3, price: 160 })];
    const payments = [buildPayment({ ticketEntryRef: 2, status: 'paid' })];

    const response = await request(createApp({ ticketEntries, payments })).get('/dashboard/finance');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ paid: 175, expected: 335 });
  });
});
