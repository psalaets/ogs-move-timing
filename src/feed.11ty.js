const Feed = require('feed').Feed;

const url = 'https://example.org';

module.exports = class ReleaseFeed {
  data() {
    return {
      permalink: '/feed.xml',
    };
  }

  render(data) {
    const releases = data.collections.releases || [];
    const latest = releases.slice().pop();

    const feed = new Feed({
      title: `${data.pkg.name} bookmarklet`,
      id: url,
      link: url,
      updated: latest ? latest.date : undefined,
      feedLinks: {
        atom: url + data.permalink
      },
    });

    releases.forEach(release => {
      feed.addItem({
        title: `${data.pkg.name} bookmarklet release v${release.data.version}`,
        id: url + '/releases/' + release.data.version,
        link: url,
        content: release.content,
        date: release.date,
      });
    });

    return feed.atom1();
  }
}
