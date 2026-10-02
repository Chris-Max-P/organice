// Unit test — pure matching/parsing logic, no mocks needed — see CLAUDE.md, step 3.

import { describe, it, expect } from '@jest/globals';
import { MailMessage } from '../integrations/mail/mail.types.js';
import { TicketEntry } from '../ticket-model/ticket-model.types.js';
import { PaymentMatchingService } from './payment-matching.service.js';

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

function buildMail(overrides: Partial<MailMessage> = {}): MailMessage {
  const text = 'Felix Müller hat dir 175,00 € gesendet\n\nErhaltener Betrag: 175,00 €';
  return {
    from: 'service@paypal.de',
    subject: 'Du hast eine Zahlung erhalten',
    date: new Date('2026-08-23T12:00:00Z'),
    html: `<p>${text}</p>`,
    text,
    ...overrides,
  };
}

describe('PaymentMatchingService', () => {
  const service = new PaymentMatchingService();

  describe('matchPayments', () => {
    it('matches on exact full name and reads the amount → paid', () => {
      const ticket = buildTicket();
      const mail = buildMail();

      const [payment] = service.matchPayments([mail], [ticket]);

      expect(payment.status).toBe('paid');
      expect(payment.unclearReason).toBeUndefined();
      expect(payment.ticketEntryRef).toBe(ticket.id);
      expect(payment.amount).toBe(175);
      expect(payment.paidAt).toEqual(mail.date);
      expect(payment.manuallyOverridden).toBe(false);
      expect(payment.id).toBeTruthy();
    });

    it('matches via initial+surname when the PayPal first name differs', () => {
      const ticket = buildTicket({ firstName: 'Felix', lastName: 'Müller' });
      const mail = buildMail({
        text: 'Fuck Müller hat dir 175,00 € gesendet\n\nErhaltener Betrag: 175,00 €',
      });

      const [payment] = service.matchPayments([mail], [ticket]);

      expect(payment.status).toBe('paid');
      expect(payment.ticketEntryRef).toBe(ticket.id);
    });

    it('marks unclear(name) when no TicketEntry matches', () => {
      const ticket = buildTicket({ firstName: 'Anna', lastName: 'Schmidt' });
      const mail = buildMail();

      const [payment] = service.matchPayments([mail], [ticket]);

      expect(payment.status).toBe('unclear');
      expect(payment.unclearReason).toBe('name');
      expect(payment.ticketEntryRef).toBeUndefined();
    });

    it('marks unclear(name) when several TicketEntries match', () => {
      const ticket1 = buildTicket({ id: 2 });
      const ticket2 = buildTicket({ id: 3 });
      const mail = buildMail();

      const [payment] = service.matchPayments([mail], [ticket1, ticket2]);

      expect(payment.status).toBe('unclear');
      expect(payment.unclearReason).toBe('name');
      expect(payment.ticketEntryRef).toBeUndefined();
    });

    it('marks unclear(name) when the name cannot be parsed from the mail', () => {
      const ticket = buildTicket();
      const mail = buildMail({ text: 'This mail has no matching name pattern.' });

      const [payment] = service.matchPayments([mail], [ticket]);

      expect(payment.status).toBe('unclear');
      expect(payment.unclearReason).toBe('name');
      expect(payment.ticketEntryRef).toBeUndefined();
    });

    it('marks unclear(amount) when the name is unambiguous but the amount cannot be read', () => {
      const ticket = buildTicket();
      const mail = buildMail({ text: 'Felix Müller hat dir Geld gesendet\n\nKein Betrag hier.' });

      const [payment] = service.matchPayments([mail], [ticket]);

      expect(payment.status).toBe('unclear');
      expect(payment.unclearReason).toBe('amount');
      expect(payment.ticketEntryRef).toBe(ticket.id);
      expect(payment.amount).toBeUndefined();
    });

    it('gives unclear(name) precedence when name and amount are both unclear, but still stores a readable amount', () => {
      const ticket = buildTicket({ firstName: 'Anna', lastName: 'Schmidt' });
      const mail = buildMail();

      const [payment] = service.matchPayments([mail], [ticket]);

      expect(payment.status).toBe('unclear');
      expect(payment.unclearReason).toBe('name');
      expect(payment.amount).toBe(175);
    });

    it('creates one Payment per mail (1:n without aggregation)', () => {
      const ticket = buildTicket();
      const mail1 = buildMail({ date: new Date('2026-08-23T12:00:00Z') });
      const mail2 = buildMail({ date: new Date('2026-08-23T13:00:00Z') });

      const payments = service.matchPayments([mail1, mail2], [ticket]);

      expect(payments).toHaveLength(2);
      expect(payments[0].ticketEntryRef).toBe(ticket.id);
      expect(payments[1].ticketEntryRef).toBe(ticket.id);
      expect(payments[0].id).not.toBe(payments[1].id);
    });

    it('returns an empty list without mails', () => {
      expect(service.matchPayments([], [buildTicket()])).toEqual([]);
    });
  });

  describe('determineTicketPaymentStatus', () => {
    it('returns "open" when no Payment exists', () => {
      const ticket = buildTicket();

      expect(service.determineTicketPaymentStatus(ticket, [])).toBe('open');
    });

    it('returns "paid" when an assigned Payment is paid', () => {
      const ticket = buildTicket();
      const [payment] = service.matchPayments([buildMail()], [ticket]);

      expect(service.determineTicketPaymentStatus(ticket, [payment])).toBe('paid');
    });

    it('returns "unclear" when only an unclear(amount) Payment exists', () => {
      const ticket = buildTicket();
      const mail = buildMail({ text: 'Felix Müller hat dir Geld gesendet\n\nKein Betrag hier.' });
      const [payment] = service.matchPayments([mail], [ticket]);

      expect(service.determineTicketPaymentStatus(ticket, [payment])).toBe('unclear');
    });

    it('ignores Payments with unclearReason "name" (no ticketEntryRef) for other tickets', () => {
      const ticket = buildTicket({ firstName: 'Anna', lastName: 'Schmidt' });
      const mail = buildMail();
      const [payment] = service.matchPayments([mail], [ticket]);

      const otherTicket = buildTicket({ id: 99, firstName: 'Bert', lastName: 'Meier' });

      expect(service.determineTicketPaymentStatus(otherTicket, [payment])).toBe('open');
    });
  });
});
