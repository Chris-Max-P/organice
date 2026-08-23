// Bootstrap — Start-Fetch für Sheet + Mail, siehe docs/specs/spec-backend.md, Abschnitt 9

import { GoogleIntegrationService } from './services/google-integration/google-integration.service.js';
import { MailIntegrationService } from './services/mail-integration/mail-integration.service.js';
import { PaymentMatchingService } from './services/payment-matching/payment-matching.service.js';
import { TicketModelService } from './services/ticket-model/ticket-model.service.js';
import { DashboardService } from './services/dashboard/dashboard.service.js';

// Event-Service ist zurückgestellt (Spec Abschnitt 1) — Scope ist auf ein einzelnes Event beschränkt.
export const EVENT_ID = 'default-event';

const PAYMENT_MAIL_CRITERIA = {
  from: 'service@paypal.de',
  subject: 'Du hast eine Zahlung erhalten',
};

export async function bootstrap(): Promise<DashboardService> {
  const googleIntegrationService = new GoogleIntegrationService();
  const mailIntegrationService = new MailIntegrationService();
  const ticketModelService = new TicketModelService();
  const paymentMatchingService = new PaymentMatchingService();

  const [sheet, mails] = await Promise.all([
    googleIntegrationService.fetchSheetData(),
    mailIntegrationService.searchMails(PAYMENT_MAIL_CRITERIA),
  ]);

  const ticketEntries = ticketModelService.mapToTicketEntries(sheet, EVENT_ID);
  const payments = paymentMatchingService.matchPayments(mails, ticketEntries);

  return new DashboardService(ticketEntries, payments);
}
