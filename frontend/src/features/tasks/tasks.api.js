// Tasks endpoints — see docs/specs/frontend.md, "Backend access"

import { getJson, postJson } from '../../core/http.js';

/**
 * Mirrors backend/src/features/tasks/tasks.types.ts — keep in sync by hand.
 * `helperNames` arrives with ticket 02.
 * @typedef {object} Task
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string[]} [helperNames]
 */

/**
 * @returns {Promise<Task[]>}
 */
export async function fetchTasks() {
  return /** @type {Promise<Task[]>} */ (getJson('/tasks/all'));
}

/**
 * @param {{ title: string, description: string }} newTask
 * @returns {Promise<Task>}
 */
export async function createTask(newTask) {
  return /** @type {Promise<Task>} */ (postJson('/tasks', newTask));
}
