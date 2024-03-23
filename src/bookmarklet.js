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
 * Figure out the current page's game id.
 *
 * @returns {string}
 */
function determineGameId() {
  const pattern = /https:\/\/online-go\.com\/(game|review)\/(\d+)/;
  const matchResult = pattern.exec(window.location);
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

function createWidget(onHide) {
  const widget = document.createElement('div');
  widget.dataset.mtWidget = '';
  widget.style.display = 'flex';
  widget.style.flexDirection = 'column';
  widget.style.minHeight = '10rem';
  widget.style.padding = '1rem';

  const toolbar = document.createElement('div');
  toolbar.style.display = 'flex';
  toolbar.style.flex = '0 0 2rem';
  toolbar.innerHTML = `<button id="mt-hide">Hide</button>`;
  toolbar.addEventListener('click', event => {
    if (event.target instanceof HTMLButtonElement && event.target.id === 'mt-hide') {
      onHide && onHide();
    }
  });

  const contentContainer = document.createElement('div');
  contentContainer.style.flex = '1 1 100%';
  contentContainer.dataset.mtContent = '';
  // contentContainer.style.backgroundColor = 'blue';

  widget.appendChild(toolbar);
  widget.appendChild(contentContainer);

  return {
    widget,
    content: contentContainer
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
function renderBars(parent, moveTimes) {
  const chart = document.createElement('div');
  chart.style.display = 'flex';
  // chart.style.gap = '1px';
  chart.style.backgroundColor = 'lightgray';
  chart.style.minHeight = '100%';
  chart.style.overflowX = 'scroll';
  chart.addEventListener('mouseover', event => {
    if (event.target instanceof HTMLElement && event.target.matches('[data-mt-bar-wrapper]')) {
      console.log('mouseover', event.target);
    }
  });

  const maxMillis = Math.max(...moveTimes.map(mt => mt.millis));

  moveTimes.forEach(mt => {
    const bar = document.createElement('div');
    const percent = mt.millis / maxMillis * 100;
    bar.style.height = percent + '%';
    bar.style.flex = '1 1 100%';
    bar.style.backgroundColor = mt.color;

    // full height wrapper around the bar
    const barWrapper = document.createElement('div');
    barWrapper.dataset = {
      mtBarWrapper: '',
      seconds: Number(mt.millis / 1000).toFixed(1),
      move: mt.move
    };
    barWrapper.style.minHeight = '100%';
    barWrapper.style.display = 'flex';
    barWrapper.style.alignItems = 'flex-end';
    barWrapper.style.flex = '1 0 3px';
    barWrapper.appendChild(bar);

    chart.appendChild(barWrapper);
  });

  parent.replaceChildren(chart);
}

try {
  const gameId = determineGameId();

  const { content, widget } = createWidget();
  renderLoadingSpinner(content);

  getGame(gameId)
    .then(game => {
      const moveTimes = extractMoveTimes(game);
      renderBars(content, moveTimes);
    })
    .catch(e => {
      console.error(e);
    });
} catch (e) {
  console.error(e);
  alert(e.message);
}
