---
layout: post
title: Monorepo Tools Learnings
categories: [zsh, fish, monorepo, yarn, cargo]
date: 2025-02-25
---

Howdy!

Most of my work life is spent in monorepos. Oddly, we have multiple monorepos 🤣.

A lot of what we do is in [TypeScript](https://www.typescriptlang.org/). For monorepos we
use things like [lerna](https://lerna.js.org/) and [lage](https://microsoft.github.io/lage/).
Both these tools leverage [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

One gripe I have is lerna and lage handle running commands differently. With lage, you don't
have to specify the whole package name, I can do `lage build --to app` instead of `lage build --to @org/app`.
With Lerna (at least how we have it configured), we need to specify the whole package name.

Now... this wouldn't be as bad as you think, except we have scripts that wrap things things,
and we mix lerna and lage within the same monorepo. so we might have`yarn build app`, but some
reason, I might need to type `yarn other-thing @org/app`.

Don't ask me why it's using both lerna and lage... It exists that way, and I must live in it.

So, good news is, even with `lage`, I can specify the whole package name... to get some consistency
in life.

Why is all this important.

Well... more background... I'm a big fan of [fzf.fish](https://github.com/PatrickF1/fzf.fish).
I wrote a [zsh inspired version](https://github.com/scaryrawr/fzf.zsh). But it didn't have monorepo,
helpers for fuzzy matching. Implementing custom `yarn` completions for monorepo awareness is possible...
but complex. So I started working on a [monorepo.fish](https://github.com/scaryrawr/monorepo.fish) that's
leverages fzf.fish. I also keep the fzf.zsh up-to-date, but prefer fish (sadly, fish isn't a first class
citizen/shell in devcontainers, so I have a few fish plugins to make it work well
([nvm](https://github.com/scaryrawr/codespace-nvm.fish) and
[ADO](https://github.com/scaryrawr/artifacts-helper.fish))).

The main monorepo functionality is just... package name completion 🤣. Originally, I was looking at
implementing custom completions, but that seemed more complicated... So I ended up writing just some
keybindings that wrap `yarn info workspaces` and `cargo metadata` to populate workspace info (I don't
do rust at work, just for side projects, and I don't even know if fuzzy finding package names is
useful...).

## *Now the actual post...*

Running `yarn --json info workspaces` is oddly crazy expensive! One of the repos we work in has roughly 3,000 packages (they would tell you it has more, but it's really multiple monorepos within... a monorepo, so ~3K).

Running `time yarn --json info workspaces`, I get:

```sh
________________________________________________________
Executed in    1.28 secs    fish           external
   usr time    0.97 secs    1.01 millis    0.97 secs
   sys time    1.29 secs    0.28 millis    1.29 secs
```

Then when piping it through `jq` to do [all the processing](https://github.com/scaryrawr/monorepo.fish/blob/20a7897220c577f2a2c43ad6a46c36b9898d2585/functions/_monorepo_search_yarn_workspace.fish#L1C1-L5C4)...

```sh
________________________________________________________
Executed in    3.83 secs    fish           external
   usr time    2.03 secs  240.00 micros    2.03 secs
   sys time    0.91 secs  510.00 micros    0.91 secs
```

**Almost 4 seconds!** Every time I want to fuzzy find a package name, I refuse to wait that long every time 😱.

### Dumb Caching Ideas

So, in order to not have to wait so long, I thought it best to come up with some caching (obviously 🙄).

If you look at the repo history, there's some fun bad caching in the history. Even the current hashing
might be bad (who knows) 🤷‍♂️. I made some bad assumptions, and maybe made some worse ones 🍻.

#### PWD Modified Time

First cache, was using `stat` to get the last modified time of the current directory. It worked great...
until... you wanted to build... pull... add a file... run tests... Uh... it was bad.

Did you also know [Linux `stat`](https://www.man7.org/linux/man-pages/man1/stat.1.html) and
[BSD `stat`](https://man.freebsd.org/cgi/man.cgi?stat) ARE DIFFERENT!?!? (don't get me started on `sed` on macOS...)

![Panda smashing keyboard](/assets/panda-smash.gif)

This was just something like:

```sh
stat -f %m .
```

or

```sh
stat --format=%Y .
```

I was really excited about this idea, but then my cache invalidated too frequently.

Next dumb idea...

#### Hashing package.json modified times

Now, the next thought, still hooked on modified times (did I mention `stat` Linux vs BSD???). That we could do a hash of the modified times of individual `package.json` files. As long as we don't frequently modify package.json files this should work right?

The script was something like:

```sh
# use git ls-files since we need something fast to find package.json files
git ls-files '*package.json' | xargs stat ... | sha256sum | awk '{print $1}' # Copilot suggests I switch to `cut`...
```

I thought... hey, maybe everything should mostly be reads right? *Right???* **Right???**

**WRONG!** Some reason, some of our build/test/install scripts/commands update the modified time on `package.json` files even if the contents do not change.

So... my cache kept getting invalidated (again)...

Next...

#### Just hashing the package.json list

Oddly, this one I didn't implement, but came to mind.

Issue for this is what happens if the package name changes? My cache would not be invalidated since it's just based on the list of package.json files in the repo.

I think for the most part it would have worked, but the thought of using an invalid cache felt more misleading and harder to figure out what is going wrong for users without a way of force invalidating the cache.

#### Hash all the package.json files and hash the hashes

This is the [current solution](https://github.com/scaryrawr/monorepo.fish/blob/20a7897220c577f2a2c43ad6a46c36b9898d2585/functions/_monorepo_hash.fish#L1C1-L3C4). I hash all the package.json files, and then hash the hashes.

I honestly thought this would be slow (I actually wrote it a very slow way at first (`-n1` 🐌) 🤦‍♂️, but then saw `sha256sum` supports multiple files at once).

```sh
time git ls-files '*package.json' | xargs sha256sum | sha256sum | awk '{print $1}'

________________________________________________________
Executed in  147.51 millis    fish           external
   usr time   86.47 millis    0.00 millis   86.47 millis
   sys time  120.17 millis    1.59 millis  118.58 millis
```

### Conclusion(s)

I think this was a fun side project for some minor life improvements.

It was also eye opening what was expensive vs cheap.

Originally, I was leaning towards `rg --files` to get a quick list of `package.json` files, but then `git ls-files` was faster (and also... just built in.). I didn't think it would be so quick.

Calculating hashes of 3K files was cheap 🤣.

Modified times aren't great since files can "be modified" without content changes.

Everyone always says "measure measure measure", but I feel I tend to still make assumptions on what's worth measuring first.

I may change the hashing again in the future as I play around more and learn more.
