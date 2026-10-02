// Shared widget chrome and states — see docs/specs/spec-frontend.md, sections 6.1, 7

const LOADING_TEXT = 'Wird geladen …';
const DEFAULT_ERROR_TEXT = 'Daten konnten nicht geladen werden';
const DEFAULT_EMPTY_TEXT = 'Noch keine Anmeldungen';

/**
 * @typedef {object} WidgetCard
 * @property {HTMLElement} element
 * @property {(node: Node) => void} setControls
 * @property {() => void} showLoading
 * @property {(message?: string) => void} showError
 * @property {(message?: string) => void} showEmpty
 * @property {(node: Node) => void} showContent
 */

/**
 * @param {string} title
 * @returns {WidgetCard}
 */
export function createWidgetCard(title) {
  const element = document.createElement('section');
  element.className = 'widget-card';

  const header = document.createElement('header');
  header.className = 'widget-card__header';

  const heading = document.createElement('h2');
  heading.className = 'widget-card__title';
  heading.textContent = title;

  const controls = document.createElement('div');
  controls.className = 'widget-card__controls';

  header.append(heading, controls);

  const body = document.createElement('div');
  body.className = 'widget-card__body';

  element.append(header, body);

  /**
   * @param {string} className
   * @param {string} text
   * @returns {HTMLParagraphElement}
   */
  function createMessage(className, text) {
    const message = document.createElement('p');
    message.className = className;
    message.textContent = text;
    return message;
  }

  return {
    element,
    setControls(node) {
      controls.replaceChildren(node);
    },
    showLoading() {
      body.replaceChildren(createMessage('widget-card__state', LOADING_TEXT));
    },
    showError(message = DEFAULT_ERROR_TEXT) {
      body.replaceChildren(
        createMessage('widget-card__state widget-card__state--error', message),
      );
    },
    showEmpty(message = DEFAULT_EMPTY_TEXT) {
      body.replaceChildren(createMessage('widget-card__state', message));
    },
    showContent(node) {
      body.replaceChildren(node);
    },
  };
}
