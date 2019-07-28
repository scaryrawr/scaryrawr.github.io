---
layout: post
title:  "Vim on Windows!"
date:   2018-07-04 08:01:56 -0700
categories: [nerd, vim]
---

Howdy! So, I'm not that good at vim, but I enjoy learning and trying it out!

Today, I'm going to go over setting up some tools for getting Vim installed as well as
do a little self-promotion of my own [install script](https://github.com/scaryrawr/vimrc)
for installing my vimrc and installing the plugins I use. You don't actually have to use
my vimrc, the big thing for me when setting up vim was when installing plugins, the initial
set up was a bit manual.

## Installing Stuff

So! How do we get started. First, I'd follow the steps to install [chocolatey](https://chocolatey.org/)
which is a package manager for Windows. If you've used a package manager on Mac or Linux, it's similar,
but not as convenient sadly. The reason it's not as convenient is that not all packages get added to
the environment `PATH` variable.

After you have chocolatey installed, here's the list of packages I install for getting my setup:

- ag - [Silver Searcher](https://geoff.greer.fm/ag/), an ack/grep like tool but faster
- [cmake](https://cmake.org/) - cross-platform build process tool
- [git](https://git-scm.com/) - version control system
- [golang](https://golang.org/) - Go Programming Language
- [jdk8](https://java.com/en/download/) - Java Programming Language
- [llvm](https://llvm.org/) - Compiler Infrastructure including Clang
- [nodejs](https://nodejs.org)
- [python2](https://www.python.org/) - Python Programming Language
- [rust-ms](https://www.rust-lang.org/en-US/) - Rust Programming Language for use with Microsoft Build Tools
- [vim](https://www.vim.org/) - Text Editor

Also, you'll have to install a version of [Visual Studio](https://visualstudio.microsoft.com/downloads/).

### npm Installs

For getting autocomplete in [typescript](https://www.typescriptlang.org/) you'll have to globally install the
typescript language:

`npm i -g typescript`

## Updating the Path

By default, a few of the things we've installed using Chocolatey won't be added to our path. We'll have to
manually add them for things to work correctly. By searching for 'environment' in start we can edit our
path variable:
![Start Search]({{ "/assets/images/vimpost/start-environment.png" | absolute_url }})

Double click on Path:
![Path]({{ "/assets/images/vimpost/path.png" | absolute_url }})

You should have an environment similar to mine:
![Environment]({{ "/assets/images/vimpost/environment.png" | absolute_url }})

Where it has "micha" you'll want to put your home folder instead.

For the Visual Studio path, you'll want to have your version of Visual Studio (Mine is "Enterprise").

You might not have [ruby](https://www.ruby-lang.org/) or [cmder](http://cmder.net/) installed, but can use
Chocolatey to install them if you want. So you might not need those in your path.

Once that's all configured, you should close and reopen any PowerShell Windows you have open (or command prompt).

## Installing the vimrc

So, you should be able to install the vimrc using my [repository](https://github.com/scaryrawr/vimrc):

```
git clone https://github.com/scaryrawr/vimrc
cd vimrc
./install.ps1 -Fonts -BuildYouCompleteMe
```

`-Fonts` and `-BuildYouCompleteMe` only need to be ran the first time you run the script since you probably
won't have the [powerline fonts](https://github.com/powerline/fonts) already installed or have built
[You Complete Me](https://github.com/Valloric/YouCompleteMe).

### What is the script actually doing?

The lastest version can always be found [here](https://github.com/scaryrawr/vimrc/blob/master/install.ps1).

First we copy over the vimrc to the correct location, as well as ignore files for ag.
{% highlight powershell %}
Copy-Item -Path vimrc  -Destination "$HOME/.vimrc"
Copy-Item -Path ignore -Destination "$HOME/.agignore"
Copy-Item -Path ignore -Destination "$HOME/.ignore"
{% endhighlight %}

Then we go through the vimrc and install or update plugins, as you can see, it assumes
that the plugins we be Plugin 'github/repo', (maybe I should update it to support other
plugin providers...)
{% highlight powershell %}
$regex = "^\s*Plugin\s+'(.+)'"

Get-Content -Path "$HOME/.vimrc" | Where-Object { $_ -match $regex } | ForEach-Object {
    $repo = ($_ | Select-String -Pattern $regex).Matches[0].Groups[1].ToString()
    $dirname = $repo.Split('/')[1]
    $destination = "$HOME/.vim/bundle/$dirname"

    # Pull updates if there or install if not there
    if (Test-Path -Path $destination) {
        Set-Location -Path $destination
        git pull
    } else {
        git clone https://github.com/$repo $destination
    }
}
{% endhighlight %}

We also check if YouCompleteMe was installed and we're flagged to build it.
{% highlight powershell %}
$ycmDir = "$HOME/.vim/bundle/YouCompleteMe"
if ($BuildYouCompleteMe -And (Test-Path -Path $ycmDir)) {
    Set-Location -Path $ycmDir

    # Error message on linux
    git submodule update --init --recursive

    python ./install.py --all
}
{% endhighlight %}

If we're flagged to install fonts we'll also install those:
{% highlight powershell %}
if ($Fonts) {
    git clone https://github.com/powerline/fonts.git --depth=1
    Set-Location -Path ./fonts
    ./install.ps1

    Set-Location -Path ..
    Remove-Item -Recurse -Force fonts
}
{% endhighlight %}

## Finished Setup

![Vim with YCM and Powerline Fonts]({{ "/assets/images/vimpost/example.png" | absolute_url }})

So here you can see the status bar at the bottom which is [vim-airline](https://github.com/vim-airline/vim-airline)
the arrows don't display correctly unless you're using a Powerline font.

You can also see a suggested completion from You Complete Me.

Also, on the left is [Nerdtree](https://github.com/scrooloose/nerdtree).

### Running on Linux

So the PowerShell script will also run on Linux if you install it, but you'll have to make sure to install all the
dependencies there as well using your package manager of choice.

![Running under WSL]({{ "/assets/images/vimpost/wsl.png" | absolute_url }})

Thanks for reading!
