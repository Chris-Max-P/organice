// Finance overview — see docs/specs/spec-frontend.md, section 6.3

import { formatCurrency } from '../../shared/format.js';
import { createWidgetCard } from '../../shared/widget-card/widget-card.js';
import { fetchFinanceSummary } from './finance.api.js';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
export function mount(container) {
  const card = createWidgetCard('Finanzübersicht');
  container.append(card.element);

  card.showLoading();

  fetchFinanceSummary()
    .then((summary) => {
      card.showContent(createSummary(summary));
    })
    .catch((error) => {
      console.error('Failed to load finance data:', error);
      card.showError();
    });
}

/**
 * @param {import('./finance.api.js').FinanceSummary} summary
 * @returns {HTMLDListElement}
 */
function createSummary(summary) {
  const list = document.createElement('dl');
  list.className = 'finance__figures';
  list.append(
    createFigure('Bezahlt', summary.paid),
    createFigure('Erwartet', summary.expected),
  );
  return list;
}

/**
 * @param {string} label
 * @param {number} amount
 * @returns {DocumentFragment}
 */
function createFigure(label, amount) {
  const fragment = document.createDocumentFragment();

  const term = document.createElement('dt');
  term.className = 'finance__label';
  term.textContent = label;

  const value = document.createElement('dd');
  value.className = 'finance__amount';
  value.textContent = formatCurrency(amount);

  fragment.append(term, value);
  return fragment;
}
