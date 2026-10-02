// Participant overview — see docs/specs/spec-frontend.md, section 6.2

import { fetchParticipants } from './api.js';
import { formatCount } from './format.js';
import { createWidgetCard } from './widget-card.js';

/** @type {{ field: import('./api.js').GroupByField, label: string }[]} */
const GROUPINGS = [
  { field: 'category', label: 'Kategorie' },
  { field: 'wantsToHelp', label: 'Helfer' },
];

const MISSING_VALUE_LABEL = 'Keine Angabe';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
export function mount(container) {
  const card = createWidgetCard('Teilnehmerübersicht');

  /** @type {import('./api.js').GroupByField} */
  let activeField = GROUPINGS[0].field;
  let latestRequestId = 0;

  const { element: switchElement, setActive } = createGroupingSwitch((field) => {
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
        console.error('Teilnehmerdaten konnten nicht geladen werden:', error);
        card.showError();
      });
  }

  setActive(activeField);
  load();
}

/**
 * @param {(field: import('./api.js').GroupByField) => void} onSelect
 * @returns {{ element: HTMLElement, setActive: (field: import('./api.js').GroupByField) => void }}
 */
function createGroupingSwitch(onSelect) {
  const element = document.createElement('div');
  element.className = 'segmented-control';
  element.setAttribute('role', 'group');
  element.setAttribute('aria-label', 'Gruppierung');

  /** @type {HTMLButtonElement[]} */
  const buttons = GROUPINGS.map(({ field, label }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'segmented-control__button';
    button.dataset.field = field;
    button.textContent = label;
    button.addEventListener('click', () => onSelect(field));
    return button;
  });

  element.append(...buttons);

  return {
    element,
    setActive(field) {
      for (const button of buttons) {
        const isActive = button.dataset.field === field;
        button.classList.toggle('segmented-control__button--active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      }
    },
  };
}

/**
 * @param {import('./api.js').AggregationGroup[]} groups
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
 * @param {import('./api.js').AggregationGroup} group
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
