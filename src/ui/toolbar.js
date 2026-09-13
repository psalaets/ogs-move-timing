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

  // Holder for the actions, all default to no-op
  const actions = {
    hide: () => {},
    chart: () => {},
    stats: () => {},
  };

  // Wire actions to buttons
  hideButton.addEventListener('click', () => actions.hide());
  chartButton.addEventListener('click', () => actions.chart());
  statsButton.addEventListener('click', () => actions.stats());

  return {
    toolbar,
    actions,
  };
}
