// In-memory event data snapshot — see docs/specs/spec-backend.md, section 9

import { Payment } from '../payment-matching/payment-matching.types.js';
import { TicketEntry } from '../ticket-model/ticket-model.types.js';

export interface EventData {
  ticketEntries: TicketEntry[];
  payments: Payment[];
}
