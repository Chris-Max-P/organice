// Aggregations-Service — siehe docs/specs/spec-backend.md, Abschnitt 7

import { TicketEntry } from '../ticket-model/ticket-model.types.js';
import { AggregationGroup } from './aggregation.types.js';

export class AggregationService {
  aggregateBy(entries: TicketEntry[], field: string): AggregationGroup[] {
    const groups: AggregationGroup[] = [];
    const groupsByValue = new Map<string, AggregationGroup>();

    for (const entry of entries) {
      const value = String((entry as unknown as Record<string, unknown>)[field]);
      let group = groupsByValue.get(value);
      if (!group) {
        group = { value, count: 0, entries: [] };
        groupsByValue.set(value, group);
        groups.push(group);
      }
      group.count += 1;
      group.entries.push({ firstName: entry.firstName, lastName: entry.lastName });
    }

    return groups;
  }
}
