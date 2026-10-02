// HTTP helper for the backend REST API — see docs/specs/spec-frontend.md, section 4

import { API_BASE_URL } from './config.js';

/**
 * @param {string} path
 * @returns {Promise<unknown>}
 */
export async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`${path} responded with ${response.status}`);
  }
  return response.json();
}
