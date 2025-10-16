---
layout: post
title: DevPod and GitHub Copilot
categories: [tui, copilot, vibe, coding, containers]
date: 2025-10-15
---

Howdy!

## Background

Lately, I've been getting way more into vibe coding. I tend to use coding agents in "yolo" mode since approvals slow things down. This gets especially tricky when juggling multiple agents at the same time.

Using yolo mode... I've been bitten a few times where an agent might "go rogue" and delete or modify files I never intended.

I'm not a fan of trying to figure out [Docker](https://www.docker.com/) directly but really like [devcontainers](https://containers.dev/) which utilizes Docker to create devcontainers.

At work, I really got into devcontainers since we started using them with [GitHub Codespaces](https://github.com/features/codespaces). For work, it's pretty sweet to use beefy cloud machines. For personal use, you get some codespace hours "for free", but it doesn't feel worth it. You get 120 core hours free—with the base machine being 2 cores, that's really 60 hours. Using them through a web browser from a tablet is fun at first, but I mainly use them for validation and testing, not as my primary development machine for personal projects.

For personal projects, I tend to develop outside of containers. I see more folks recommending containers for development, but they often don't use them either since it can be a hassle 🤣. Having to authenticate locally, then again in a container, ends up being a major pain point (but folks... I've learned some magic).

Lately, I've been playing around to get away from VS Code (no real reason other than the terminal is cool again). For my local setup, I've started using [DevPod](https://devpod.sh/) to manage devcontainers with [Podman](https://podman.io) as the "provider" (using its Docker compatibility).

Some additional background: I get [GitHub Copilot](https://github.com/features/copilot) through work, and they just released [Copilot CLI](https://github.com/features/copilot/cli/). I was using [opencode](https://opencode.ai), but it's a pain to authenticate every time you create a devcontainer.

That's where GitHub Copilot got interesting...

## Meaty Stuff

If you have [GitHub CLI](https://cli.github.com/) installed and authenticated, you don't need to login to `@github/copilot`. This is kind of madness. All other Copilot-based tools need you to authenticate with GitHub and cannot leverage the `gh auth token` to access Copilot APIs, but `@github/copilot` can!

This gets pretty sweet when using DevPod or SSH to access devcontainers. Since Copilot can auth with a regular `gh auth token`, you can set it as part of the environment when using DevPod:

```sh
devpod ssh --set-env GH_TOKEN=`gh auth token`
```

Not only that, but GitHub CLI will also pick up on the environment variable and use it (so the [GitHub CLI container feature](https://github.com/devcontainers/features/tree/main/src/github-cli) will just work as expected for the account you opened the workspace with—it won't support account switching).

This makes it pretty sweet to use GitHub CLI for account management across personal repos, work repos, etc. You can configure gh to be used for git auth, which also gets picked up by DevPod when creating workspaces from remote repos:

```sh
gh auth setup-git
```

Now, if I need to clone a work repo in a container, as long as the work account is active in GitHub CLI it'll clone and create successfully.

Playing around a bit more... I want [copilot.lua](https://github.com/zbirenbaum/copilot.lua) to also work. I'm not aware of a good way to get it to support account switching, but if you authenticate with copilot.lua locally, it creates a `$XDG_CONFIG_HOME/github-copilot/apps.json` with a device token that can be used for Copilot completions in the LSP. We can forward this with `devpod ssh` using [`jq`](https://jqlang.org/) to parse out the token:

```sh
devpod ssh --set-env GH_COPILOT_TOKEN=`jq -r '."github.com:Iv1.b507a08c87ecfe98".oauth_token' "$XDG_CONFIG_HOME/github-copilot/apps.json"`
```

Now, it seems that Copilot CLI and LSP work well with [LazyVim](https://www.lazyvim.org/) and [sidekick.nvim](https://github.com/folke/sidekick.nvim).

## zsh/fish plugins

I'm currently working on [devpod-gh.fish](https://github.com/scaryrawr/devpod-gh.fish) and [devpod-gh.zsh](https://github.com/scaryrawr/devpod-gh.zsh) to automate these steps (they're function wrappers around `devpod ssh`). Combined with automating things like port forwarding and pairing with my own [dotfiles](https://github.com/scaryrawr/clouddots) (GitHub [docs on dotfiles](https://docs.github.com/en/codespaces/setting-your-user-preferences/personalizing-github-codespaces-for-your-account#dotfiles)), it's easy to automate devcontainer recreation for "safe" vibe coding (not exactly safe, but my local environment is more protected).

I think some of this functionality keeps coming up (I vibe coded a similar [GitHub CLI extension](https://github.com/scaryrawr/gh-ado-codespaces)), so it would be fun to make a common client/server setup for some of the SSH local/remote services needed 🤔. A lot of this is inspired by how [VS Code Remote Server](https://code.visualstudio.com/docs/remote/vscode-server) is installed by VS Code whenever you SSH or tunnel to a remote machine (I don't actually know the internals of VS Code's remote server, but when trying to get similar functionality over SSH, it seems like it does similar things).
