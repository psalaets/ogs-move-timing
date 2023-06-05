const { bundleBookmarklet } = require('../lib/bundle-code');

console.log('Making sure the code builds...');

bundleBookmarklet().then(() => {
  console.log('Build successful');
}).catch(e => {
  console.error(e);
  process.exit(1);
});
