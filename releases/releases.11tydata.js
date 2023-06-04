const fs = require('node:fs/promises');
const path = require('node:path');
const { toCodeFileName } = require('../lib/code-file');

/**
 * This reads the version and adds the corresponding source code to the
 * release's data.
 */

module.exports = {
  eleventyComputed: {
    /**
     * @returns {Promise<string>}
     */
    code: data => {
      const version = data.version;
      if (!version) {
        throw new Error(`No "version" property in data of ${data.page.inputPath}`);
      }

      const codePath = path.join(__dirname, toCodeFileName(version));
      return fs.readFile(codePath).then(buffer => buffer.toString('utf-8'));
    },
  }
};
