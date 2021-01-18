---
layout: post
title: Manjaro PipeWire
categories: [linux, pipewire, manjaro, sway]
date: 2021-01-01 11:15:53
---

# Screen Sharing in sway

I kept seeing things for folks getting sway+pipewire+chromium-ozone, etc for screen
sharing to work.

When trying this on Fedora you kind of hit some blocks since packages aren't updated to support pipewire-pulse(audio) as an alternative (there's some [workarounds](https://gitlab.freedesktop.org/pipewire/pipewire/snippets/1165), but I personally ran into issues).

**EDIT (Jan 18th):** It's been a while since it happened, but Fedora has updated it's packages and now supports easily switching to PipeWire. As such... I'm back on Fedora.

So I decided to bite the bullet and try out Manjaro. (warning, I also use fish).

A big caveat here... is that I jump between GNOME Wayland, GNOME Xorg, i3wm, and sway. I feel a lot of the guides and content just expect you to be sticking to just one (I really like tiling managers... I for some reason want to run wayland lol, sway isn't fully there yet...).

I started out looking at [soyuka.me - Make screen sharing on wayland (sway) work!](https://soyuka.me/make-screen-sharing-wayland-sway-work/), but ran into additional issues... and it doesn't have the "how to get this working automatically" (or I may have skimmed and missed it...).

## PipeWire

First! Add yourself to audio (possibly you need to add yourself to video, I had to for backlight control (laptop)). PipeWire runs as a user service, so if you're not in the audio group it'll fail.

```fish
sudo usermod -aG video (whoami)
sudo usermod -aG audio (whoami)
```

Next, install pipewire stuff (I'm not sure if you should actually remove pulse stuff first...).

```fish
pacman -S pipewire-alsa pipewire-jack pipewire-jack-dropin pipewire-pulse
```

Remove pulseaudio which is now in conflict with pipewire-pulse.

```fish
pacman -Rs pulseaudio-zeroconf pulseaudio-bluetooth pulseaudio-equalizer manjaro-pulse
```

Enable pipewire-pulse and pipewire

```fish
systemctl --user enable pipewire-pulse
systemctl --user enable pipewire
```

Reboot, and check if you're using pipewire `pactl info`. You should see something like:

> Server Name: PulseAudio (on PipeWire 0.3.18)

## xdg-desktop-portal-wlr

I think the most annoying thing that folks don't tell you is how to set up `XDG_CURRENT_DESKTOP=sway`. You'd think it's something so simple (which is why no one provides guidance on how to do it lol). Maybe it's also because folks don't use GDM or other logins and just have custom launch scripts? There's also some guidance on the [xdg-desktop-portal-wlr wiki](https://github.com/emersion/xdg-desktop-portal-wlr/wiki/systemd-user-services,-pam,-and-environment-variables).

We're going to set up an environment.d config to do this.

```fish
mkdir -p ~/.config/environment.d && cd ~/.config/environment.d
echo 'XDG_CURRENT_DESKTOP="${XDG_CURRENT_DESKTOP:-sway}"' >> sway.conf
```

What this does is it says "Set the environment variable XDG_CURRENT_DESKTOP to 'sway' unless it's already set to something else." This enables us to use i3wm, GNOME, etc since they'll set XDG_CURRENT_DESKTOP and we'll just inherit their value.

It's also good to add `MOZ_ENABLE_WAYLAND=1` to the `~/.config/environment.d/sway.conf` so that firefox will launch using wayland. It's OK to just set this to 1, since it doesn't appear to cause issues on Xorg.

For chromium based browsers: `chrome://flags/#enable-webrtc-pipewire-capturer`.

Then we can simply install xdg-desktop-portal-wlr:

```fish
pacman -S xdg-desktop-portal-wlr
```

When you launch sway, it should now pick up on the XDG_CURRENT_DESKTOP and launch xdg-desktop-portal-wlr.

## Issues something missing?

Feel free to start a [discussion](https://github.com/scaryrawr/scaryrawr.github.io/discussions) or log an [issue](https://github.com/scaryrawr/scaryrawr.github.io/issues).
