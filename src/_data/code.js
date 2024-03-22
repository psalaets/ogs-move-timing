const { bundleBookmarklet } = require('../../lib/bundle-code');

/**
 * @returns {Promise<string>}
 */
module.exports = async function code() {
  return bundleBookmarklet({
    verbose: true,
  });
};
