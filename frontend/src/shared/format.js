// de-DE formatting — see docs/specs/dashboard-frontend.md, "Formatting"

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

const countFormatter = new Intl.NumberFormat('de-DE');

/**
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

/**
 * @param {number} count
 * @returns {string}
 */
export function formatCount(count) {
  return countFormatter.format(count);
}
