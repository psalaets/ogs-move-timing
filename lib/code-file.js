const suffix = '-code.js';

/**
 * @param {string} filePath
 * @returns {boolean}
 */
module.exports.isCodeFile = (filePath) => filePath.endsWith(suffix);

/**
 * @param {string} version
 * @returns {string}
 */
module.exports.toCodeFileName = (version) => `${version}${suffix}`;

/**
 * @param {string} codeFileName
 * @returns {string}
 */
module.exports.extractVersion = (codeFileName) => codeFileName.slice(0, -suffix.length);
