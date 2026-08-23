// Unit-Test — reine Matching-/Parsing-Logik, keine Mocks nötig — siehe CLAUDE.md, Schritt 3.

import { describe, it, expect } from '@jest/globals';
import { MailMessage } from '../mail-integration/mail-integration.types.js';
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
    it('matcht bei exaktem Vollnamen und liest den Betrag aus → bezahlt', () => {
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

    it('matcht über Initial+Nachname, wenn der PayPal-Vorname abweicht', () => {
      const ticket = buildTicket({ firstName: 'Felix', lastName: 'Müller' });
      const mail = buildMail({
        text: 'Fuck Müller hat dir 175,00 € gesendet\n\nErhaltener Betrag: 175,00 €',
      });

      const [payment] = service.matchPayments([mail], [ticket]);

      expect(payment.status).toBe('paid');
      expect(payment.ticketEntryRef).toBe(ticket.id);
    });

    it('markiert unclear(name), wenn kein TicketEntry passt', () => {
      const ticket = buildTicket({ firstName: 'Anna', lastName: 'Schmidt' });
      const mail = buildMail();

      const [payment] = service.matchPayments([mail], [ticket]);

      expect(payment.status).toBe('unclear');
      expect(payment.unclearReason).toBe('name');
      expect(payment.ticketEntryRef).toBeUndefined();
    });

    it('markiert unclear(name), wenn mehrere TicketEntries passen', () => {
      const ticket1 = buildTicket({ id: 2 });
      const ticket2 = buildTicket({ id: 3 });
      const mail = buildMail();

      const [payment] = service.matchPayments([mail], [ticket1, ticket2]);

      expect(payment.status).toBe('unclear');
      expect(payment.unclearReason).toBe('name');
      expect(payment.ticketEntryRef).toBeUndefined();
    });

    it('markiert unclear(name), wenn der Name aus der Mail nicht parsebar ist', () => {
      const ticket = buildTicket();
      const mail = buildMail({ text: 'Diese Mail hat kein passendes Namensmuster.' });

      const [payment] = service.matchPayments([mail], [ticket]);

      expect(payment.status).toBe('unclear');
      expect(payment.unclearReason).toBe('name');
      expect(payment.ticketEntryRef).toBeUndefined();
    });

    it('markiert unclear(amount), wenn der Name eindeutig, der Betrag aber nicht auslesbar ist', () => {
      const ticket = buildTicket();
      const mail = buildMail({ text: 'Felix Müller hat dir Geld gesendet\n\nKein Betrag hier.' });

      const [payment] = service.matchPayments([mail], [ticket]);

      expect(payment.status).toBe('unclear');
      expect(payment.unclearReason).toBe('amount');
      expect(payment.ticketEntryRef).toBe(ticket.id);
      expect(payment.amount).toBeUndefined();
    });

    it('gibt unclear(name) den Vorrang, wenn Name und Betrag gleichzeitig unklar sind, speichert einen lesbaren Betrag aber trotzdem', () => {
      const ticket = buildTicket({ firstName: 'Anna', lastName: 'Schmidt' });
      const mail = buildMail();

      const [payment] = service.matchPayments([mail], [ticket]);

      expect(payment.status).toBe('unclear');
      expect(payment.unclearReason).toBe('name');
      expect(payment.amount).toBe(175);
    });

    it('erzeugt eine Payment pro Mail (1:n ohne Aggregation)', () => {
      const ticket = buildTicket();
      const mail1 = buildMail({ date: new Date('2026-08-23T12:00:00Z') });
      const mail2 = buildMail({ date: new Date('2026-08-23T13:00:00Z') });

      const payments = service.matchPayments([mail1, mail2], [ticket]);

      expect(payments).toHaveLength(2);
      expect(payments[0].ticketEntryRef).toBe(ticket.id);
      expect(payments[1].ticketEntryRef).toBe(ticket.id);
      expect(payments[0].id).not.toBe(payments[1].id);
    });

    it('liefert eine leere Liste ohne Mails', () => {
      expect(service.matchPayments([], [buildTicket()])).toEqual([]);
    });
  });

  describe('determineTicketPaymentStatus', () => {
    it('liefert "open", wenn keine Payment existiert', () => {
      const ticket = buildTicket();

      expect(service.determineTicketPaymentStatus(ticket, [])).toBe('open');
    });

    it('liefert "paid", wenn eine zugeordnete Payment bezahlt ist', () => {
      const ticket = buildTicket();
      const [payment] = service.matchPayments([buildMail()], [ticket]);

      expect(service.determineTicketPaymentStatus(ticket, [payment])).toBe('paid');
    });

    it('liefert "unclear", wenn nur eine unclear(amount)-Payment existiert', () => {
      const ticket = buildTicket();
      const mail = buildMail({ text: 'Felix Müller hat dir Geld gesendet\n\nKein Betrag hier.' });
      const [payment] = service.matchPayments([mail], [ticket]);

      expect(service.determineTicketPaymentStatus(ticket, [payment])).toBe('unclear');
    });

    it('ignoriert Payments mit unclearReason "name" (kein ticketEntryRef) für andere Tickets', () => {
      const ticket = buildTicket({ firstName: 'Anna', lastName: 'Schmidt' });
      const mail = buildMail();
      const [payment] = service.matchPayments([mail], [ticket]);

      const otherTicket = buildTicket({ id: 99, firstName: 'Bert', lastName: 'Meier' });

      expect(service.determineTicketPaymentStatus(otherTicket, [payment])).toBe('open');
    });
  });
});
