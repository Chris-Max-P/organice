// Entry point — see docs/specs/spec-frontend.md, sections 3, 6

import { mount as mountFinance } from './features/finance/finance-widget.js';
import { mount as mountParticipants } from './features/participants/participants-widget.js';

/** Order on the dashboard — see docs/specs/spec-frontend.md, section 5 */
const WIDGETS = [mountParticipants, mountFinance];

const dashboard = document.querySelector('#dashboard');

if (!(dashboard instanceof HTMLElement)) {
  throw new Error('Dashboard container is missing from the document');
}

for (const mount of WIDGETS) {
  const container = document.createElement('div');
  dashboard.append(container);
  mount(container);
}
