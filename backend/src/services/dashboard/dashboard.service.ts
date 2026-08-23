// Dashboard-Service — siehe docs/specs/spec-backend.md, Abschnitt 9

import { AggregationService } from '../aggregation/aggregation.service.js';
import { AggregationGroup } from '../aggregation/aggregation.types.js';
import { FinanceService } from '../finance/finance.service.js';
import { FinanceSummary } from '../finance/finance.types.js';
import { Payment } from '../payment-matching/payment-matching.types.js';
import { TicketEntry } from '../ticket-model/ticket-model.types.js';
import { GroupByField } from './dashboard.types.js';

export class DashboardService {
  private readonly aggregationService = new AggregationService();
  private readonly financeService = new FinanceService();

  constructor(
    private readonly ticketEntries: TicketEntry[],
    private readonly payments: Payment[],
  ) {}

  getParticipants(groupBy: GroupByField): AggregationGroup[] {
    return this.aggregationService.aggregateBy(this.ticketEntries, groupBy);
  }

  getFinanceSummary(): FinanceSummary {
    return this.financeService.calculateSummary(this.ticketEntries, this.payments);
  }
}
