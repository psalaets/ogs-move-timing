# eleventy-bookmarklet

11ty starter for a bookmarklet.

## Quick Start

1. `git clone https://github.com/psalaets/eleventy-bookmarklet.git <dir>`
2. `cd <dir>`
3. (Optional) `rm -rf .git` then `git init` to get a fresh commit history
4. `npm install`
5. Edit `package.json`
    - Set `name` to the bookmarklet's name.
    - Set `description`
6. Write bookmarklet code in `src/bookmarklet.js`.
7. Write docs in `src/index.md`.
8. [Deploy](#deployment)

## Scripts

### Develop

- `npm run dev` - Run local dev server with auto refresh

### Deploy

- `npm run build` - Generic site build
- `npm run build:github-pages` - Build site for GitHub pages
- `npm run build:gitlab-pages` - Build site for GitLab pages

## Available template data

This is available to templates in addition to the [data supplied by 11ty](https://www.11ty.dev/docs/data-eleventy-supplied/).

### `code`

The code of the bookmarklet.

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
