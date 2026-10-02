// Participants endpoint — see docs/specs/spec-frontend.md, section 4

import { getJson } from '../../core/http.js';

/**
 * @typedef {'category' | 'wantsToHelp'} GroupByField
 */

/**
 * Mirrors backend/src/features/participants/aggregation.types.ts — keep in sync by hand.
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
 * @param {GroupByField} groupBy
 * @returns {Promise<AggregationGroup[]>}
 */
export async function fetchParticipants(groupBy) {
  return /** @type {Promise<AggregationGroup[]>} */ (
    getJson(`/dashboard/participants?groupBy=${encodeURIComponent(groupBy)}`)
  );
}
