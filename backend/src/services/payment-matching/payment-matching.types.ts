// Payment-Model — siehe docs/specs/spec-backend.md, Abschnitt 6
// Eine Payment entsteht ausschließlich aus einer eingegangenen Zahlungs-Mail (Abschnitt 3),
// daher kein Status "offen" hier — der existiert nur als abgeleiteter TicketEntry-Status.

export type PaymentStatus = 'paid' | 'unclear';
export type UnclearReason = 'name' | 'amount';

export interface Payment {
  id: string;
  /** Verweist auf TicketEntry.id (siehe Ticket-/Teilnehmer-Model, Abschnitt 5). Leer bei unclearReason "name". */
  ticketEntryRef?: number;
  /** Leer, wenn der Betrag aus der Mail nicht eindeutig auslesbar war (unclearReason "amount"). */
  amount?: number;
  paidAt: Date;
  status: PaymentStatus;
  unclearReason?: UnclearReason;
  manuallyOverridden: boolean;
}

export type TicketPaymentStatus = 'open' | 'paid' | 'unclear';
