import { displayTime } from './format.js';
import { median } from '../math.js';

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
  <caption>Time per move (median)</caption>
  <thead>
    <tr><th>Player</th><th>Main time</th><th>Overtime</th></tr>
  </thead>
  <tbody>
  ${playerRow(moveTimes, 'black')}
  ${playerRow(moveTimes, 'white')}
  </tbody>
</table>
<style>
.mt-stats {
  border-collapse: collapse;
  border: 1px solid #ddd;
  width: 100%;

  th, td {
    padding-block: 0.3rem;
    padding-inline: 0.8rem;
    text-align: left;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  thead th {
    background-color: #e0e0e0;
    font-weight: bold;
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
function playerRow(moveTimes, color) {
  const allMoves = moveTimes.filter(mt => mt.color === color);
  const mainMoves = allMoves.filter(mt => mt.clockPhase === 'main');
  const overtimeMoves = allMoves.filter(mt => mt.clockPhase === 'overtime');

  const timePerMove = {
    main: mainMoves.length > 0 ? displayTime(median(mainMoves.map(m => m.millis).sort(ascending))) : '-',
    overtime: overtimeMoves.length > 0 ? displayTime(median(overtimeMoves.map(m => m.millis).sort(ascending))) : '-'
  };

  return `<tr>
  <th>${color}</th>
  <td>${timePerMove.main}</td>
  <td>${timePerMove.overtime}</td>
</tr>`;
}
