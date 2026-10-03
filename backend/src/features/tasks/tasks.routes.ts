// GET /tasks/all, POST /tasks — see docs/specs/spec-backend.md, section 11

import { Router } from 'express';
import { Kysely } from 'kysely';
import { Database } from '../../core/database/database.types.js';
import { EVENT_ID } from '../../core/event-data/event-id.js';
import { TasksService } from './tasks.service.js';

const nonBlank = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;

export function createTasksRouter(db: Kysely<Database>): Router {
  const router = Router();
  const tasksService = new TasksService(db, EVENT_ID);

  router.get('/all', async (req, res, next) => {
    try {
      res.json(await tasksService.listTasks());
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    const title = nonBlank(req.body?.title);
    const description = nonBlank(req.body?.description);
    if (!title || !description) {
      res.status(400).json({ error: 'title and description are required' });
      return;
    }

    try {
      res.status(201).json(await tasksService.createTask({ title, description }));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
