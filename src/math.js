/**
 * @param {Array<number>} values
 * @returns {number}
 */
export function mean(values) {
  if (values.length === 0) {
    return 0;
  }

  return sum(values) / values.length;
}

/**
 * @param {Array<number>} values
 * @returns {number}
 */
export function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

/**
 * Population standard deviation.
 *
 * @param {Array<number>} values
 * @returns {number}
 */
export function stddev(values) {
  if (values.length === 0) {
    return 0;
  }

  const avg = mean(values);
  const variance = mean(values.map(value => (value - avg) ** 2));
  return Math.sqrt(variance);
}

/**
 * @param {Array<number>} values
 * @returns {number}
 */
export function median(sortedValues) {
  switch (sortedValues.length) {
    case 0:
      return 0;
    case 1:
      return sortedValues[0];
    case 2:
      return mean(sortedValues);
    default:
      return median(sortedValues.slice(1, -1));
  }
}
