// Express-App-Factory — siehe docs/specs/spec-backend.md, Abschnitt 9

import cors from 'cors';
import express, { Express } from 'express';
import { DashboardService } from './services/dashboard/dashboard.service.js';
import { createDashboardRouter } from './services/dashboard/dashboard.routes.js';

export function createApp(dashboardService: DashboardService): Express {
  const app = express();
  app.use(cors());
  app.use('/dashboard', createDashboardRouter(dashboardService));
  return app;
}
