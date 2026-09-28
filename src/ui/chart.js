import { displayTime } from './format.js';
import { mean, median, stddev } from '../math.js';

/**
 * @typedef {object} ChartOptions
 * @property {number} yTickSeconds The interval, in seconds, at which to draw y axis ticks
 * @property {boolean} [sorted] Show black's moves longest to shortest, then white's, instead of move order
 */

/**
 * @param {Array<import('../ogs.js').MoveTime>} moveTimes
 * @param {ChartOptions} options
 */
export function createChart(moveTimes, options) {
  const chart = document.createElement('div');
  chart.classList.add('mt-chart');

  const chartPadding = '1rem';
  const style = document.createElement('style');
  style.textContent = `
.mt-chart, .mt-chart * {
  box-sizing: border-box;
}

.mt-chart {
  display: flex;
  position: relative;
  background-color: darkgray;
  min-height: 100%;
  cursor: crosshair;
  padding-inline: ${chartPadding};

  --mt-dark-highlight: #ffd800;
  --mt-light-highlight: yellow;
}

.mt-bar {
  flex: 1 1 100%;
  background-color: var(--mt-bar-color);
}

.mt-bar-wrapper {
  min-height: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
  flex: 1 0 1px;
}

.mt-bar-wrapper:hover {
  background-color: var(--mt-light-highlight);
}

.mt-bar-wrapper:hover .mt-bar {
  background-color: var(--mt-dark-highlight);
}

.mt-bar-wrapper::before {
  display: none;
  position: absolute;
  content: attr(data-time) ' on move ' attr(data-move);
  top: 0px;
  min-width: 10rem;
  padding: 0.2rem;
  background-color: white;
  border-radius: 5px;
  z-index: 1;
  text-align: center;
  pointer-events: none;
}

.mt-bar-wrapper:hover::before {
  display: inline;
}

.mt-bar-wrapper--left::before {
  left: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.mt-bar-wrapper--right::before {
  right: 100%;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* Only when there's no hovered bar, show current bar and its tooltip */
.mt-chart:not(:has(.mt-bar-wrapper:hover)) {
  & .mt-bar-wrapper--current {
    background-color: var(--mt-light-highlight);
  }

  & .mt-bar-wrapper--current .mt-bar {
    background-color: var(--mt-dark-highlight);
  }

  & .mt-bar-wrapper--current::before {
    display: inline;
  }
}

.mt-group-gap {
  flex: 0 0 0.5rem;
}

.mt-stat-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  transform: translateX(-50%);
  background-color: var(--mt-stat-line-color);
  pointer-events: none;
  z-index: 0;
}

.mt-stat-line--mean {
  --mt-stat-line-color: #1e6fff;
  --mt-stat-label-top: 1.6rem;
}

.mt-stat-line--median {
  --mt-stat-line-color: #00a048;
  --mt-stat-label-top: 3rem;
}

.mt-stat-label {
  position: absolute;
  top: var(--mt-stat-label-top);
  left: 3px;
  padding-inline: 0.25rem;
  border-radius: 3px;
  background-color: var(--mt-stat-line-color);
  color: white;
  font-size: 0.7rem;
  line-height: 1.4;
  white-space: nowrap;
}

/* Keep labels inside the chart by putting them on the side facing the middle */
.mt-bar-wrapper--right .mt-stat-label {
  left: auto;
  right: 3px;
}

.mt-yaxis-tick {
  border-top: 1px dashed lightgray;
  left: ${chartPadding};
  right: ${chartPadding};
  height: 0;
  position: absolute;
  z-index: 0;
}`;
  chart.appendChild(style);

  const maxMillis = Math.max(...moveTimes.map(mt => mt.millis));
  const maxY = maxMillis * 1.1; // chart y axis limit is 10% more than max value

  // y axis ticks
  for (const tickMillis of ticks(maxMillis, options.yTickSeconds * 1000)) {
    const tick = document.createElement('div');
    tick.classList.add('mt-yaxis-tick');
    tick.style.bottom = String(tickMillis / maxY * 100) + '%';
    chart.appendChild(tick);
  }

  const bars = options.sorted ? sortedByColor(moveTimes) : moveTimes;

  /** @type {Array<HTMLElement>} */
  const barWrappers = [];

  // vertical bars
  bars.forEach((mt, index) => {
    // separate black and white groups when sorted
    if (options.sorted && index > 0 && mt.color !== bars[index - 1].color) {
      const gap = document.createElement('div');
      gap.classList.add('mt-group-gap');
      chart.appendChild(gap);
    }

    const bar = document.createElement('div');
    bar.classList.add('mt-bar');
    bar.style.height = (mt.millis / maxY * 100) + '%';
    bar.style.setProperty('--mt-bar-color', mt.color === 'black' ? 'black' : 'white');

    // full height wrapper around the bar
    const barWrapper = document.createElement('div');
    barWrapper.classList.add('mt-bar-wrapper', 'mt-bar-wrapper--' + (index / bars.length < 0.5 ? 'left' : 'right'));
    barWrapper.dataset.time = displayTime(mt.millis);
    barWrapper.dataset.move = mt.move;
    barWrapper.appendChild(bar);

    chart.appendChild(barWrapper);
    barWrappers.push(barWrapper);
  });

  if (options.sorted) {
    for (const color of ['black', 'white']) {
      const indexes = bars.flatMap((mt, index) => mt.color === color ? [index] : []);
      if (indexes.length === 0) {
        continue;
      }

      const groupWrappers = indexes.map(index => barWrappers[index]);
      const groupMillis = indexes.map(index => bars[index].millis);

      const groupMean = mean(groupMillis);
      const groupStddev = stddev(groupMillis);
      const groupMedian = median([...groupMillis].reverse());

      // Group is sorted longest first, so the mean falls after every bar longer than it
      const meanPosition = groupMillis.filter(millis => millis > groupMean).length;
      const medianPosition = groupMillis.length / 2;

      addStatLine(groupWrappers, meanPosition, 'mean', `Mean ${displayTime(groupMean)} ± ${displayTime(groupStddev)}`);
      addStatLine(groupWrappers, medianPosition, 'median', `Median ${displayTime(groupMedian)}`);
    }
  }

  return {
    chart,
    /**
     * @paam {number} moveNumber
     */
    markCurrentBar(moveNumber) {
      const clazz = 'mt-bar-wrapper--current';

      // unmark old current
      const oldCurrentBar = chart.querySelector('.' + clazz);
      if (oldCurrentBar) {
        oldCurrentBar.classList.remove(clazz);
      }

      // mark new current
      const newCurrent = chart.querySelector(`.mt-bar-wrapper[data-move="${moveNumber}"]`);
      if (newCurrent) {
        newCurrent.classList.add(clazz);
      }
    }
  };
}

/**
 * Draw a vertical line across a group of bars.
 *
 * @param {Array<HTMLElement>} groupWrappers Bar wrappers of one player, in display order
 * @param {number} position Where to draw, in bar widths from the start of the group
 * @param {'mean' | 'median'} kind
 * @param {string} labelText
 */
function addStatLine(groupWrappers, position, kind, labelText) {
  const barIndex = Math.min(Math.floor(position), groupWrappers.length - 1);

  const line = document.createElement('div');
  line.classList.add('mt-stat-line', 'mt-stat-line--' + kind);
  line.style.left = ((position - barIndex) * 100) + '%';

  const label = document.createElement('div');
  label.classList.add('mt-stat-label');
  label.textContent = labelText;
  line.appendChild(label);

  groupWrappers[barIndex].appendChild(line);
}

/**
 * Black's moves longest to shortest, followed by white's moves longest to shortest.
 *
 * @param {Array<import('../ogs.js').MoveTime>} moveTimes
 */
function sortedByColor(moveTimes) {
  const longestFirst = (a, b) => b.millis - a.millis;

  return [
    ...moveTimes.filter(mt => mt.color === 'black').sort(longestFirst),
    ...moveTimes.filter(mt => mt.color === 'white').sort(longestFirst),
  ];
}

function ticks(maxValue, interval) {
  const t = [];

  let current = interval;
  while (current < maxValue) {
    t.push(current);
    current += interval;
  }

  return t;
}
