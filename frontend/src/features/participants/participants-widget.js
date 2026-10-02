// Participant overview — see docs/specs/spec-frontend.md, section 6.2

import { formatCount } from '../../shared/format.js';
import { createSegmentedControl } from '../../shared/segmented-control/segmented-control.js';
import { createWidgetCard } from '../../shared/widget-card/widget-card.js';
import { fetchParticipants } from './participants.api.js';

/** @type {{ value: import('./participants.api.js').GroupByField, label: string }[]} */
const GROUPINGS = [
  { value: 'category', label: 'Kategorie' },
  { value: 'wantsToHelp', label: 'Helfer' },
];

const MISSING_VALUE_LABEL = 'Keine Angabe';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
export function mount(container) {
  const card = createWidgetCard('Teilnehmerübersicht');

  /** @type {import('./participants.api.js').GroupByField} */
  let activeField = GROUPINGS[0].value;
  let latestRequestId = 0;

  const { element: switchElement, setActive } = createSegmentedControl(GROUPINGS, 'Gruppierung', (field) => {
    activeField = field;
    setActive(field);
    load();
  });

  card.setControls(switchElement);
  container.append(card.element);

  function load() {
    const requestId = ++latestRequestId;
    card.showLoading();

    fetchParticipants(activeField)
      .then((groups) => {
        if (requestId !== latestRequestId) {
          return;
        }
        if (groups.length === 0) {
          card.showEmpty();
          return;
        }
        card.showContent(createGroupList(groups));
      })
      .catch((error) => {
        if (requestId !== latestRequestId) {
          return;
        }
        console.error('Failed to load participant data:', error);
        card.showError();
      });
  }

  setActive(activeField);
  load();
}

/**
 * @param {import('./participants.api.js').AggregationGroup[]} groups
 * @returns {DocumentFragment}
 */
function createGroupList(groups) {
  const fragment = document.createDocumentFragment();

  const total = groups.reduce((sum, group) => sum + group.count, 0);
  const totalElement = document.createElement('p');
  totalElement.className = 'participants__total';
  totalElement.textContent = `Gesamt: ${formatCount(total)}`;
  fragment.append(totalElement);

  const list = document.createElement('div');
  list.className = 'participants__groups';
  list.append(...groups.map(createGroupRow));
  fragment.append(list);

  return fragment;
}

/**
 * @param {import('./participants.api.js').AggregationGroup} group
 * @returns {HTMLDetailsElement}
 */
function createGroupRow(group) {
  const details = document.createElement('details');
  details.className = 'participants__group';

  const summary = document.createElement('summary');
  summary.className = 'participants__group-summary';

  const value = document.createElement('span');
  value.className = 'participants__group-value';
  value.textContent = group.value === '' ? MISSING_VALUE_LABEL : group.value;

  const count = document.createElement('span');
  count.className = 'participants__group-count';
  count.textContent = formatCount(group.count);

  summary.append(value, count);

  const members = document.createElement('ul');
  members.className = 'participants__members';
  members.append(
    ...group.entries.map((entry) => {
      const item = document.createElement('li');
      item.textContent = `${entry.firstName} ${entry.lastName}`;
      return item;
    }),
  );

  details.append(summary, members);
  return details;
}
