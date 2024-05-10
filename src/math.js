/**
 * @param {Array<number>} values
 * @returns {number}
 */
export function mean(values) {
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
