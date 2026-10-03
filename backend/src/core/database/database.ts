// Database access — see docs/adr/ADR-005-persistence.md

import { PGlite } from '@electric-sql/pglite';
import { Kysely, Migration, Migrator } from 'kysely';
import { PGliteDialect } from 'kysely-pglite-dialect';
import { Database } from './database.types.js';
import { migrations as registeredMigrations } from './migrations/index.js';

export interface OpenDatabaseOptions {
  /** Folder PGlite persists to. Omitted: in-memory database (tests). */
  dataDir?: string;
  migrations?: Record<string, Migration>;
}

export async function openDatabase(options: OpenDatabaseOptions = {}): Promise<Kysely<Database>> {
  const { dataDir, migrations = registeredMigrations } = options;
  const db = new Kysely<Database>({ dialect: new PGliteDialect(new PGlite(dataDir)) });

  const migrator = new Migrator({ db, provider: { getMigrations: async () => migrations } });
  const { error } = await migrator.migrateToLatest();
  if (error) {
    await db.destroy();
    throw error;
  }

  return db;
}
