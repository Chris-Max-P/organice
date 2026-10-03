// Entry point — see docs/specs/spec-frontend.md, sections 3, 6, 12

import { startRouter } from './core/router.js';
import { mount as mountFinance } from './features/finance/finance-widget.js';
import { mount as mountParticipants } from './features/participants/participants-widget.js';
import { mount as mountTasks } from './features/tasks/tasks-page.js';

/** Order on the dashboard — see docs/specs/spec-frontend.md, section 5 */
const WIDGETS = [mountParticipants, mountFinance];

/**
 * @param {HTMLElement} outlet
 * @returns {void}
 */
function mountDashboard(outlet) {
  const dashboard = document.createElement('div');
  dashboard.className = 'dashboard-grid';
  outlet.append(dashboard);

  for (const mount of WIDGETS) {
    const container = document.createElement('div');
    dashboard.append(container);
    mount(container);
  }
}

const outlet = document.querySelector('#page');
const menu = document.querySelector('#menu');

if (!(outlet instanceof HTMLElement) || !(menu instanceof HTMLElement)) {
  throw new Error('Page container or menu is missing from the document');
}

startRouter({ '/': mountDashboard, '/aufgaben': mountTasks }, outlet, menu);
