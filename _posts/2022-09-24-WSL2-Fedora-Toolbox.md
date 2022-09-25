---
layout: post
title: WSL2 Fedora toolbox Setup
categories: [linux, wsl2, windows]
date: 2022-09-24 18:51:33
---

## Get WSL Version ^0.67.6

Just this week [systemd support](https://devblogs.microsoft.com/commandline/systemd-support-is-now-available-in-wsl/) was announced in WSL2! For me, I didn't automagically get the update in Windows Store and had to manually install it from [WSL Releases (version 0.67.6 or greater)](https://github.com/microsoft/WSL/releases).

I don't think you actually need systemd for podman support 🤣, but the release just made me feel like trying it again.

## Enable Systemd

Update `/etc/wsl.conf` to contain:

```ini
[boot]
systemd=true
```

## Fix User Runtime Directory

[Arkane Systems - Bottle Imp](https://github.com/arkane-systems/bottle-imp) helps fix this and provide additional tooling for keeping WSL alive. Right now, I only use the [systemd user-runtime-dir override](https://github.com/arkane-systems/bottle-imp/tree/master/othersrc/usr-lib/systemd/system/user-runtime-dir%40.service.d) and the [scripts it relies on](https://github.com/arkane-systems/bottle-imp/tree/master/othersrc/scripts).

## Reinstall shadow-utils on Fedora

Found this out from [Using podman on windows subsystem for linux](https://dev.to/bowmanjd/using-podman-on-windows-subsystem-for-linux-wsl-58ji) to reinstall shadow-utils:

```sh
sudo dnf reinstall shadow-utils
```

## Install toolbox and configure podman

Install toolbox and runc:

```sh
sudo dnf install -y toolbox runc
```

This will also install podman (at least on Fedora).

By default, if you try to enter a toolbox you'll run into some issues, digging into the messages, I found [this issue](https://github.com/containers/podman/issues/13817). Where it [mentioned trying `runc`](https://github.com/containers/podman/issues/13817#issuecomment-1095135910), which worked for me.

Copy the default config and update ot to use runc:

```sh
cp /usr/share/containers/containers.conf ~/.config/containers/containers.conf
```

Open the config file with your favorite text editor and update the runtime to runc (uncomment the line if it commented out by default):

```ini
runtime = "runc"
```

## Restart WSL

Restart WSL (from Windows):

```powershell
wsl --shutdown
```

## Try entering a toolbox

```sh
toolbox enter
```

This should hopefully work now!

## Why toolbox?

The fedora docs explain why nicely [here](https://docs.fedoraproject.org/en-US/fedora-silverblue/toolbox/#toolbox-why-use). Even if you don't use Fedora Silverblue, it's just nice to be able to spin up a temporary environment with dependencies you don't plan to keep around (and might forget to remove later).