/**
 * @param {boolean} initialExpanded
 */
export function createToolbar(initialExpanded) {
  let expanded = initialExpanded;

  const toolbar = document.createElement('div');
  toolbar.style.display = 'flex';
  toolbar.style.gap = '0.4rem';
  toolbar.style.flex = '0 0 auto';

  const button = (label) => {
    const b = document.createElement('button');
    b.textContent = label;
    return b;
  };

  const hideButton = button('Hide');
  toolbar.appendChild(hideButton);

  const toggleButton = button(expanded ? 'Collapse' : 'Expand');
  toolbar.appendChild(toggleButton);

  const chartButton = button('Chart');
  toolbar.appendChild(chartButton);

  const statsButton = button('Stats');
  toolbar.appendChild(statsButton);

  // Holder for the actions, all default to no-op
  const actions = {
    hide: () => {},
    expand: () => {},
    collapse: () => {},
    chart: () => {},
    stats: () => {},
  };

  // Wire actions to buttons
  hideButton.addEventListener('click', () => actions.hide());
  toggleButton.addEventListener('click', () => {
    if (expanded) {
      actions.collapse();
      toggleButton.textContent = 'Expand';
    } else {
      actions.expand();
      toggleButton.textContent = 'Collapse';
    }
    expanded = !expanded;
  });
  chartButton.addEventListener('click', () => actions.chart());
  statsButton.addEventListener('click', () => actions.stats());

  return {
    toolbar,
    actions,
  };
}
