// Dashboard-Daten-API — Routen, siehe docs/specs/spec-backend.md, Abschnitt 9

import { Router } from 'express';
import { DashboardService } from './dashboard.service.js';
import { GROUP_BY_FIELDS, isGroupByField } from './dashboard.types.js';

export function createDashboardRouter(dashboardService: DashboardService): Router {
  const router = Router();

  router.get('/participants', (req, res) => {
    const groupBy = req.query.groupBy;
    if (typeof groupBy !== 'string' || !isGroupByField(groupBy)) {
      res.status(400).json({ error: `groupBy muss eins der folgenden sein: ${GROUP_BY_FIELDS.join(', ')}` });
      return;
    }

    res.json(dashboardService.getParticipants(groupBy));
  });

  router.get('/finance', (req, res) => {
    res.json(dashboardService.getFinanceSummary());
  });

  return router;
}
