# eleventy-bookmarklet

11ty starter for a bookmarklet.

## Quick Start

1. `git clone https://github.com/psalaets/eleventy-bookmarklet.git <dir>`
2. `cd <dir>`
3. (Optional) `rm -rf .git` then `git init` to get a fresh commit history
4. `npm install`
5. Edit `package.json`:
    - Set `name` to the bookmarklet's name.
    - Set `description`
6. Write bookmarklet code in `src/bookmarklet.js`.
7. Write docs in `src/index.md`.
8. [Deploy](#deployment)

## Scripts

### Develop

- `npm run dev` - Run local dev server with auto refresh

### Release

- `npm run create-release` - Create a release from the current state of `src/bookmarklet.js`
- `npm run finalize-release` - Finish publishing a release.

### Deploy

- `npm run build` - Generic site build
- `npm run build:github-pages` - Build site for GitHub pages
- `npm run build:gitlab-pages` - Build site for GitLab pages

## Release workflows

### Option 1: No releases

Edit `src/bookmarklet.js` and expose the bookmarklet with

```html
<a href="javascript:{{code.latest}}">{{pkg.name}}</a>
```

### Option 2: Releases

When `src/bookmarklet.js` is in a state that's ready to release:

1. `npm run create-release`
2. Follow the prompts and instructions in the terminal
3. `npm run finalize-release`

Read about the [data available to templates](#available-template-data) to publish multiple versions of the bookmarklet.

## Available template data

This is available to templates in addition to the [data supplied by 11ty](https://www.11ty.dev/docs/data-eleventy-supplied/).

### `code`

An object where keys are version numbers of releases, and values are minified bookmarklet code.

It also contains 2 "alias" keys:

- `snapshot` - Current code in `src/bookmarklet.js`, regardless of if it's been officially released.
- `latest` - Code of the latest release or the same code as `snapshot` if there have not been any releases.

Example:

```js
{
  "1.0.0": "alert('old code')",
  "2.0.0": "alert('newer code')",
  "latest": "alert('newer code')",
  "snapshot": "alert('current code')"
}
```

### `collections.releases`

11ty collection of releases in ascending date order (newest release is last).

In addition to [11ty provided properties](https://www.11ty.dev/docs/collections/#collection-item-data-structure), every release has:

- `data.code` - Minified code
- `data.version` - Version number
- `date` - `Date` object of when `npm run create-release` was run
- `content` - html generated from the markdown release notes

See example usage in `src/index.md`.

## Bookmarklet website

This is an [11ty 2.0](https://www.11ty.dev/) website.

- There's only one layout: `src/_includes/layout.njk`
- All md files may use [Nunjucks templating](https://mozilla.github.io/nunjucks/).

## Deployment

### GitHub Pages

1. Create a GitHub repo for the bookmarklet and use the git CLI to set it up as a remote repo
2. Rename github folder: `mv _.github .github`
3. Commit and push to the new repo
4. In the GitHub repo's web UI go to: Settings => Code and automation => Pages
    - set Source: `Deploy from a branch`
    - set Branch: `gh-pages`, then `/ (root)`, then click Save button

### GitLab Pages

1. Rename gitlab file: `mv _.gitlab-ci.yml .gitlab-ci.yml`
2. Commit changes
3. Push changes to a GitLab repo

### Other Providers

https://www.11ty.dev/docs/deployment/#providers
