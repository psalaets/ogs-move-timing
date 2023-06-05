const pkg = require('./package.json');
const { bundleBookmarklet } = require('./lib/bundle-code');

module.exports = function(plop) {
  plop.setHelper('nowIsoDate', () => new Date().toISOString());

  plop.setGenerator('release', {
    description: 'Generate files for a new release of the bookmarklet',
    prompts: [{
      type: 'input',
      name: 'version',
      message: `Enter next version number (current version is ${pkg.version}):`
    }],
    actions: [{
      type: 'add',
      path: './src/releases/{{version}}.md',
      templateFile: 'lib/plop-templates/release.md.hbs',
    }, {
      type: 'add',
      path: './src/releases/{{version}}-code.js',
      templateFile: 'lib/plop-templates/code.js.hbs',
      transform: () => bundleBookmarklet(),
    }, {
      type: 'add',
      path: './.bookmarklet-version',
      templateFile: 'lib/plop-templates/.bookmarklet-version.hbs',
      // Overwrite if dest file already exists
      force: true,
    }]
  });
};
