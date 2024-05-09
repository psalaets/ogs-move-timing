/**
 * @typedef {object} ToolbarActions
 * @property {() => void} onHide
 * @property {() => void} onExpand
 * @property {() => void} onCollapse
 *
 * @param {boolean} initialExpanded
 */
export function createToolbar(initialExpanded) {
  let expanded = initialExpanded;

  const toolbar = document.createElement('div');
  toolbar.style.display = 'flex';
  toolbar.style.gap = '0.4rem';
  toolbar.style.flex = '0 0 auto';

  const button = (id, label) => {
    const b = document.createElement('button');
    b.id = id;
    b.textContent = label;
    return b;
  };

  const hideButton = button('mt-hide', 'Hide');
  toolbar.appendChild(hideButton);

  const toggleButton = button('mt-toggle', expanded ? 'Collapse' : 'Expand');
  toolbar.appendChild(toggleButton);

  const chartButton = button('mt-chart', 'Chart');
  toolbar.appendChild(chartButton);

  const statsButton = button('mt-stats', 'Stats');
  toolbar.appendChild(statsButton);

  const actions = {
    hide: () => {},
    expand: () => {},
    collapse: () => {},
    chart: () => {},
    stats: () => {},
  };

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
