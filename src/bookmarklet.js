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

function createToolbar() {
  const toolbar = document.createElement('div');
  toolbar.style.display = 'flex';
  toolbar.style.flex = '0 0 2rem';
  toolbar.innerHTML = `<button id="mt-hide">Hide</button>`;
  toolbar.addEventListener('click', event => {
    if (event.target instanceof HTMLButtonElement && event.target.id === 'mt-hide') {
      onHide && onHide();
    }
  });
  return toolbar;
}

function createWidget() {
  const widget = document.createElement('div');
  widget.dataset.mtWidget = '';
  widget.style.display = 'flex';
  widget.style.flexDirection = 'column';
  widget.style.minHeight = '10rem';
  widget.style.padding = '1rem';

  const contentContainer = document.createElement('div');
  contentContainer.style.flex = '1 1 100%';
  contentContainer.dataset.mtContent = '';
  // contentContainer.style.backgroundColor = 'blue';

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
  chart.style.display = 'flex';
  // so y axis ticks can be put in place
  chart.style.position = 'relative';
  chart.style.gap = '1px';
  chart.style.backgroundColor = 'darkgray';
  chart.style.minHeight = '100%';
  chart.style.overflowX = 'scroll';
  chart.addEventListener('mouseover', event => {
    if (event.target instanceof HTMLElement && event.target.matches('[data-mt-bar-wrapper]')) {
      console.log('mouseover', event.target);
    }
  });

  const maxMillis = Math.max(...moveTimes.map(mt => mt.millis));
  const maxY = maxMillis * 1.1; // chart is 10% taller than max value

  // y axis ticks
  for (const tick of [30, 60].map(v => v * 1000)) {
    const line = document.createElement('div');
    line.style.borderTop = '1px dashed lightgray';
    line.style.width = '100%';
    line.style.height = '0px';
    line.style.position = 'absolute';
    line.style.zIndex = '0';
    line.style.bottom = String(tick / maxY * 100) + '%';
    chart.appendChild(line);
  }

  // vertical bars
  moveTimes.forEach(mt => {
    const bar = document.createElement('div');
    const percent = mt.millis / maxY * 100;
    bar.style.height = percent + '%';
    bar.style.flex = '1 1 100%';
    bar.style.backgroundColor = mt.color === 'black' ? 'black' : 'white';

    // full height wrapper around the bar
    const barWrapper = document.createElement('div');
    barWrapper.dataset.mtBarWrapper = '';
    barWrapper.dataset.seconds = Number(mt.millis / 1000).toFixed(1),
    barWrapper.dataset.move = mt.move;
    barWrapper.style.minHeight = '100%';
    barWrapper.style.position = 'relative';
    barWrapper.style.display = 'flex';
    barWrapper.style.alignItems = 'flex-end';
    barWrapper.style.flex = '1 0 3px';
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
