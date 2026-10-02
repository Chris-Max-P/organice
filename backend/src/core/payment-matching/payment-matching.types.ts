// Payment model — see docs/specs/spec-backend.md, section 6
// A Payment only ever originates from a received payment mail (section 3),
// so there is no "open" status here — that only exists as a derived TicketEntry status.

export type PaymentStatus = 'paid' | 'unclear';
export type UnclearReason = 'name' | 'amount';

export interface Payment {
  id: string;
  /** References TicketEntry.id (see ticket/participant model, section 5). Empty for unclearReason "name". */
  ticketEntryRef?: number;
  /** Empty if the amount could not be read unambiguously from the mail (unclearReason "amount"). */
  amount?: number;
  paidAt: Date;
  status: PaymentStatus;
  unclearReason?: UnclearReason;
  manuallyOverridden: boolean;
}

export type TicketPaymentStatus = 'open' | 'paid' | 'unclear';
