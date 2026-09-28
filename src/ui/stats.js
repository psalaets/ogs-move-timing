import { displayTime } from './format.js';
import { mean, median, stddev, sum } from '../math.js';

/**
 * @param {number} a
 * @param {number} b
 */
function ascending(a, b) {
  return a - b;
}

/**
 * @param {Array<import('../ogs.js').MoveTime>} moveTimes
 */
export function createStats(moveTimes) {
  const stats = document.createElement('div');

  stats.innerHTML = `
<table class="mt-stats">
  <caption>Time per move</caption>
  <thead>
    <tr><th colspan="2">Player</th><th>Main time</th><th>Overtime</th></tr>
  </thead>
  ${playerRows(moveTimes, 'black')}
  ${playerRows(moveTimes, 'white')}
</table>
<style>
/* Colors derive from inherited text color so the table reads in both OGS light and dark themes */
.mt-stats {
  border-collapse: collapse;
  border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
  width: 100%;

  caption {
    font-weight: bold;
    padding-block-end: 0.3rem;
  }

  th, td {
    padding-block: 0.3rem;
    padding-inline: 0.8rem;
    text-align: left;
  }

  thead th {
    background-color: color-mix(in srgb, currentColor 20%, transparent);
  }

  tbody + tbody {
    border-top: 1px solid color-mix(in srgb, currentColor 30%, transparent);
  }

  tbody:nth-of-type(even) {
    background-color: color-mix(in srgb, currentColor 8%, transparent);
  }

  .mt-stats-label {
    font-weight: normal;
    white-space: nowrap;
  }

  td {
    white-space: nowrap;
  }
}
</style>
`;

  return {
    stats,
  };
}

/**
 * @param {Array<import('../ogs.js').MoveTime>} moveTimes
 * @param {import('../ogs.js').PlayerColor} color
 */
function playerRows(moveTimes, color) {
  const allMoves = moveTimes.filter(mt => mt.color === color);
  const main = phaseStats(allMoves.filter(mt => mt.clockPhase === 'main'));
  const overtime = phaseStats(allMoves.filter(mt => mt.clockPhase === 'overtime'));
  const total = displayTime(sum(allMoves.map(m => m.millis)));

  return `<tbody>
<tr>
  <th rowspan="3">${color}<br><span class="mt-stats-label">${total}</span></th>
  <th class="mt-stats-label">Median</th>
  <td>${main.median}</td>
  <td>${overtime.median}</td>
</tr>
<tr>
  <th class="mt-stats-label">Mean ± 1σ</th>
  <td>${main.meanStddev}</td>
  <td>${overtime.meanStddev}</td>
</tr>
<tr>
  <th class="mt-stats-label">Total</th>
  <td>${main.total}</td>
  <td>${overtime.total}</td>
</tr>
</tbody>`;
}

/**
 * @param {Array<import('../ogs.js').MoveTime>} moves
 * @returns {{median: string, meanStddev: string, total: string}}
 */
function phaseStats(moves) {
  if (moves.length === 0) {
    return { median: '-', meanStddev: '-', total: '-' };
  }

  const millis = moves.map(m => m.millis).sort(ascending);

  return {
    median: displayTime(median(millis)),
    meanStddev: `${displayTime(mean(millis))} ± ${displayTime(stddev(millis))}`,
    total: displayTime(sum(millis))
  };
}
