// GET /dashboard/participants — see docs/specs/spec-backend.md, section 9

import { Router } from 'express';
import { EventData } from '../../core/event-data/event-data.types.js';
import { AggregationService } from './aggregation.service.js';
import { GROUP_BY_FIELDS, isGroupByField } from './participants.types.js';

export function createParticipantsRouter(eventData: EventData): Router {
  const router = Router();
  const aggregationService = new AggregationService();

  router.get('/', (req, res) => {
    const groupBy = req.query.groupBy;
    if (typeof groupBy !== 'string' || !isGroupByField(groupBy)) {
      res.status(400).json({ error: `groupBy must be one of: ${GROUP_BY_FIELDS.join(', ')}` });
      return;
    }

    res.json(aggregationService.aggregateBy(eventData.ticketEntries, groupBy));
  });

  return router;
}
