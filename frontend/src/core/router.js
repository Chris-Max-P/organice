// Hash router — see docs/specs/spec-frontend.md, section 12

/**
 * @typedef {(outlet: HTMLElement) => void} MountPage
 */

/**
 * Shows the page for the current hash and marks the matching menu link as active.
 * An empty or unknown hash shows the page registered for '/'.
 * @param {Record<string, MountPage>} pages keyed by path, e.g. '/aufgaben'
 * @param {HTMLElement} outlet
 * @param {HTMLElement} menu
 * @returns {void}
 */
export function startRouter(pages, outlet, menu) {
  function render() {
    const requested = window.location.hash.slice(1);
    const path = requested in pages ? requested : '/';

    for (const link of menu.querySelectorAll('a')) {
      if (link.getAttribute('href') === `#${path}`) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    }

    outlet.replaceChildren();
    pages[path](outlet);
  }

  window.addEventListener('hashchange', render);
  render();
}
