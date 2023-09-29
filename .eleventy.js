module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter('yyyymmdd', (dateObject) => {
    return dateObject.toISOString().slice(0, 'YYYY-MM-DD'.length);
  });

  eleventyConfig.addWatchTarget('./src/**/*.js');

  return {
    dir: {
      input: 'src',
    },
    // .md files can use njk templating
    markdownTemplateEngine: 'njk'
  };
};
