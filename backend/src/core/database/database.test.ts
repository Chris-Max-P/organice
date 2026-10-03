// Tests of the database module — see .scratch/tasks/issues/00-database-setup.md

import { afterEach, describe, expect, it } from '@jest/globals';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Generated, Kysely, Migration, sql } from 'kysely';
import { openDatabase } from './database.js';

interface TestDatabase {
  notes: { id: Generated<number>; text: string };
}

const testMigrations: Record<string, Migration> = {
  '0001-create-notes': {
    async up(db) {
      await db.schema
        .createTable('notes')
        .addColumn('id', 'serial', (column) => column.primaryKey())
        .addColumn('text', 'text', (column) => column.notNull())
        .execute();
    },
    async down(db) {
      await db.schema.dropTable('notes').execute();
    },
  },
};

const openTestDatabase = async (dataDir?: string) =>
  (await openDatabase({ dataDir, migrations: testMigrations })) as unknown as Kysely<TestDatabase>;

describe('openDatabase', () => {
  const openDatabases: { destroy(): Promise<void> }[] = [];
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(openDatabases.splice(0).map((db) => db.destroy()));
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  it('opens an in-memory database that answers queries', async () => {
    const db = await openDatabase();
    openDatabases.push(db);

    const result = await sql<{ answer: number }>`SELECT 1 + 1 AS answer`.execute(db);

    expect(result.rows[0].answer).toBe(2);
  });

  it('applies the given migrations', async () => {
    const db = await openTestDatabase();
    openDatabases.push(db);

    await db.insertInto('notes').values({ text: 'hello' }).execute();
    const notes = await db.selectFrom('notes').select('text').execute();

    expect(notes).toEqual([{ text: 'hello' }]);
  });

  it('enforces the constraints defined in a migration', async () => {
    const db = await openTestDatabase();
    openDatabases.push(db);

    await expect(
      sql`INSERT INTO notes (text) VALUES (NULL)`.execute(db),
    ).rejects.toThrow();
  });

  it('rejects when a migration fails', async () => {
    const failing: Record<string, Migration> = {
      '0001-broken': {
        async up(db) {
          await sql`THIS IS NOT SQL`.execute(db);
        },
      },
    };

    await expect(openDatabase({ migrations: failing })).rejects.toThrow();
  });

  it('keeps data across a restart and does not reapply migrations', async () => {
    const dataDir = await mkdtemp(join(tmpdir(), 'organice-db-'));
    tempDirs.push(dataDir);

    const first = await openTestDatabase(dataDir);
    await first.insertInto('notes').values({ text: 'survives' }).execute();
    await first.destroy();

    const second = await openTestDatabase(dataDir);
    openDatabases.push(second);
    const notes = await second.selectFrom('notes').select('text').execute();

    expect(notes).toEqual([{ text: 'survives' }]);
    // The first open of a data folder initialises it, which takes several seconds.
  }, 30_000);
});
