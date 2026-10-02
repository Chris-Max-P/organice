// Finance endpoint — see docs/specs/spec-frontend.md, section 4

import { getJson } from '../../core/http.js';

/**
 * Mirrors backend/src/features/finance/finance.types.ts — keep in sync by hand.
 * @typedef {object} FinanceSummary
 * @property {number} paid
 * @property {number} expected
 */

/**
 * @returns {Promise<FinanceSummary>}
 */
export async function fetchFinanceSummary() {
  return /** @type {Promise<FinanceSummary>} */ (getJson('/dashboard/finance'));
}
