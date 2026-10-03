// Integration test of the tasks routes via supertest — see .scratch/tasks/issues/01-core-team-creates-task.md

import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { Express } from 'express';
import { Kysely, sql } from 'kysely';
import request from 'supertest';
import { createApp } from '../../app.js';
import { openDatabase } from '../../core/database/database.js';
import { Database } from '../../core/database/database.types.js';

describe('tasks routes', () => {
  let db: Kysely<Database>;
  let app: Express;

  // One database per file: opening PGlite takes several seconds.
  beforeAll(async () => {
    db = await openDatabase();
    app = createApp({ ticketEntries: [], payments: [] }, db);
  });

  beforeEach(async () => {
    await sql`TRUNCATE task_updates, tasks RESTART IDENTITY`.execute(db);
  });

  afterAll(async () => {
    await db.destroy();
  });

  const createTask = (body: object) => request(app).post('/tasks').send(body);

  describe('POST /tasks', () => {
    it('creates a task and returns it', async () => {
      const response = await createTask({ title: 'Getränke besorgen', description: '50 Kisten Wasser' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(Number),
        title: 'Getränke besorgen',
        description: '50 Kisten Wasser',
      });
    });

    it('trims title and description before saving', async () => {
      const response = await createTask({ title: '  Bänke  ', description: '\n20 Bierbänke \n' });

      expect(response.body).toMatchObject({ title: 'Bänke', description: '20 Bierbänke' });
    });

    it('stores the description as the first update, the brief, without an author', async () => {
      const { body: task } = await createTask({ title: 'Bänke', description: '20 Bierbänke' });

      const updates = await db.selectFrom('task_updates').selectAll().execute();

      expect(updates).toEqual([
        expect.objectContaining({ task_id: task.id, author_id: null, text: '20 Bierbänke' }),
      ]);
    });

    it.each([
      ['title is missing', { description: '20 Bierbänke' }],
      ['description is missing', { title: 'Bänke' }],
      ['title is only whitespace', { title: '   ', description: '20 Bierbänke' }],
      ['description is only whitespace', { title: 'Bänke', description: ' \n ' }],
      ['title is not a string', { title: 42, description: '20 Bierbänke' }],
      ['description is not a string', { title: 'Bänke', description: ['20 Bierbänke'] }],
    ])('returns 400 and stores nothing when the %s', async (_case, body) => {
      const response = await createTask(body);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'title and description are required' });
      expect(await db.selectFrom('tasks').selectAll().execute()).toEqual([]);
      expect(await db.selectFrom('task_updates').selectAll().execute()).toEqual([]);
    });

    it('returns 400 when the body is not JSON', async () => {
      const response = await request(app).post('/tasks').send('title=Bänke');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /tasks/all', () => {
    it('returns an empty list when there are no tasks', async () => {
      const response = await request(app).get('/tasks/all');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('returns all tasks, newest first', async () => {
      await createTask({ title: 'Erste', description: 'a' });
      await createTask({ title: 'Zweite', description: 'b' });
      await createTask({ title: 'Dritte', description: 'c' });

      const response = await request(app).get('/tasks/all');

      expect(response.status).toBe(200);
      expect(response.body.map((task: { title: string }) => task.title)).toEqual(['Dritte', 'Zweite', 'Erste']);
      expect(response.body[0]).toEqual({ id: expect.any(Number), title: 'Dritte', description: 'c' });
    });
  });

  it('offers no endpoint to edit or delete an update', async () => {
    const { body: task } = await createTask({ title: 'Bänke', description: '20 Bierbänke' });

    for (const method of ['put', 'patch', 'delete'] as const) {
      expect((await request(app)[method](`/tasks/${task.id}`)).status).toBe(404);
      expect((await request(app)[method](`/tasks/${task.id}/updates/1`)).status).toBe(404);
    }
  });
});
