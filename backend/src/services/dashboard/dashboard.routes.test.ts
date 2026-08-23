// Integrationstest der Dashboard-Routen via supertest — siehe CLAUDE.md, Schritt 3.

import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { TicketEntry } from '../ticket-model/ticket-model.types.js';
import { DashboardService } from './dashboard.service.js';
import { createDashboardRouter } from './dashboard.routes.js';

function buildTicket(overrides: Partial<TicketEntry> = {}): TicketEntry {
  return {
    id: 2,
    event_id: 'event-1',
    firstName: 'Felix',
    lastName: 'Müller',
    name: 'Felix Müller',
    category: '4er / 5er Zimmer',
    price: 175,
    timestamp: '23.08.2026 12:00:00',
    wantsToHelp: 'Ja',
    ...overrides,
  };
}

function buildTestApp(): express.Express {
  const tickets = [
    buildTicket({ id: 2, firstName: 'Felix', lastName: 'Müller', category: '4er / 5er Zimmer', price: 175 }),
    buildTicket({ id: 3, firstName: 'Anna', lastName: 'Schmidt', category: '7er / 8er Zimmer', price: 160 }),
  ];
  const dashboardService = new DashboardService(tickets, []);

  const app = express();
  app.use('/dashboard', createDashboardRouter(dashboardService));
  return app;
}

describe('Dashboard-Routen', () => {
  describe('GET /dashboard/participants', () => {
    it('liefert die Aggregation für ein gültiges groupBy-Feld', async () => {
      const response = await request(buildTestApp()).get('/dashboard/participants?groupBy=category');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { value: '4er / 5er Zimmer', count: 1, entries: [{ firstName: 'Felix', lastName: 'Müller' }] },
        { value: '7er / 8er Zimmer', count: 1, entries: [{ firstName: 'Anna', lastName: 'Schmidt' }] },
      ]);
    });

    it('liefert 400 bei fehlendem groupBy-Parameter', async () => {
      const response = await request(buildTestApp()).get('/dashboard/participants');

      expect(response.status).toBe(400);
    });

    it('liefert 400 bei nicht erlaubtem groupBy-Wert', async () => {
      const response = await request(buildTestApp()).get('/dashboard/participants?groupBy=price');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /dashboard/finance', () => {
    it('liefert die Finanzübersicht', async () => {
      const response = await request(buildTestApp()).get('/dashboard/finance');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ paid: 0, expected: 335 });
    });
  });
});
