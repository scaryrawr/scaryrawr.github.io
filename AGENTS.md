# ScaryRawr Blog — Shared Instructions

## Project Overview

Jekyll 4.1 blog (GitHub Pages) using the **Minima** theme with the **jekyll-feed** plugin. Hosted at `scaryrawr.github.io`.

## Build & Validation

```bash
bundle exec jekyll build   # Build site to _site/
bundle exec jekyll serve --liveriveload  # Dev server (port 4000)
```

No linting or test suite — this is a content blog.

## Architecture

| Path          | Purpose                                                      |
| ------------- | ------------------------------------------------------------ |
| `_posts/`     | Blog posts (YAML frontmatter + markdown body)                |
| `_layouts/`   | Custom layouts (e.g. `post.html` extends Minima's `default`) |
| `_includes/`  | Reusable snippets (giscus comments widget; `head.html` and `header.html` override Minima's for theme support) |
| `assets/main.scss` | Theme stylesheet (light/dark tokens + overrides)        |
| `assets/theme.js`  | Theme script (system preference + manual override)      |
| `assets/`     | Static images, GIFs, etc.                                    |
| `about.html`  | Static about page                                            |
| `404.html`    | Custom 404 page                                              |
| `_config.yml` | Jekyll config (title, theme, plugins, port)                  |

## Post Conventions

Posts live in `_posts/` with filename format: `YYYY-MM-DD-slug.md`.

**Required frontmatter:**

```yaml
layout: post
title: "Post Title"
categories: [tag1, tag2]
date: YYYY-MM-DD
```

- Use **markdown** for posts (not `.html`).
- Use **semantic HTML** inside posts (headings, lists, code blocks with language tags).
- Reference images with `{{ "/assets/images/filename.png" | relative_url }}` or `absolute_url`.
- The devcontainer cSpell dictionary is in `.vscode/settings.json` — use those words for names/terms.

## Light/Dark Theme

- The theme follows the system `prefers-color-scheme` setting automatically;
  a sun/moon toggle in the site header stores a manual override in
  `localStorage` under the `theme` key.
- Theme state lives on `<html data-theme="light|dark">` (set pre-paint by an
  inline script in `_includes/head.html` to avoid flashing).
- `assets/main.scss` defines CSS custom properties in `:root` (light) and
  redefines them via a shared `dark-tokens` mixin for dark mode. **Add new
  colors as tokens and use `var(...)` in component rules — do not hardcode
  light/dark color pairs.**
- `assets/theme.js` applies/persists the theme, listens for live system
  changes, and fires a `themechange` document event; `_includes/giscus.html`
  listens to it to keep the comments widget in sync.
- When overriding a Minima rule for dark mode, **match its specificity**
  (e.g. Minima styles the nav as `.site-nav .page-link`; a bare `.page-link`
  override silently loses). Its syntax theme uses `.highlight .<tok>` pairs —
  keep the token-pair form when recoloring syntax.

## Development Environment

- **Ruby 3.4.4** (see `.ruby-version`)
- **Devcontainer**: `mcr.microsoft.com/devcontainers/base:noble` with Ruby and GitHub CLI features.
- Run all Jekyll commands via `bundle exec` to respect the Gemfile lock.

## Safety

- **Do not run `bundle install` or `bundle update` without explicit user request** — the lock file is the source of truth.
- **Do not modify `_config.yml`** without confirming the change with the user (site metadata, theme, plugins).
- **Root files without YAML frontmatter are published as-is** (Jekyll copies them into `_site/`). Agent/docs files like `AGENTS.md` and `CLAUDE.md` are kept off the live site via the `exclude:` list in `_config.yml` — add any new such files there.
- Posts are personal opinion content — preserve the author's voice and tone.
