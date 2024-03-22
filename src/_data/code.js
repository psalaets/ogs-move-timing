const { builder } = require('../../lib/builder');

/**
 * @returns {Promise<string>}
 */
module.exports = function code() {
  return builder.bundleForUrl();
};
