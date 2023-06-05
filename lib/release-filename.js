const codeFileSuffix = '-code.js';
const mdFileSuffix = '.md';

/**
 * @param {string} filePath
 * @returns {boolean}
 */
module.exports.isCodeFile = (filePath) => filePath.endsWith(codeFileSuffix);

/**
 * @param {string} version
 * @returns {string}
 */
module.exports.toCodeFileName = (version) => `${version}${codeFileSuffix}`;

/**
 * @param {string} codeFileName
 * @returns {string}
 */
module.exports.extractVersion = (codeFileName) => codeFileName.slice(0, -codeFileSuffix.length);

/**
 * @param {string} version
 * @returns {string}
 */
module.exports.toMarkdownFileName = (version) => `${version}${mdFileSuffix}`;
