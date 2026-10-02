// GET /dashboard/finance — see docs/specs/spec-backend.md, section 9

import { Router } from 'express';
import { EventData } from '../../core/event-data/event-data.types.js';
import { FinanceService } from './finance.service.js';

export function createFinanceRouter(eventData: EventData): Router {
  const router = Router();
  const financeService = new FinanceService();

  router.get('/', (req, res) => {
    res.json(financeService.calculateSummary(eventData.ticketEntries, eventData.payments));
  });

  return router;
}
