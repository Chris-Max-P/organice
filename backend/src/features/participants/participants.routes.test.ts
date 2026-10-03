// Integration test of the participants route via supertest — see CLAUDE.md, step 3.

import { afterAll, beforeAll, describe, it, expect } from '@jest/globals';
import { Kysely } from 'kysely';
import request from 'supertest';
import { createApp } from '../../app.js';
import { openDatabase } from '../../core/database/database.js';
import { Database } from '../../core/database/database.types.js';
import { TicketEntry } from '../../core/ticket-model/ticket-model.types.js';

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

function buildTestApp() {
  const ticketEntries = [
    buildTicket({ id: 2, firstName: 'Felix', lastName: 'Müller', category: '4er / 5er Zimmer', wantsToHelp: 'Ja' }),
    buildTicket({ id: 3, firstName: 'Anna', lastName: 'Schmidt', category: '7er / 8er Zimmer', wantsToHelp: 'Nein' }),
  ];
  return createApp({ ticketEntries, payments: [] }, db);
}

let db: Kysely<Database>;

beforeAll(async () => {
  db = await openDatabase();
});

afterAll(async () => {
  await db.destroy();
});

describe('GET /dashboard/participants', () => {
  it('returns the aggregation grouped by category', async () => {
    const response = await request(buildTestApp()).get('/dashboard/participants?groupBy=category');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { value: '4er / 5er Zimmer', count: 1, entries: [{ firstName: 'Felix', lastName: 'Müller' }] },
      { value: '7er / 8er Zimmer', count: 1, entries: [{ firstName: 'Anna', lastName: 'Schmidt' }] },
    ]);
  });

  it('returns the aggregation grouped by wantsToHelp', async () => {
    const response = await request(buildTestApp()).get('/dashboard/participants?groupBy=wantsToHelp');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { value: 'Ja', count: 1, entries: [{ firstName: 'Felix', lastName: 'Müller' }] },
      { value: 'Nein', count: 1, entries: [{ firstName: 'Anna', lastName: 'Schmidt' }] },
    ]);
  });

  it('returns 400 when the groupBy parameter is missing', async () => {
    const response = await request(buildTestApp()).get('/dashboard/participants');

    expect(response.status).toBe(400);
  });

  it('returns 400 for a groupBy value outside the whitelist', async () => {
    const response = await request(buildTestApp()).get('/dashboard/participants?groupBy=price');

    expect(response.status).toBe(400);
  });
});
