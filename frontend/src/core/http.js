// HTTP helper for the backend REST API — see docs/specs/spec-frontend.md, section 4

import { API_BASE_URL } from './config.js';

/**
 * @param {string} path
 * @returns {Promise<unknown>}
 */
export async function getJson(path) {
  return request(path);
}

/**
 * @param {string} path
 * @param {unknown} body
 * @returns {Promise<unknown>}
 */
export async function postJson(path, body) {
  return request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * @param {string} path
 * @param {RequestInit} [init]
 * @returns {Promise<unknown>}
 */
async function request(path, init) {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    throw new Error(`${path} responded with ${response.status}`);
  }
  return response.json();
}
