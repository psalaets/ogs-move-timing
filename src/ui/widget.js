/**
 * @callback Teardown
 * @returns {void}
 *
 * @callback Init
 * @param {HTMLElement} contentContainer
 * @returns {Teardown | void}
 *
 * @typedef {object} WidgetContent
 * @property {HTMLElement} element
 * @property {() => {}} [setUp]
 * @property {() => {}} [tearDown]
 */

/**
 * @param {HTMLElement} toolbar
 */
export function createWidget(toolbar) {
  const widget = document.createElement('div');
  const className = 'mt-widget';

  widget.classList.add(className);
  widget.style.display = 'flex';
  widget.style.flexDirection = 'column';
  widget.style.paddingBlock = '1rem';
  widget.style.gap = '0.5rem';
  widget.style.boxSizing = 'border-box';
  widget.style.flex = '1 0 12rem';

  const contentContainer = document.createElement('div');
  contentContainer.style.flex = '1 1 100%';

  /**
   * @type {Teardown | null}
   */
  let lastTeardown = null;

  /**
   * @param {Init | string} init
   */
  const setContent = (init) => {
    lastTeardown && lastTeardown();

    if (typeof init === 'string') {
      contentContainer.replaceChildren(init);
      lastTeardown = null;
    } else {
      lastTeardown = init(contentContainer);
    }
  };

  widget.appendChild(toolbar);
  widget.appendChild(contentContainer);

  return {
    setContent,
    widget,
    tearDownWidget() {
      lastTeardown && lastTeardown();
      lastTeardown = null;

      widget.remove();
    }
  };
}
