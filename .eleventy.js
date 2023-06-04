module.exports = function(eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/**/*.js');

  eleventyConfig.addFilter('yyyymmdd', (dateObject) => {
    return dateObject.toISOString().slice(0, 'YYYY-MM-DD'.length);
  });

  return {
    // .md files can use njk templating
    markdownTemplateEngine: 'njk'
  };
};
