const className = 'mt-widget';

/**
 * @param {HTMLElement} toolbar
 */
export function createWidget(toolbar) {
  const widget = document.createElement('div');
  widget.classList.add(className);
  widget.style.display = 'flex';
  widget.style.flexDirection = 'column';
  widget.style.paddingBlock = '1rem';
  widget.style.gap = '0.5rem';
  widget.style.boxSizing = 'border-box';
  widget.style.flex = '1 0 12rem';

  const content = document.createElement('div');
  content.style.flex = '1 1 100%';

  widget.appendChild(toolbar);
  widget.appendChild(content);

  return {
    widget,
    content,
    tearDownWidget() {
      widget.remove();
    }
  };
}
