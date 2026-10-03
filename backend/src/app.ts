// Express app factory — see docs/specs/spec-backend.md, section 9

import cors from 'cors';
import express, { Express } from 'express';
import { Kysely } from 'kysely';
import { Database } from './core/database/database.types.js';
import { EventData } from './core/event-data/event-data.types.js';
import { createFinanceRouter } from './features/finance/finance.routes.js';
import { createParticipantsRouter } from './features/participants/participants.routes.js';
import { createTasksRouter } from './features/tasks/tasks.routes.js';

export function createApp(eventData: EventData, db: Kysely<Database>): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/dashboard/participants', createParticipantsRouter(eventData));
  app.use('/dashboard/finance', createFinanceRouter(eventData));
  app.use('/tasks', createTasksRouter(db));
  return app;
}
