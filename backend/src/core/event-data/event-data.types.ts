// In-memory event data snapshot — see docs/specs/dashboard-backend.md, "Event data at startup"

import { Payment } from '../payment-matching/payment-matching.types.js';
import { TicketEntry } from '../ticket-model/ticket-model.types.js';

export interface EventData {
  ticketEntries: TicketEntry[];
  payments: Payment[];
}
