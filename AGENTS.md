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

| Path | Purpose |
|------|---------|
| `_posts/` | Blog posts (YAML frontmatter + markdown body) |
| `_layouts/` | Custom layouts (e.g. `post.html` extends Minima's `default`) |
| `_includes/` | Reusable snippets (giscus comments widget) |
| `assets/` | Static images, GIFs, etc. |
| `about.html` | Static about page |
| `404.html` | Custom 404 page |
| `_config.yml` | Jekyll config (title, theme, plugins, port) |

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

## Development Environment

- **Ruby 3.4.4** (see `.ruby-version`)
- **Devcontainer**: `mcr.microsoft.com/devcontainers/base:noble` with Ruby and GitHub CLI features.
- Run all Jekyll commands via `bundle exec` to respect the Gemfile lock.

## Safety

- **Do not run `bundle install` or `bundle update` without explicit user request** — the lock file is the source of truth.
- **Do not modify `_config.yml`** without confirming the change with the user (site metadata, theme, plugins).
- Posts are personal opinion content — preserve the author's voice and tone.
