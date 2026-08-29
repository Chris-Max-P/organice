// Dashboard data API client — see docs/specs/spec-frontend.md, section 4

import { API_BASE_URL } from './config.js';

/**
 * @typedef {'category' | 'wantsToHelp'} GroupByField
 */

/**
 * Mirrors backend/src/services/aggregation/aggregation.types.ts — keep in sync by hand.
 * @typedef {object} AggregationEntry
 * @property {string} firstName
 * @property {string} lastName
 */

/**
 * @typedef {object} AggregationGroup
 * @property {string} value
 * @property {number} count
 * @property {AggregationEntry[]} entries
 */

/**
 * Mirrors backend/src/services/finance/finance.types.ts — keep in sync by hand.
 * @typedef {object} FinanceSummary
 * @property {number} paid
 * @property {number} expected
 */

/**
 * @param {string} path
 * @returns {Promise<unknown>}
 */
async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`${path} antwortete mit ${response.status}`);
  }
  return response.json();
}

/**
 * @param {GroupByField} groupBy
 * @returns {Promise<AggregationGroup[]>}
 */
export async function fetchParticipants(groupBy) {
  return /** @type {Promise<AggregationGroup[]>} */ (
    getJson(`/dashboard/participants?groupBy=${encodeURIComponent(groupBy)}`)
  );
}

/**
 * @returns {Promise<FinanceSummary>}
 */
export async function fetchFinanceSummary() {
  return /** @type {Promise<FinanceSummary>} */ (getJson('/dashboard/finance'));
}
