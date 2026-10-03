// Task persistence — see docs/specs/spec-backend.md, section 11

import { Kysely } from 'kysely';
import { Database } from '../../core/database/database.types.js';
import { NewTask, Task } from './tasks.types.js';

export class TasksService {
  constructor(private readonly db: Kysely<Database>, private readonly eventId: string) {}

  async listTasks(): Promise<Task[]> {
    return this.db
      .selectFrom('tasks')
      .select(['id', 'title', 'description'])
      .where('event_id', '=', this.eventId)
      .orderBy('created_at', 'desc')
      .orderBy('id', 'desc')
      .execute();
  }

  /** Stores the description on the task and as its first update, the brief. */
  async createTask({ title, description }: NewTask): Promise<Task> {
    return this.db.transaction().execute(async (trx) => {
      const task = await trx
        .insertInto('tasks')
        .values({ event_id: this.eventId, title, description })
        .returning(['id', 'title', 'description'])
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('task_updates')
        .values({ task_id: task.id, author_id: null, text: description })
        .execute();

      return task;
    });
  }
}
