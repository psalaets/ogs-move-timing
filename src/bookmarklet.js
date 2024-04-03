import { ogsLandmarks, determineGameId, getGame, extractMoveTimes, gameUrl } from './ogs.js';
import { createChart } from './ui/chart.js';
import { alreadyExists, createWidget } from './ui/widget.js';
import { createToolbar } from './ui/toolbar.js';
import { putElement } from './ui/put-element.js';
import { trackCurrentMove } from './track-current-move.js';

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

if (!alreadyExists()) {
  try {
    const gameId = determineGameId(window.location.toString());
    const { playerCards, actionBar, moveNumberContainer } = ogsLandmarks();

    /**
     * Functions to run when shutting down bookmarklet
     *
     * @type {Array<() => void>}
     */
    const tearDowns = [];
    const cleanUp = () => tearDowns.forEach(fn => fn());

    // Create toolbar and widget
    const initialExpanded = false;
    const { toolbar, setToolbarActions } = createToolbar(initialExpanded);
    const { content, widget, tearDownWidget } = createWidget(toolbar);
    tearDowns.push(tearDownWidget);

    const showBig = () => putElement(widget, 'before', actionBar);
    const showSmall = () => putElement(widget, 'after', playerCards);
    setToolbarActions({
      onHide: cleanUp,
      onExpand: showBig,
      onCollapse: showSmall,
    });

    // Render widget
    if (!initialExpanded) {
      showSmall();
    } else {
      showBig();
    }

    // Load game data
    content.replaceChildren('Loading...');
    getGame(gameId)
      .then(game => {
        // Create and render chart
        const moveTimes = extractMoveTimes(game);
        const { chart, markCurrentBar } = createChart(moveTimes);
        content.replaceChildren(chart);

        // Sync highlighted bar with current move
        const stopTracking = trackCurrentMove(moveNumberContainer, (moveNumber) => markCurrentBar(moveNumber));
        tearDowns.push(stopTracking);
      })
      .catch(e => console.error(e));
  } catch (e) {
    console.error(e);
    alert('Error: ' + e.message);
  }
}
