const { isBuild } = require('./is-build');
const packageJson = require('../package.json');

const CONFIG_KEY = 'eleventy-bookmarklet';
const PREFIX = `[${CONFIG_KEY} config]`;

const INLINE = 'inline';
const LAZY_LOAD = 'lazy-load';
const validTypes = [INLINE, LAZY_LOAD];

const config = packageJson[CONFIG_KEY];
if (!config) {
  throw new Error(`${PREFIX} Top-level "${CONFIG_KEY}" property not found in package.json`);
}

const { type, host } = config;

if (!validTypes.includes(type)) {
  throw new Error(`${PREFIX} Invalid type: ${type}. Expected one of: ${validTypes.join(', ')}`);
}

if (!host && isBuild && type === LAZY_LOAD) {
  throw new Error(`${PREFIX} host is required when building with type: ${LAZY_LOAD}`);
}

module.exports.INLINE = INLINE;
module.exports.LAZY_LOAD = LAZY_LOAD;
module.exports.config = {
  type,
  host: removeTrailingSlash(host)
};

function removeTrailingSlash(str) {
  while (str.endsWith('/')) {
    str = str.slice(0, -1);
  }
  return str;
}
