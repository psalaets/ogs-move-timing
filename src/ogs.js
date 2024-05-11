/**
 * @typedef {number} MoveCol Zero-based index of the column, starting from the left
 * @typedef {number} MoveRow Zero-based index of the row, starting from the top
 * @typedef {number} MoveMillis Milliseconds elapsed between previous move and this move
 * @typedef {[MoveCol, MoveRow, MoveMillis]} Move A stone played on the board
 */

/**
 * @typedef {'white' | 'black'} PlayerColor
 */

/**
 * @typedef {Object} ByoyomiTimeControl
 * @property {'byoyomi'} system
 * @property {number} main_time
 * @property {number} period_time
 *
 * @typedef {Object} CanadianTimeControl
 * @property {'canadian'} system
 * @property {number} main_time
 *
 * @typedef {Object} OtherTimeControl
 * @property {string} system
 *
 * @typedef {ByoyomiTimeControl | CanadianTimeControl | OtherTimeControl} TimeControl
 */

/**
 * @typedef {Object} Gamedata
 * @property {Array<Move>} moves
 * @property {PlayerColor} initial_player
 * @property {TimeControl} time_control
 */

/**
 * @typedef {Object} Game Just the game data needed for this bookmarklet, not exhaustive.
 * @property {Gamedata} gamedata
 */

/**
 * @typedef {'main' | 'overtime'} ClockPhase
 */

/**
 * @typedef {Object} MoveTime
 * @property {number} move Move number
 * @property {number} millis How long spent thinking before the move
 * @property {PlayerColor} color Who played the move
 * @property {ClockPhase} clockPhase
 */

/**
 * @typedef {object} Landmarks
 * @property {HTMLElement} playerCards
 * @property {HTMLElement} actionBar
 * @property {HTMLElement} moveNumberContainer
 *
 * @returns {Landmarks}
 */
export function ogsLandmarks() {
  const playerCards = document.querySelector('div:has(> .players)');
  const actionBar = document.querySelector('.action-bar');
  const moveNumberContainer = document.querySelector('.move-number');

  if (!playerCards) throw new Error('Unable to find players: div:has(> .players)')
  if (!actionBar) throw new Error('Unable to find action bar: .action-bar');
  if (!moveNumberContainer) throw new Error('Unable to find move number: .move-number');

  return {
    playerCards,
    actionBar,
    moveNumberContainer,
  };
}

/**
 * Figure out game id from a url.
 *
 * @returns {string}
 */
export function determineGameId(url) {
  const pattern = /https:\/\/online-go\.com\/game\/(view\/)?(\d+)/;
  const matchResult = pattern.exec(url);
  // Game id is in 2nd capture group
  const gameId = matchResult ? matchResult[2] : null;

  if (!gameId) {
    throw new Error('The move timing chart can only be loaded from OGS games.\n\nIf you\'re in a review, load the chart in game view first then return to the review.');
  }

  return gameId;
}

/**
 * Game url in OGS API.
 *
 * @param {string} gameId
 * @returns {string}
 */
export function gameUrl(gameId) {
  return `https://online-go.com/api/v1/games/${gameId}`;
}

/**
 * @param {string} gameId
 * @returns {Promise<Game>}
 */
export function getGame(gameId) {
  return fetch(gameUrl(gameId))
    .then(resp => resp.json());
}

/**
 * @param {Game} game
 * @returns {Array<MoveTime>}
 */
export function extractMoveTimes(game) {
  const blackPlayedFirst = game.gamedata.initial_player === 'black';
  const oddTurnColor = blackPlayedFirst ? 'black' : 'white';
  const evenTurnColor = blackPlayedFirst ? 'white' : 'black';
  const isOdd = (n) => n % 2 === 1;

  // For tracking what clock phase a move is in
  const hasMainTime = mainTimeSeconds(game) !== null;
  const mainTimeRemaining = {
    black: hasMainTime ? mainTimeSeconds(game) * 1000 : Infinity,
    white: hasMainTime ? mainTimeSeconds(game) * 1000 : Infinity,
  };

  return game.gamedata.moves.map((move, index) => {
    const moveNumber = index + 1;
    const playerColor = isOdd(moveNumber) ? oddTurnColor : evenTurnColor;
    const millis = move[2];

    /** @type {MoveTime} */
    const moveTime = {
      move: moveNumber,
      color: playerColor,
      millis: millis,
      clockPhase: mainTimeRemaining[playerColor] > 0 ? 'main' : 'overtime',
    };

    // First move doesn't consume main time
    if (moveNumber > 1) {
      mainTimeRemaining[playerColor] -= millis;
    }

    return moveTime;
  });
}

/**
 * @param {Game} game
 * @returns {number | null} Number of seconds of main time, if any
 */
export function mainTimeSeconds(game) {
  return timeControl(game).main_time != null ? timeControl(game).main_time : null;
}

/**
 * @param {Game} game
 * @returns {number | null} Number of seconds of byoyomi period time, if any
 */
export function byoyomiPeriodTime(game) {
  return timeControl(game).system === 'byoyomi' ? timeControl(game).period_time : null;
}

/**
 * @param {Game} game
 * @return {TimeControl} Time control used in the game
 */
function timeControl(game) {
  return game.gamedata.time_control;
}
