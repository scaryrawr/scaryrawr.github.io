---
layout: post
title: Linux Hyper-V Resolution
categories: [linux, hyper-v, windows]
date: 2021-08-23 20:10:12
---

Short post today.

I've been using Windows and WSL more often than a regular Linux desktop lately.

When you initially install Linux into a Hyper-V VM, you'll notice the resolution is
something low/awful.

There's some posts online saying to set the resolution by updating the GRUB command line,
but **don't do it**.

If you look at the source for [hyperv_fb.c](https://github.com/torvalds/linux/blob/master/drivers/video/fbdev/hyperv_fb.c#L32). It has this:

```powershell
Set-VMVideo -VMName Ubuntu -HorizontalResolution 1920 -VerticalResolution 1200 -ResolutionType Single
```

Run this in an Administrative PowerShell on the Windows Host.

On my Surface Book it looks like:

```powershell
Set-VMVideo -VMName Fedora -HorizontalResolution 3240 -VerticalResolution 2160 -ResolutionType Single
```

Which ends up being... scaled by default at 100%. You can go into Settings and set the
scaling to 200%, but... this won't stick between reboots. Setting it using gsettings appears
to stick (found on [askubuntu](https://askubuntu.com/a/916416/1064440)):

```sh
gsettings set org.gnome.settings-daemon.plugins.xsettings overrides "[{'Gdk/WindowScalingFactor', <2>}]"
gsettings set org.gnome.desktop.interface scaling-factor 2
```

I first put it in my `.profile`, but I believe it sticks even without putting it there (I
removed it and it appears to still be working).