const fs = require('node:fs');
const path = require('node:path');

const { toMarkdownFileName } = require('../lib/release-filename')
const version = fs.readFileSync(path.join(__dirname, '../.bookmarklet-version'), {encoding: 'utf-8'});

console.log(`Release has been created!

Perform these steps to finalize the release:

1. Edit src/releases/${toMarkdownFileName(version)}
2. Edit src/index.md (if necessary)
3. npm run finalize-release
`)
