# Copilot Instructions for ScaryRawr Blog

## File Discovery

Copilot reads this file plus `AGENTS.md` at the repo root. Shared rules (build commands, architecture, conventions) live in `AGENTS.md` — this file adds Copilot-specific guidance.

## Post Creation

When asked to create a new blog post:
1. Create `_posts/YYYY-MM-DD-slug.md` with the required frontmatter (`layout: post`, `title`, `categories`, `date`).
2. Ask the user for the post title, categories (comma-separated), and content.
3. Use the existing `_posts/` files as a style reference — casual, conversational tone with "Howdy!" openers are common.

## Content Editing

- Posts use **kramdown** markdown (the default Jekyll parser).
- Code blocks should specify a language tag: ```` ```typescript ````
- For inline code, use backticks.
- When referencing images, use Jekyll filters: `{{ "/assets/images/name.png" | relative_url }}`

## Dev Container

- The devcontainer uses the `noble` base image with Ruby 3.4.4 and GitHub CLI.
- Jekyll commands should always be prefixed with `bundle exec`.
