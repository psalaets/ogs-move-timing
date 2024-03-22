const process = require('node:process');

module.exports.isBuild = process.env.ELEVENTY_RUN_MODE === 'build';
