// Finance service — see docs/specs/spec-backend.md, section 8

import { PaymentMatchingService } from '../../core/payment-matching/payment-matching.service.js';
import { Payment } from '../../core/payment-matching/payment-matching.types.js';
import { TicketEntry } from '../../core/ticket-model/ticket-model.types.js';
import { FinanceSummary } from './finance.types.js';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export class FinanceService {
  private readonly paymentMatchingService = new PaymentMatchingService();

  calculateSummary(ticketEntries: TicketEntry[], payments: Payment[]): FinanceSummary {
    let paid = 0;
    let expected = 0;

    for (const ticketEntry of ticketEntries) {
      const price = ticketEntry.price ?? 0;
      expected += price;
      const status = this.paymentMatchingService.determineTicketPaymentStatus(ticketEntry, payments);
      if (status === 'paid') {
        paid += price;
      }
    }

    return { paid: round2(paid), expected: round2(expected) };
  }
}
