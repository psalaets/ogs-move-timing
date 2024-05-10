/**
 * @param {number} millis
 * @returns {string}
 */
export function displayTime(millis) {
  const seconds = millis / 1000;
  const approxSeconds = millis >= 1000 ? Math.round(seconds) : seconds;
  return approxSeconds < 60 ? displaySeconds(approxSeconds) : displayMinutesAndSeconds(approxSeconds);
}

/**
 * @param {number} seconds
 * @retrns {string}
 */
function displaySeconds(seconds) {
  const truncated = seconds.toFixed(1);
  const formatted = truncated.endsWith('.0') ? truncated.slice(0, -2) : truncated;
  return formatted + 's';
}

/**
 * @param {number} seconds
 * @retrns {string}
 */
function displayMinutesAndSeconds(seconds) {
  const leftoverSeconds = Math.trunc(seconds % 60);

  return [
    // whole minutes
    Math.trunc(seconds / 60) + 'm',
    // seconds of the partial minute, if any
    leftoverSeconds !== 0 ? leftoverSeconds + 's' : ''
  ]
    .filter(p => p)
    .join(' ');
}
