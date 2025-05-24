---
layout: post
title: Azure CLI Auth
categories: [azure, cli, scripting]
date: 2025-05-23
---

Howdy!

One thing I really hate is managing PATs (Personal Access Tokens).

At work, we use Azure DevOps (ADO), we use it for [package feeds](https://azure.microsoft.com/en-us/products/devops/artifacts/?msockid=129ef2e001f26df42791e7aa00f36c88), tracking work items, etc.

Traditionally, we tend to sign in, generate a PAT, use it for a week, and then repeat. (It also emails you about it expiring, etc...).

We've also been using [GitHub Codespaces with ADO](https://github.com/microsoft/ado-codespaces-auth), so that we can clone and consume packages from ADO within the codespace. I've really liked it, no need to manage PATs. The downside(-ish), is you're kind of locked into VS Code. Not a big issue to be honest (VS Code is my default editor), but I started getting curious.

In Codespaces I could easily write scripts that use the ado-auth-helper from the ado-codespaces-auth extension to get a token, call [ADO APIs](https://learn.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-7.2), but like... what if I didn't want to spin up a codespace just for that?

Enter [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/?view=azure-cli-latest).

Looking at the ADO Codespace Auth extension, it looked like they just used a [default scope](https://github.com/microsoft/ado-codespaces-auth/blob/7c858550b96194a89e87e630472e7c9f396436f4/src/extension.ts#L9) for accessing ADO and asking VS Code to authenticate for it.

Turns own, using Azure CLI, you can do the same thing with:

```sh
az login --scope "499b84ac-1321-427f-aa17-267ca6975798/.default"
```

And then just... get tokens:

```sh
az account get-access-token --query accessToken -o tsv
```

This got me the same behavior now as the `ado-auth-helper` in codespaces so I can write scripts and also avoid PATs on my local machine.

To avoid needing to configure PATs locally, I wrote a [PowerShell module](https://github.com/scaryrawr/az-auth-helpers.pwsh/blob/main/az-auth-helpers.psm1) that wraps the Azure CLI command and uses variables to avoid needing to deal with PATs. There's some caveats doing things this way, that you always need to call the PowerShell function wrapping `yarn`, so other scripts may break. There's a discussion about the same issue in the devcontainer [artifacts helper feature](https://github.com/microsoft/codespace-features/issues/55) that inspired using shell wrappers for auth. I don't think these are a blocker for me, but it does get interesting for writing scripts that don't load your profile.

It also got me thinking though... I like to ssh into codespaces at times, but! Without VS Code, I don't have the auth service running, so the `ado-auth-helper` doesn't work, so I cannot use `git` to interact with remotes, and I cannot use `yarn install`. If all the script does, is ask VS Code to authenticate and get a token, couldn't I do the same thing?

I ended up finding out that there's an azure identity package for most popular programming languages, and the identity library even has an [AzureCLICredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#section-readme) class that wraps the Azure CLI to  authenticate.

I started getting curious about how could I do something over SSH using this, I started asking [Github Copilot](https://github.com/copilot) about how could VS Code setup crazy stuff over SSH, and learned about SSH Reverse Tunnels (`-R` flag for forwarding a local service to the remote machine), and that I could kick off ssh commands in background jobs and also have a dedicated interactive connection. That got me [ado-ssh-auth](https://github.com/scaryrawr/ado-ssh-auth), which is a series of node and bash scripts to setup a local auth service that wraps Azure CLI and talks to the `ado-auth-helper` script in the codespace using the ssh reverse tunnel.

Cool.

Then it hit me that you can write... Github CLI extensions, which... If I'm wrapping Github CLI anyways in my scripts, could I just have my script logic in a Github CLI extension...?

The answer is yes.

I ended up writing a native extension [gh-ado-codespaces](https://github.com/scaryrawr/gh-ado-codespaces) that tries to emulate the `gh codespace ssh` command, but setups the reverse tunnel internally (plus port monitoring for automatic port forwarding). It's a bit crazy, I also wrote my own version of the `ado-auth-helper` script in python, so that I could upload scripts to the codespace and run them to communicate with the locally running auth service. It does the same thing for uploading a port monitor to track ports being listened on to tunnel over SSH.

I think it's really cool they have the AzureCLICredential class to make it easy to wrap the Azure CLI login so you don't need to register apps, deal with auth, etc and just be able to write tools and scripts for yourself.