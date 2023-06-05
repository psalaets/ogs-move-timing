const fs = require('node:fs/promises');
const path = require('node:path');
const { extractVersion, isCodeFile } = require('../../lib/release-filename');
const { bundleBookmarklet } = require('../../lib/bundle-code');
const semverCompare = require('semver-compare');

/**
 * @returns {Record<string, string>}
 */
module.exports = async function code() {
  const codeByVersion = {};

  // Add code from releases
  const releasesPath = path.join(__dirname, '../releases/');
  const files = await fs.readdir(releasesPath);
  const codeFiles = files.filter(fileName => isCodeFile(fileName));

  for (const fileName of codeFiles) {
    const version = extractVersion(fileName);
    const filePath = path.join(releasesPath, fileName);
    const releaseCode = await fs.readFile(filePath, {encoding: 'utf-8'});

    codeByVersion[version] = releaseCode;
  }

  // Add aliases
  const snapshotCode = await bundleBookmarklet({
    verbose: true,
  });

  const versions = Object.keys(codeByVersion);
  const latestCode = versions.length > 0
    ? codeByVersion[latestVersion(versions)]
    : snapshotCode;

  codeByVersion.snapshot = snapshotCode;
  codeByVersion.latest = latestCode;

  console.log(codeByVersion);

  return codeByVersion;
};

/**
 * @param {Array<string>} versions
 * @return {string}
 */
function latestVersion(versions) {
  const latest = versions.slice().sort(semverCompare).pop();

  if (!latest) {
    throw new Error(`Cannot find latest version from ${JSON.stringify(versions)}`);
  }

  return latest
}
