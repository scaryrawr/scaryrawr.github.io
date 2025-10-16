---
layout: post
title: DevPod and GitHub Copilot
categories: [tui, copilot, vibe, coding, containers]
date: 2025-10-15
---

Howdy!

## Background

Lately, I've been getting way more into vibe coding. I tend to use coding agents in "yolo" mode as approvals slow things down. It gets especially harder when trying to juggle multiple agents at the same time.

Using yolo mode... I've been bitten a few times where an agent might "go rogue" and delete or modify files I never intended.

I'm not a fan of trying to figure out [docker](https://www.docker.com/) directly but really like [devcontainers](https://containers.dev/) which utilizes docker to create dev containers.

At work, I really got into devcontainers since we started using them with [GitHub Codespaces](https://github.com/features/codespaces). For work, it's pretty sweet to use beefy cloud machines. For personal use, you can get some codespace use "for free", but it usually doesn't feel worth it, you get 120 core hours "free", with the bottom machine being 2 cores (so really, 60 hours at low end machine). The fact you can use them through web from a tablet and stuff is fun at first, but practically, I like them for validation and testing, but not my main development machine (for personal projects).

For personal use, I tend to do a lot of my development outside of containers. I see more folks recommending using containers for development, but they themselves also tend not to since it can be a hassle 🤣. I think having to auth locally, auth in a container, etc... ends up being way to big of a pain point (but folks... I've learned some magic).

Lately, I've been playing around a lot to get away from VS Code (no real reason other than the terminal is cool again). And for my local setup, I've started leaning into [DevPod](https://devpod.sh/) for managing dev containers with [podman](https://podman.io) as the "provider" (using its docker compatibility).

Some additional background, I get [GitHub Copilot](https://github.com/features/copilot) through work, and they just released [Copilot CLI](https://github.com/features/copilot/cli/). Personally, I was using [opencode](https://opencode.ai), but it tends to be a pain to have to authenticate every time you create a dev container.

That's where GitHub Copilot got interesting...

## Meaty Stuff

If you have [GitHub CLI](https://cli.github.com/) installed and authenticated, you don't need to login to `@github/copilot`. This is kind of madness. All other copilot based tools need you to authenticate with GitHub and cannot leverage the `gh auth token` to access copilot APIs, but `@github/copilot` can!

This gets pretty sweet when using devpod or just SSH in general to access devcontainers. Since copilot can auth with a regular `gh auth token`, you can just set it as part of the environment when using devpod:

```sh
devpod ssh --set-env GH_TOKEN=`gh auth token`
```

Not only that, but GitHub CLI will also pick up on the environment variable and use it as well (so the [GitHub CLI container feature](https://github.com/devcontainers/features/tree/main/src/github-cli) will just work as expected (for the account you open the workspace in, it will not support account switching)).

This makes it pretty sweet to use GitHub CLI as your account management for working with personal repos, work repos, etc. You can configure gh to be used for git auth which also gets picked up by devpod when creating workspaces from remote repos:

```sh
gh auth setup-git
```

Now, if I need to clone a work repo in a container, if the work account is active in GitHub CLI it'll clone and create successfully.

Playing around a bit more... I want [copilot.lua](https://github.com/zbirenbaum/copilot.lua) to also work. This one, I'm not aware of a good way to get it to support account switching, but if you authenticate with copilot.lua locally, it creates a `$XDG_CONFIG_HOME/github-copilot/apps.json` with a device token that can be used to authenticate for copilot completions for the LSP. We can also forward this with `devpod ssh` using [`jq`](https://jqlang.org/) to parse out the token:

```sh
devpod ssh --set-env GH_COPILOT_TOKEN=`jq -r '."github.com:Iv1.b507a08c87ecfe98".oauth_token' "$XDG_CONFIG_HOME/github-copilot/apps.json"`
```

Now, it seems that Copilot CLI and LSP work well with [LazyVim](https://www.lazyvim.org/) and [sidekick.nvim](https://github.com/folke/sidekick.nvim).

## zsh/fish plugins

Now, I'm currently working on [devpod-gh.fish](https://github.com/scaryrawr/devpod-gh.fish) and [devpod-gh.zsh](https://github.com/scaryrawr/devpod-gh.zsh) to help automate these steps (they're just function wrappers around `devpod ssh`). As well as automating things like port forwarding, pairing with my own [dotfiles](https://github.com/scaryrawr/clouddots) (GitHub [docs on dotfiles](https://docs.github.com/en/codespaces/setting-your-user-preferences/personalizing-github-codespaces-for-your-account#dotfiles)) it's easy to automate devcontainer recreation for "safe" vibe coding (not exactly safe, but my local environment is more protected).

I think some of this functionality keeps coming up (I vibe coded a similar [github cli extension](https://github.com/scaryrawr/gh-ado-codespaces)), where it would be fun to make a common client/server setup for some of the ssh local/remote services needed 🤔. A lot of this is inspired by how [vscode remove server](https://code.visualstudio.com/docs/remote/vscode-server) is installed by vs code whenever you ssh or tunnel to a remote machine (I don't actually know the internals of vs code's remote server, but when trying to see if I could get similar functionality over SSH, it seems like it would do similar things).
