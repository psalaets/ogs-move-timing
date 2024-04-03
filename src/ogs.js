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
  const pattern = /https:\/\/online-go\.com\/game\/(\d+)/;
  const matchResult = pattern.exec(url);
  // Game id is in 1st capture group
  const gameId = matchResult ? matchResult[1] : null;

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

  return game.gamedata.moves.map((move, index) => {
    const moveNumber = index + 1;

    /** @type {MoveTime} */
    const moveTime = {
      move: moveNumber,
      color: isOdd(moveNumber) ? oddTurnColor : evenTurnColor,
      millis: move[2]
    };
    return moveTime;
  });
}
