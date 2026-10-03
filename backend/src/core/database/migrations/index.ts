// Migration registry — see docs/adr/ADR-005-persistence.md
// Listed explicitly instead of read from the folder, so tsx and Jest load them the same way.
// Keys are applied in alphabetical order: prefix them with a sequence number, e.g. '0001-create-tasks'.

import { Migration } from 'kysely';
import * as createTasks from './0001-create-tasks.js';

export const migrations: Record<string, Migration> = {
  '0001-create-tasks': createTasks,
};
