const { builder } = require('./lib/builder');

module.exports = function(eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/**/*.js');

  builder.configure11ty(eleventyConfig);

  // Dev bookmarklet loads bookmarklet.js as a module script from OGS, which
  // requires CORS (GitHub Pages already sends this header in production)
  eleventyConfig.setServerOptions({
    middleware: [
      (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
        next();
      }
    ]
  });

  return {
    dir: {
      input: 'src',
    },
    // .md files can use njk templating
    markdownTemplateEngine: 'njk'
  };
};
