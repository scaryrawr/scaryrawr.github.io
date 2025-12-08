---
layout: post
title: Monorepo Tools Learnings Pt. 2
categories: [zsh, fish, monorepo, yarn, cargo]
date: 2025-12-08
---

This is an further learnings from trying to improve on things from my previous post [Monorepo Tools Learnings]({% post_url 2025-02-25-monorepo-tools %}).

In the previous post, I was trying to improve `yarn workspaces info` by caching results. `yarn workspaces info | jq` ended up taking roughly ~4 seconds in a very large monorepo.

The previous post was focused on how to calculate a hash of the workspace efficiently... which... ended up being the wrong problem to solve.

Lately, I've been finding the cache invalidates almost every git pull (it's a very active repo). And! Storing in `/tmp` ended up having times where the cache disappeared. I was thinking of improving caching by not hashing the files them selves, but maybe... the list of package names... or who knows... Also... should I store the cache somewhere more persistent?

As I dug into speeding up a more stable cache... It hit me. Do I even need the accuracy of `yarn workspaces info`? (oh wow... just found out `yarn workspaces list --json` is a thing... thank you copilot completions... besides the point... maybe we need a Pt. 3 post... ok... not a part of yarn classic...).

Back to the post.

I realized... I don't really care about the full accuracy for my monorepo tools, I just want completions/fzf for package names in a reasonable time with a file preview. I was already using `git grep` to glob all the package paths for hashing. So I started thinking about timing different options (can I just run it... with no cache?). We really need just a package name and path.

[ripgrep](https://github.com/BurntSushi/ripgrep):

```sh
> time rg --files --glob 'package.json' | xargs jq -r '.name + ":" + input_filename'

________________________________________________________
Executed in  444.34 millis    fish           external
   usr time    1.53 secs      0.63 millis    1.53 secs
   sys time    2.04 secs      1.65 millis    2.04 secs
```

[fd](https://github.com/sharkdp/fd) with `-x`:

```sh
> time fd -H -g package.json -X jq -r '.name + ":" + input_filename'

________________________________________________________
Executed in  604.45 millis    fish           external
   usr time    4.60 secs    126.00 micros    4.60 secs
   sys time    5.95 secs    671.00 micros    5.95 secs
```

fd into xargs:

```sh
> time fd -H -g package.json | xargs jq -r '.name + ":" + input_filename'

________________________________________________________
Executed in  553.63 millis    fish           external
   usr time    4.61 secs      0.06 millis    4.61 secs
   sys time    5.87 secs      2.01 millis    5.86 secs
```

What if we try increasing accuracy with ripgrep:

```sh
> time jq -r '.workspaces // .workspaces.packages | .[][]' package.json | xargs -I {} rg --files --iglob '{}/package.json'| xargs jq -r '.name + ":" + input_filename'

________________________________________________________
Executed in  807.60 millis    fish           external
   usr time    3.22 secs      0.00 millis    3.22 secs
   sys time    4.18 secs      2.86 millis    4.17 secs
```

with fd (still not accurate, cannot figure out how to get the workspace glob to play nicely with fd oddly...):

```sh
>  time jq -r '.workspaces // .workspaces.packages | .[][] | sub("\\\\*$"; "")' package.json | xargs -I {} fd -H -g package.json '{}'

________________________________________________________
Executed in  700.08 millis    fish           external
   usr time    6.90 secs    712.00 micros    6.90 secs
   sys time    9.70 secs    709.00 micros    9.70 secs
```

The monorepo I'm testing on has ~3,500 packages.

It's just interesting, how we can get much faster results where we can avoid trying to cache and also... avoid querying with `yarn workspaces` 🤣. Node's startup time probably plays a big role in just spinning up yarn.

By avoiding using the `yarn workspaces info` we can get to ~500ms where previously we were around ~4 seconds, this is something we can run on demand-ish (one-off, not in a loop) and still feel responsive enough. If we need re-use, we definitely want to cache and reuse results.

You might also wonder why we're not using `git grep` in any of these timings... `git grep` is really fast for indexed files, but once we start hitting non-indexed files, it starts to slow down. Also, oddly, the `ls-files` doesn't support non-indexed files (which... maybe it's good enough, but who knows). I also tend to spin up new codebases where git isn't setup yet, so it avoiding git allows setting up completions/fzf without a dependency on having a repo setup.
