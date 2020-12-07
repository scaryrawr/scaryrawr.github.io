---
layout: post
title: GNOME Focus
categories: [gnome, extensions]
date: 2020-12-07 10:44:53
---

Over this last weekend I wrote my first GNOME Extension - FOCUS!

![Focus](/assets/images/focus.gif)

Focus is an extension that applies transparency to non-focused windows. I use this with the focus mode 'mouse' `org.gnome.desktop.wm.preferences.focus-mode 'mouse'`, which is the focus follows the mouse (I don't have to click on windows to focus them). This is the way sway/i3wm do focus by default.

As well as [Pop! Shell](https://github.com/pop-os/shell) (what can I say... I really like
tiling windows).

I was using i3wm, and really liked some of the [picom](https://github.com/yshui/picom) settings for having inactive window transparency. With GNOME I used to use [devilspie2](https://www.nongnu.org/devilspie2/), but DevilsPie2 only works with X11, where I switch between X11 and Wayland. For sway I use a script called [sway_inactive](https://github.com/scaryrawr/dotfiles/blob/master/.config/sway/scripts/sway_inactive) to get this effect.

Why is it important? With GNOME, having the focus follow mouse has a noticable delay (at least on my laptop). Maybe there's a mix of issues going on that would cause that, but with having the transparency it makes it clearer which window I'm currently working in (it also helps with keyboard navigation between windows as well). Yes... Pop-Shell has a setting for an active window indicator by adding a border, but, let's face it, transparencies are cooler than borders (also, borders at times makes it feel like something went wrong).

Some *slight*... hackery. So... one thing that I want too is to have a *slight* transparency on some windows even when they're focused, specifically Code Editors. I'm not a GTK dev, so I'm not sure the best way to have a modifiable list in the preferences panel (to be honest... I'm not sure what to use for different settings in the panel lol...). Right now there's a magic config file at `~/.config/Focus/special_focus.json` it's just a JSON list of WM\_CLASS of windows that should always have some slight focus. Mine looks like this at the moment:

```JSON
[
	"Code",
	"Code - Insiders",
	"Org.gnome.Nautilus",
	"Caprine",
	"Gedit",
	"Com.github.kmwallio.thiefmd",
	"Sublime_text",
	"Mattermost"
]
```

You can find the WM\_CLASS using [Looking Glass](https://wiki.gnome.org/Projects/GnomeShell/LookingGlass) (alt+f2 -> lg). Using `xprop` apps may have multiple WM\_CLASSes where the one in Looking Glass is the correct one to use.

Feedback from my brother:
> What is this, a selector for ants?
> ![Tiny Sliders](/assets/images/focus_ants.png)

Yes... Yes, it is...