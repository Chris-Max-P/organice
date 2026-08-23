// Aggregations-Model — siehe docs/specs/spec-backend.md, Abschnitt 7

import { TicketEntry } from '../ticket-model/ticket-model.types.js';

export interface AggregationEntry {
  firstName: string;
  lastName: string;
}

export interface AggregationGroup {
  value: string;
  count: number;
  entries: AggregationEntry[];
}

export type TicketEntryGroupingField = keyof TicketEntry;
