/**
 * @param {Array<MoveTime>} moveTimes
 */
export function createChart(moveTimes) {
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
  left: 0;
}

.mt-bar-wrapper--right::before {
  right: 0;
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
  const maxY = maxMillis * 1.1; // chart is 10% taller than max value

  // y axis ticks
  for (const tickMillis of ticks(maxMillis, 30 * 1000)) {
    const tick = document.createElement('div');
    tick.classList.add('mt-yaxis-tick');
    tick.style.bottom = String(tickMillis / maxY * 100) + '%';
    chart.appendChild(tick);
  }

  // vertical bars
  moveTimes.forEach(mt => {
    const bar = document.createElement('div');
    bar.classList.add('mt-bar');
    bar.style.height = (mt.millis / maxY * 100) + '%';
    bar.style.setProperty('--mt-bar-color', mt.color === 'black' ? 'black' : 'white');

    // full height wrapper around the bar
    const barWrapper = document.createElement('div');
    barWrapper.classList.add('mt-bar-wrapper', 'mt-bar-wrapper--' + (mt.move / moveTimes.length < 0.5 ? 'left' : 'right'));
    barWrapper.dataset.time = displayTime(mt.millis);
    barWrapper.dataset.move = mt.move;
    barWrapper.appendChild(bar);

    chart.appendChild(barWrapper);
  });

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

function ticks(maxValue, interval) {
  const t = [];

  let current = interval;
  while (current < maxValue) {
    t.push(current);
    current += interval;
  }

  return t;
}

/**
 * @param {number} millis
 * @returns {string}
 */
function displayTime(millis) {
  const seconds = millis / 1000;
  const approxSeconds = millis >= 1000 ? Math.round(seconds) : seconds;
  return approxSeconds < 60 ? displaySeconds(approxSeconds) : displayMinutesAndSeconds(approxSeconds);
}

/**
 * @param {number} seconds
 * @retrns {string}
 */
function displaySeconds(seconds) {
  const truncated = seconds.toFixed(1);
  const formatted = truncated.endsWith('.0') ? truncated.slice(0, -2) : truncated;
  return formatted + 's';
}

/**
 * @param {number} seconds
 * @retrns {string}
 */
function displayMinutesAndSeconds(seconds) {
  const leftoverSeconds = Math.trunc(seconds % 60);

  return [
    // whole minutes
    Math.trunc(seconds / 60) + 'm',
    // seconds of the partial minute, if any
    leftoverSeconds !== 0 ? leftoverSeconds + 's' : ''
  ]
    .filter(p => p)
    .join(' ');
}
