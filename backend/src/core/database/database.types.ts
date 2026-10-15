// Kysely database schema — see docs/adr/ADR-005-persistence.md
// Each feature adds its table interfaces here together with its migration.

import { ColumnType, Generated } from 'kysely';

export interface TasksTable {
  id: Generated<number>;
  event_id: string;
  title: string;
  description: string;
  created_at: ColumnType<Date, never, never>;
}

export interface TaskUpdatesTable {
  id: Generated<number>;
  task_id: number;
  /** Null for the brief, which always comes from the core team. */
  author_id: number | null;
  text: string;
  created_at: ColumnType<Date, never, never>;
}

export interface Database {
  tasks: TasksTable;
  task_updates: TaskUpdatesTable;
}
