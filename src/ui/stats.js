/**
 * @param {Array<number>} values
 * @returns {number}
 */
function mean(values) {
  if (values.length === 0) {
    return 0;
  }

  const sum = values.reduce((total, value) => total + value, 0);
  return sum / values.length;
}

/**
 * @param {Array<number>} values
 * @returns {number}
 */
function median(sortedValues) {
  return sortedValues.length === 1
    ? sortedValues[0]
    : sortedValues.length === 2
    ? mean(sortedValues)
    : median(sortedValues.slice(1, -1));
}

/**
 * @param {Array<import('../ogs.js').MoveTime>} moveTimes
 */
export function createStats(moveTimes) {
  const stats = document.createElement('div');
  stats.textContent = 'stats here';

  return {
    stats,
  };
}
