import { ogsLandmarks, determineGameId, getGame, extractMoveTimes, gameUrl } from './ogs.js';
import { createChart } from './ui/chart.js';
import { createWidget } from './ui/widget.js';
import { createToolbar } from './ui/toolbar.js';
import { putElement } from './ui/put-element.js';
import { trackCurrentMove } from './track-current-move.js';
import { createStats } from './ui/stats.js';

/** Name of global clean up function */
const globalCleanUp = 'ogsMoveTimingCleanUp';

try {
  /** Clean up anything from previous invocation */
  typeof window[globalCleanUp] === 'function' && window[globalCleanUp]();

  const gameId = determineGameId(window.location.toString());
  const { playerCards, actionBar, moveNumberContainer } = ogsLandmarks();

  /**
   * Functions to run when shutting down bookmarklet
   *
   * @type {Array<() => void>}
   */
  const tearDowns = [];
  const cleanUp = () => tearDowns.forEach(fn => fn());

  // Global clean up for when bookmarklet has been run more than once
  window[globalCleanUp] = cleanUp;
  tearDowns.push(() => delete window[globalCleanUp]);

  // Create toolbar and widget
  const initialExpanded = false;
  const { toolbar, actions } = createToolbar(initialExpanded);
  const { setContent, widget, tearDownWidget } = createWidget(toolbar);
  tearDowns.push(tearDownWidget);

  const showBig = () => putElement(widget, 'before', actionBar);
  const showSmall = () => putElement(widget, 'after', playerCards);
  actions.collapse = showSmall;
  actions.expand = showBig;
  actions.hide = cleanUp;

  // Render widget
  if (!initialExpanded) {
    showSmall();
  } else {
    showBig();
  }

  // Load game data
  setContent('Loading...');
  getGame(gameId)
    .then(game => {
      const moveTimes = extractMoveTimes(game);

      if (moveTimes.length > 0) {
        // For rendering chart
        actions.chart = () => {
          setContent(container => {
            const { chart, markCurrentBar } = createChart(moveTimes);
            container.replaceChildren(chart);

            // Sync highlighted bar with current move
            return trackCurrentMove(moveNumberContainer, (moveNumber) => markCurrentBar(moveNumber));
          });
        };

        // For rendering stats block
        actions.stats = () => {
          setContent(container => {
            const { stats } = createStats(moveTimes);
            container.replaceChildren(stats);
          });
        };

        // Show chart by default
        actions.chart();
      } else {
        setContent('No moves received from server');
      }
    })
    .catch(e => console.error(e));
} catch (e) {
  console.error(e);
  alert('Error: ' + e.message);
}
