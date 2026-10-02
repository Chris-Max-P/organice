// Express app factory — see docs/specs/spec-backend.md, section 9

import cors from 'cors';
import express, { Express } from 'express';
import { EventData } from './core/event-data/event-data.types.js';
import { createFinanceRouter } from './features/finance/finance.routes.js';
import { createParticipantsRouter } from './features/participants/participants.routes.js';

export function createApp(eventData: EventData): Express {
  const app = express();
  app.use(cors());
  app.use('/dashboard/participants', createParticipantsRouter(eventData));
  app.use('/dashboard/finance', createFinanceRouter(eventData));
  return app;
}
