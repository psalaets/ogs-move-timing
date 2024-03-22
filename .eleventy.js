const { builder } = require('./lib/builder');

module.exports = function(eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/**/*.js');

  builder.configure11ty(eleventyConfig);

  return {
    dir: {
      input: 'src',
    },
    // .md files can use njk templating
    markdownTemplateEngine: 'njk'
  };
};
