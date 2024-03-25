/**
 * @typedef {number} MoveCol Zero-based index of the column, starting from the left
 * @typedef {number} MoveRow Zero-based index of the row, starting from the top
 * @typedef {number} MoveMillis Milliseconds elapsed between previous move and this move
 * @typedef {[MoveCol, MoveRow, MoveMillis]} Move A stone played on the board
 *
 * @typedef {'white' | 'black'} PlayerColor
 *
 * @typedef {Object} Gamedata
 * @property {Array<Move>} moves
 * @property {PlayerColor} initial_player
 *
 *
 * @typedef {Object} Game Just the game data needed for this bookmarklet, not exhaustive.
 * @property {Gamedata} gamedata
 *
 * @typedef {Object} MoveTime
 * @property {number} move
 * @property {number} millis
 * @property {PlayerColor} color
 */

/**
 * Figure out game id from a url.
 *
 * @returns {string}
 */
function determineGameId(url) {
  const pattern = /https:\/\/online-go\.com\/(game|review)\/(\d+)/;
  const matchResult = pattern.exec(url);
  // Game id is in 2nd capture group
  const gameId = matchResult ? matchResult[2] : null;

  if (!gameId) {
    throw new Error('This only works on OGS games and OGS game reviews');
  }

  return gameId;
}

/**
 * @param {string} gameId
 * @returns {string}
 */
function gameUrl(gameId) {
  return `https://online-go.com/api/v1/games/${gameId}`;
}

/**
 * @param {string} gameId
 * @returns {Promise<Game>}
 */
function getGame(gameId) {
  return fetch(gameUrl(gameId)).then(resp => resp.json());
}

function attachToDom(widget) {
  const actionBar = document.querySelector('.action-bar');
  if (actionBar) {
    actionBar.parentElement.insertBefore(widget, actionBar);
  } else {
    throw new Error('Could not find insertion point (.action-bar)');
  }
}

function createToolbar(onHide) {
  const toolbar = document.createElement('div');
  toolbar.style.flex = '0 0 auto';
  toolbar.innerHTML = `<button id="mt-hide">Hide</button>`;
  toolbar.addEventListener('click', event => {
    if (event.target instanceof HTMLButtonElement && event.target.id === 'mt-hide') {
      onHide();
    }
  });
  return toolbar;
}

function createWidget() {
  const widget = document.createElement('div');
  widget.classList.add('mt-widget');
  widget.style.display = 'flex';
  widget.style.flexDirection = 'column';
  widget.style.padding = '1rem';
  widget.style.gap = '0.5rem';
  // widget.style.minHeight = '12rem';
  widget.style.boxSizing = 'border-box';
  widget.style.flex = '1 0 16rem';

  const contentContainer = document.createElement('div');
  contentContainer.style.flex = '1 1 100%';

  widget.appendChild(contentContainer);

  return {
    widget,
    content: contentContainer,
    /**
     * @param {HTMLElement} toolbar
     */
    addToolbar(toolbar) {
      widget.insertBefore(toolbar, contentContainer);
    }
  };
}

/**
 * @param {Game} game
 * @returns {Array<MoveTime>}
 */
function extractMoveTimes(game) {
  const blackPlayedFirst = game.gamedata.initial_player === 'black';
  const isOdd = (n) => n % 2 === 1;

  return game.gamedata.moves.map((move, index) => {
    const moveNumber = index + 1;

    /** @type {MoveTime} */
    const moveTime = {
      move: moveNumber,
      color: isOdd(moveNumber) && blackPlayedFirst ? 'black' : 'white',
      millis: move[2]
    };
    return moveTime;
  });
}

/**
 * @param {HTMLElement} parent
 */
function renderLoadingSpinner(parent) {
  parent.replaceChildren('Loading...');
}

/**
 * @param {HTMLElement} parent
 * @param {Array<MoveTime>} moveTimes
 */
function renderChart(parent, moveTimes) {
  const chart = document.createElement('div');
  chart.classList.add('mt-chart');
  chart.style.display = 'flex';
  // so y axis ticks can be put in place
  chart.style.position = 'relative';
  chart.style.backgroundColor = 'darkgray';
  chart.style.minHeight = '100%';
  chart.style.overflowX = 'scroll';
  chart.style.cursor = 'crosshair';
  chart.style.paddingInline = '1rem';
  
  chart.addEventListener('mouseover', event => {
    if (event.target instanceof HTMLElement && event.target.matches('.mt-bar-wrapper')) {
      console.log('mouseover', event.target);
    }
  });
  chart.addEventListener('mouseout', event => {
    if (event.target instanceof HTMLElement && event.target.matches('.mt-bar-wrapper')) {
      console.log('mouseover', event.target);
    }
  });

  const style = document.createElement('style');
  style.textContent = `
.mt-chart, .mt-chart * {
  box-sizing: border-box;
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
  flex: 1 0 3px;
}

.mt-bar-wrapper:hover {
  background-color: yellow;
}

.mt-bar-wrapper:hover .mt-bar {
  background-color: yellow;
}

.mt-bar-wrapper::before {
  display: none;
  position: absolute;
  content: attr(data-seconds) 's on move ' attr(data-move);
  top: 0px;
  min-width: 10rem;
  padding: 0.2rem;
  background-color: white;
  border-radius: 5px;
  z-index: 1;
  text-align: center;
  pointer-events: none;
}

.mt-bar-wrapper--left::before {
  left: 0;
}

.mt-bar-wrapper--right::before {
  right: 0;
}

.mt-bar-wrapper:hover::before {
  display: inline;
}

.mt-yaxis-tick {
  border-top: 1px dashed lightgray;
  left: 1rem;
  right: 1rem;
  height: 0;
  position: absolute;
  z-index: 0;
}`;
  chart.appendChild(style);

  const maxMillis = Math.max(...moveTimes.map(mt => mt.millis));
  const maxY = maxMillis * 1.1; // chart is 10% taller than max value

  // y axis ticks
  for (const tickMillis of [30, 60].map(v => v * 1000)) {
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
    barWrapper.dataset.seconds = Number(mt.millis / 1000).toFixed(1);
    barWrapper.dataset.move = mt.move;
    barWrapper.appendChild(bar);

    chart.appendChild(barWrapper);
  });

  parent.replaceChildren(chart);
}

try {
  const gameId = determineGameId(window.location.toString());

  const { content, widget, addToolbar } = createWidget();
  renderLoadingSpinner(content);

  const toolbar = createToolbar(() => widget.remove());
  addToolbar(toolbar);

  attachToDom(widget);

  getGame(gameId).then(game => {
    const moveTimes = extractMoveTimes(game);
    renderChart(content, moveTimes);
  })
  .catch(e => console.error(e));
} catch (e) {
  console.error(e);
  alert('Error: ' + e.message);
}
