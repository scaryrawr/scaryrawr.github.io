---
layout: post
title: WSLg Theming
categories: [linux, spotify]
date: 2021-04-22 12:34:22
---

WSL GUI has finally arrived! The announcement can be found [here](https://devblogs.microsoft.com/commandline/the-initial-preview-of-gui-app-support-is-now-available-for-the-windows-subsystem-for-linux-2/).

One of the first things I noticed was... It's the default adwaita.

![Remmina Adwaita](/assets/images/remmina-default.png)

I personally really like dark themes, and wanted to figure out how to set my theme to Yaru-dark, but you can do this for any theme.

The hard part is most guides use [Gnome-Tweaks](https://wiki.gnome.org/Apps/Tweaks), which brings in more things than you want for WSL...

A quick search for `gsettings gnome theme` will help you find [this answer on askubuntu](https://askubuntu.com/a/262946) from makim.

Let's install some dependencies! I use [Fedora](https://fedoramagazine.org/wsl-fedora-33/) we need:

```sh
sudo dnf install dbus-x11 Yaru-theme
```

Then we can set Yaru-dark as our desired theming.

```sh
gsettings set org.gnome.desktop.interface gtk-theme 'Yaru-dark'
gsettings set org.gnome.desktop.interface icon-theme 'Yark-dark'
gsettings set org.gnome.desktop.wm.preferences theme 'Yaru-dark'
```

Now we get:

![Remmina Yaru-Dark](/assets/images/remmina-yaru-dark.png)