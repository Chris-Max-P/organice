// Segmented button group — see docs/specs/spec-frontend.md, section 6.2

/**
 * @template {string} T
 * @param {{ value: T, label: string }[]} options
 * @param {string} ariaLabel
 * @param {(value: T) => void} onSelect
 * @returns {{ element: HTMLElement, setActive: (value: T) => void }}
 */
export function createSegmentedControl(options, ariaLabel, onSelect) {
  const element = document.createElement('div');
  element.className = 'segmented-control';
  element.setAttribute('role', 'group');
  element.setAttribute('aria-label', ariaLabel);

  /** @type {HTMLButtonElement[]} */
  const buttons = options.map(({ value, label }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'segmented-control__button';
    button.dataset.value = value;
    button.textContent = label;
    button.addEventListener('click', () => onSelect(value));
    return button;
  });

  element.append(...buttons);

  return {
    element,
    setActive(value) {
      for (const button of buttons) {
        const isActive = button.dataset.value === value;
        button.classList.toggle('segmented-control__button--active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      }
    },
  };
}
