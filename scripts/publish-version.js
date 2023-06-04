const fs = require('node:fs/promises');

// 1. try to build bookmarklet.js and halt if it fails

// 2. prompt for next version, show current version

// 3. ensure versions directory

// 4. make directory for that version, fail if it already exists?

// build bookmarklet.js into versions/<version>/code.js

// create version.md in versions/<version>/ with:
//   frontmatter:
//     version: ...
//   have a directory data file that provides a code frontmatter property by reading the code file
//   the content of the md file is the release notes

// update package.json's version

// tag repo

// commit

// push new commits and tags
