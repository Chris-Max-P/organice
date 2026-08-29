// Entry point — see docs/specs/spec-frontend.md, section 6

import { mount as mountFinance } from './finance-widget.js';
import { mount as mountParticipants } from './participants-widget.js';

const participantsContainer = document.querySelector('#participants-widget');
const financeContainer = document.querySelector('#finance-widget');

if (!(participantsContainer instanceof HTMLElement) || !(financeContainer instanceof HTMLElement)) {
  throw new Error('Widget-Container fehlen im Dokument');
}

mountParticipants(participantsContainer);
mountFinance(financeContainer);
