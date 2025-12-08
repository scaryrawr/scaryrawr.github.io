---
layout: post
title: Dev Container GitHub Token Login in VS Code
categories: [copilot, vibe, coding, containers]
date: 2025-11-24
---

This is a follow up to [my previous post]({% post_url 2025-10-15-devpod-gh-copilot %}).

Recently, a coworker brought to my attention that VS Code supports running MCP servers both locally and remotely:

> MCP servers are executed wherever they're configured. If you're connected to a remote and want a server to run on the remote machine, it should be defined in your remote settings (MCP: Open Remote User Configuration) or in the workspace's settings. **MCP servers defined in your user settings are always executed locally.**

I think this is something I never really thought about or noticed. For some tooling though, it becomes important. Some MCP servers may utilize CLI tools (such as [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/?view=azure-cli-latest)). If you run it in a dev container or Codespace, all of a sudden, you constantly need to install and login to those tools.

There's also instances with things like [Playwright MCP](https://github.com/microsoft/playwright-mcp) or [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp/) where you want it to interact with your locally installed browser.

I'm not quite sure yet how to setup something similar for copilot CLI over SSH 🤣.

But when play with [devcontainers in VS Code](https://code.visualstudio.com/docs/devcontainers/containers), I ran into issues where [GitHub CLI](https://cli.github.com/) stopped working (since I wasn't logged in), as well as [Copilot CLI](https://github.com/features/copilot/cli/).

There's an easy fix luckily, there's a setting in the [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) that will login with the GitHub CLI Token:

```json
{
    "dev.containers.githubCLILoginWithToken": true,
}
```

![Settings UI GitHub CLI login with token]({{ "/assets/images/github-cli-setting.png" | absolute_url }})

This doesn't use the environment variable trick I was using, but instead actually logs into github cli in the dev container using a token from the currently logged in github CLI account on the host. That means there's no account switching in the dev container. It's locked in once built. You can switch accounts locally _and then_ rebuild the dev container to switch accounts in the container. Not a deal breaker, but really punishing for folks who work with multiple GitHub accounts throughout the day.
