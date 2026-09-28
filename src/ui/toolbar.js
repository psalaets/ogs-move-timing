export function createToolbar() {
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

  const chartButton = button('Chart');
  toolbar.appendChild(chartButton);

  const statsButton = button('Stats');
  toolbar.appendChild(statsButton);

  // Only shown in chart view. Uses display instead of the hidden attribute
  // because OGS styles override hidden on buttons.
  const sortButton = button('');
  sortButton.style.marginInlineStart = 'auto';
  sortButton.style.display = 'none';
  toolbar.appendChild(sortButton);

  // Holder for the actions, all default to no-op
  const actions = {
    hide: () => {},
    chart: () => {},
    stats: () => {},
    sort: () => {},
  };

  // Wire actions to buttons
  hideButton.addEventListener('click', () => actions.hide());
  chartButton.addEventListener('click', () => actions.chart());
  statsButton.addEventListener('click', () => actions.stats());
  sortButton.addEventListener('click', () => actions.sort());

  return {
    toolbar,
    actions,
    /**
     * @param {boolean} visible
     * @param {boolean} sorted Whether the chart is currently sorted
     */
    updateSortButton(visible, sorted) {
      sortButton.style.display = visible ? '' : 'none';
      // Label describes what clicking will switch to
      sortButton.textContent = sorted ? 'Move order' : 'Sort by time';
    },
  };
}
