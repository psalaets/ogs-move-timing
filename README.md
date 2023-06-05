# eleventy-bookmarklet

11ty starter for a bookmarklet.

## Your Todos

- [ ] `git clone https://github.com/psalaets/eleventy-bookmarklet.git <dir>`
- [ ] `cd <dir>`
- [ ] (Optional) `rm -rf .git` then `git init` to get a fresh commit history
- [ ] `npm install`
- [ ] Set `name` in `package.json` to the bookmarklet's name.
- [ ] Set `description` in `package.json`.
- [ ] Write bookmarklet code in `src/bookmarklet.js`.
- [ ] Write docs in `src/index.md`.
- [ ] [Deploy](https://github.com/psalaets/eleventy-bookmarklet#deployment)

## Scripts

### Development

- `npm run serve` - Run server with file watching and auto refresh

### Release

- `npm run create-release` - Create a release from the current state of `src/bookmarklet.js`
- `npm run finalize-release` - Finish building and publishing a release.

### Deployment

- `npm run build` - Generic build
- `npm run build:github-pages` - Build for GitHub pages
- `npm run build:gitlab-pages` - Build for GitLab pages

## Versioning

### Option 1: No versioning

Edit `src/bookmarklet.js` and the code will be available in [`code.latest`](https://github.com/psalaets/eleventy-bookmarklet#code).

### Option 2: Cut releases

When `src/bookmarklet.js` is in a state that's ready to release...

1. `npm run create-release`
2. Follow the prompts and instructions in the terminal
3. `npm run finalize-release`

## Available 11ty data

For use in templates. This is in addition to the [data supplied by 11ty](https://www.11ty.dev/docs/data-eleventy-supplied/).

### `code`

Object where

- keys are version numbers of releases
- values are minified bookmarklet code

Also contains 2 "alias" key/value pairs:

1. snapshot - Current code in `src/bookmarklet.js`, regardless of if it's been officially released.
2. latest - Code of the latest release or the same code as "snapshot" if there have not been any releases yet.

### `collections.releases`

11ty collection of releases in ascending date order (newest release is last).

Every release object has [11ty provided properties](https://www.11ty.dev/docs/collections/#collection-item-data-structure) as well as:

- `data.code` - Minified code
- `data.version` - Version number
- `date` - Datetime when `npm run create-release` was run
- `content` - html from the markdown release notes

See example usage in `src/index.md`.

## Deployment

### GitHub Pages

1. Create a GitHub repo for your bookmarklet
2. In your GitHub repo: Settings => Code and automation => Pages, then
  - set Source: `Deploy from a branch`
  - set Branch: `gh-pages` `/ (root)`
3. Rename github folder: `mv _.github .github`
4. Commit changes
5. Push changes to the GitHub repo from step 1

### GitLab Pages

1. Rename gitlab file: `mv _.gitlab-ci.yml .gitlab-ci.yml`
2. Commit changes
3. Push changes to a GitLab repo

### Other Providers

https://www.11ty.dev/docs/deployment/#providers
