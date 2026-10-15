// Tables of the tasks feature — see docs/design/tasks.md, "Data model"

import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('tasks')
    .addColumn('id', 'serial', (column) => column.primaryKey())
    .addColumn('event_id', 'text', (column) => column.notNull())
    .addColumn('title', 'text', (column) => column.notNull())
    .addColumn('description', 'text', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .execute();

  // author_id becomes a foreign key to people with ticket 02.
  await db.schema
    .createTable('task_updates')
    .addColumn('id', 'serial', (column) => column.primaryKey())
    .addColumn('task_id', 'integer', (column) => column.notNull().references('tasks.id'))
    .addColumn('author_id', 'integer')
    .addColumn('text', 'text', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('task_updates').execute();
  await db.schema.dropTable('tasks').execute();
}
