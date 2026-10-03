// Tasks page: create form + task list — see docs/specs/spec-frontend.md, section 12

import { createWidgetCard } from '../../shared/widget-card/widget-card.js';
import { createTask, fetchTasks } from './tasks.api.js';

const SAVE_ERROR_TEXT = 'Aufgabe konnte nicht gespeichert werden.';

/**
 * @param {HTMLElement} outlet
 * @returns {void}
 */
export function mount(outlet) {
  const page = document.createElement('div');
  page.className = 'tasks';

  const formCard = createWidgetCard('Neue Aufgabe');
  const listCard = createWidgetCard('Aufgaben');

  const reloadList = () => loadList(listCard);
  formCard.showContent(createForm(reloadList));

  page.append(formCard.element, listCard.element);
  outlet.append(page);

  reloadList();
}

/**
 * @param {import('../../shared/widget-card/widget-card.js').WidgetCard} card
 * @returns {void}
 */
function loadList(card) {
  card.showLoading();

  fetchTasks()
    .then((tasks) => {
      if (tasks.length === 0) {
        card.showEmpty('Noch keine Aufgaben');
        return;
      }
      card.showContent(createList(tasks));
    })
    .catch((error) => {
      console.error('Failed to load tasks:', error);
      card.showError();
    });
}

/**
 * @param {() => void} onCreated
 * @returns {HTMLFormElement}
 */
function createForm(onCreated) {
  const form = document.createElement('form');
  form.className = 'tasks__form';

  const title = document.createElement('input');
  title.name = 'title';
  title.required = true;

  const description = document.createElement('textarea');
  description.name = 'description';
  description.required = true;
  description.rows = 4;

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'tasks__submit';
  button.textContent = 'Aufgabe anlegen';

  const error = document.createElement('p');
  error.className = 'tasks__error';
  error.setAttribute('role', 'alert');

  const actions = document.createElement('div');
  actions.className = 'tasks__actions';
  actions.append(button, error);

  form.append(createField('Titel', title), createField('Beschreibung', description), actions);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    button.disabled = true;
    error.textContent = '';

    createTask({ title: title.value, description: description.value })
      .then(() => {
        form.reset();
        onCreated();
      })
      .catch((cause) => {
        console.error('Failed to save task:', cause);
        error.textContent = SAVE_ERROR_TEXT;
      })
      .finally(() => {
        button.disabled = false;
      });
  });

  return form;
}

/**
 * @param {string} text
 * @param {HTMLInputElement | HTMLTextAreaElement} control
 * @returns {HTMLLabelElement}
 */
function createField(text, control) {
  const label = document.createElement('label');
  label.className = 'tasks__field';
  label.append(text, control);
  return label;
}

/**
 * @param {import('./tasks.api.js').Task[]} tasks
 * @returns {HTMLUListElement}
 */
function createList(tasks) {
  const list = document.createElement('ul');
  list.className = 'tasks__list';

  for (const task of tasks) {
    const item = document.createElement('li');
    item.className = 'tasks__item';

    const title = document.createElement('strong');
    title.className = 'tasks__title';
    title.textContent = task.title;

    const description = document.createElement('span');
    description.className = 'tasks__description';
    description.textContent = task.description;

    const helpers = document.createElement('span');
    helpers.className = 'tasks__helpers';
    helpers.textContent = (task.helperNames ?? []).join(', ');

    item.append(title, description, helpers);
    list.append(item);
  }

  return list;
}
