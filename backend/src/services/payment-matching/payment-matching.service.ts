// Payment-Matching-Service — siehe docs/specs/spec-backend.md, Abschnitt 6

import { randomUUID } from 'node:crypto';
import { MailMessage } from '../mail-integration/mail-integration.types.js';
import { TicketEntry } from '../ticket-model/ticket-model.types.js';
import { TicketPaymentStatus, Payment } from './payment-matching.types.js';

const NAME_REGEX = /(.+?) hat dir/;
const AMOUNT_REGEX = /Erhaltener Betrag\s*:?\s*([\d.,]+)\s*€/i;

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseName(text: string): string | undefined {
  const match = text.match(NAME_REGEX);
  return match ? match[1].trim() : undefined;
}

function parseAmount(text: string): number | undefined {
  const match = text.match(AMOUNT_REGEX);
  if (!match) {
    return undefined;
  }
  const amount = Number(match[1].replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(amount) ? amount : undefined;
}

function isNameMatch(mailName: string, ticket: TicketEntry): boolean {
  const normMailName = normalize(mailName);
  const normFirstName = normalize(ticket.firstName);
  const normLastName = normalize(ticket.lastName);

  if (normMailName === normalize(`${ticket.firstName} ${ticket.lastName}`)) {
    return true;
  }

  const words = normMailName.split(' ');
  if (words.length < 2 || !normFirstName || !normLastName) {
    return false;
  }

  const firstWordMail = words[0];
  const lastWordMail = words[words.length - 1];
  return firstWordMail[0] === normFirstName[0] && lastWordMail === normLastName;
}

export class PaymentMatchingService {
  matchPayments(mails: MailMessage[], ticketEntries: TicketEntry[]): Payment[] {
    return mails.map((mail) => this.matchSingleMail(mail, ticketEntries));
  }

  determineTicketPaymentStatus(ticketEntry: TicketEntry, payments: Payment[]): TicketPaymentStatus {
    const assignedPayments = payments.filter((payment) => payment.ticketEntryRef === ticketEntry.id);
    if (assignedPayments.some((payment) => payment.status === 'paid')) {
      return 'paid';
    }
    if (assignedPayments.some((payment) => payment.unclearReason === 'amount')) {
      return 'unclear';
    }
    return 'open';
  }

  private matchSingleMail(mail: MailMessage, ticketEntries: TicketEntry[]): Payment {
    const base = {
      id: randomUUID(),
      paidAt: mail.date,
      manuallyOverridden: false,
    };

    const mailName = parseName(mail.text);
    const amount = parseAmount(mail.text);

    if (mailName === undefined) {
      return { ...base, amount, status: 'unclear', unclearReason: 'name' };
    }

    const matches = ticketEntries.filter((ticket) => isNameMatch(mailName, ticket));
    if (matches.length !== 1) {
      return { ...base, amount, status: 'unclear', unclearReason: 'name' };
    }

    if (amount === undefined) {
      return { ...base, ticketEntryRef: matches[0].id, status: 'unclear', unclearReason: 'amount' };
    }

    return { ...base, ticketEntryRef: matches[0].id, amount, status: 'paid' };
  }
}
