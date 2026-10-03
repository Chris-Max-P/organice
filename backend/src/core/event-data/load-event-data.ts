// Loads sheet + mails once at startup — see docs/specs/spec-backend.md, section 9

import { GoogleSheetsService } from '../integrations/google-sheets/google-sheets.service.js';
import { MailService } from '../integrations/mail/mail.service.js';
import { PaymentMatchingService } from '../payment-matching/payment-matching.service.js';
import { TicketModelService } from '../ticket-model/ticket-model.service.js';
import { EventData } from './event-data.types.js';
import { EVENT_ID } from './event-id.js';

const PAYMENT_MAIL_CRITERIA = {
  from: 'service@paypal.de',
  subject: 'Du hast eine Zahlung erhalten',
};

export async function loadEventData(): Promise<EventData> {
  const googleSheetsService = new GoogleSheetsService();
  const mailService = new MailService();
  const ticketModelService = new TicketModelService();
  const paymentMatchingService = new PaymentMatchingService();

  const [sheet, mails] = await Promise.all([
    googleSheetsService.fetchSheetData(),
    mailService.searchMails(PAYMENT_MAIL_CRITERIA),
  ]);

  const ticketEntries = ticketModelService.mapToTicketEntries(sheet, EVENT_ID);
  const payments = paymentMatchingService.matchPayments(mails, ticketEntries);

  return { ticketEntries, payments };
}
