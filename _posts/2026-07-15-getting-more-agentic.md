---
layout: post
title: Getting more agentic
categories: [ai, agents, copilot, openclaw, hermes, loop, orchestration]
date: 2026-07-15
---

I'm calling this post "getting more agentic." As I see a lot of questions on loop engineering, orchestration, etc...

Honestly, I tend to live a very simple "agentic life." I'm the type that tends to just prompt their agents to do things.

A big pain point for a lot of agent automation is you need a "server" somewhere.

You see this with how folks run [OpenClaw](https://openclaw.ai) or [hermes agent](https://hermes-agent.nousresearch.com).

A lot of my work happens in [GitHub Codespaces](https://github.com/features/codespaces), which doesn't really support running automations in it easily.

At work, an _alternative_ we can setup are cloud VMs. This is where my work "Claw" lives (we get an internal version of [Microsoft Scout](https://www.microsoft.com/en-us/microsoft-365/blog/2026/06/02/introducing-microsoft-scout-your-always-on-personal-agent/?msockid=0b99ebcc8a4f6f5e1405fcdd8bbd6e86). At home, it's not as easy for me to setup 😅, but I'm trying out hermes on my gaming rig.

Now, you don't _need_ an always up and running machine, but the real power comes from having it up 24/7 (I have automations run on my laptop, and when I open it up, it'll run the automations that had their timers fire while it was off/closed).

Having a machine up 24/7 is where you see people brag about messaging their agent any time from anywhere. It also enables loops/automations running 24/7.

## Basic "Loop" Engineering

`/every 5m run this prompt` (`/loop` in codex/claude)

This enables you to run things on schedule (oh wow, a loop?), you can also get fancy with setting up services that can run prompts/agents (this is how integration works for agents that act as bots or respond to messaging apps), you just wrap your agent in a service that implements the bot chat protocol. This could be calling the `copilot --resume="thread-id" -p "$MESSAGE"`, or being a little more fancy using an agent SDK like [copilot-sdk](https://github.com/github/copilot-sdk).

Oddly, a lot of this falls under "loop engineering." Which is a trendy new topic. Oddly, it's existed long before it was trendy. The thing that made it trendy is it is now built into tools versus folks having to manually script/build it themselves.

[Ralph Loop](https://ghuntley.com/loop/) is one of the more popular loops that is a bit more manual for folks in the beginning, and the simple way of running loops is pretty much what apps do today:

```bash
# Execute a prompt every 5 minutes
while true; do
  copilot -p "Do the thing"
  sleep 300
done
```

Now, you don't need it to literally be a bash script 🤣, but, the idea is you can just have a config of prompts you want periodically ran (this is why a lot of folks mention we've been re-inventing [cron jobs](https://en.wikipedia.org/wiki/Cron)).

Combining these scheduled prompts with state (whether it's a DB, files on disk, etc...), all of a sudden you can have loops that can check their "memory" and introduce orchestration between loops.

This is one of the basics of a ralph loop where it starts with a fresh context every loop, but picks up on where it left off and keeps working using some form of "state" (you may remember folks getting really into PRDs and arguing how to track work with JSON or markdown files).

For other loops though, it can be anything. For instance, I have a loop at work that goes through my work items, and tries to investigate the item, updates the description, and then marks it as actionable or needing more user input.

There's another loop I have that picks up actionable work items and carries them out and makes a PR.

The joy of using scripts, is you can have pre-checks to see if you even need to run an agent. Current agents run prompts, which may run scripts, and then they process the script outputs and things. It wastes tokens.

A script, can query, filter, determine there's nothing to do, all without spending tokens and avoid spinning up an agent.

The benefit of something like OpenClaw, Hermes, [GitHub Copilot App](https://github.com/features/ai/github-app), are they have a service running in the background (or as part of their foreground app) that'll keep your loops/automations running on schedule, in the CLI tool, they tend to expect the loop to have a "stopping point" and/or a time limit of say 4 hours. It's really like "I expect someone to sign off on my PR eventually..." where an app automation is like "Yeah, this happens a few times a day... forever."

## Orchestration

`/autopilot implement this thing and make sure it works` (`/goal` in codex/claude)

Orchestration is another form of "loop engineering." Or at least, that's how people put it. This can get very complex depending on the implementer. Back in the day (I have a [post on cheating the preimum request system]({% post_url 2025-12-26-next-level-copilot-pt1 %}), where you can get something similar by having the main chat drive subagents. Other folks I know have used hooks, some use a script/service that wrap copilot/claude CLI or their corresponding SDKs.

The basics are:

**Loop:**

1. There's a place to pick up work from.
2. Agent picks up work and does it.
3. Another agent or phase reviews work.
4. Work gets re-queued if there's feedback, otherwise it gets completed.

You just add phases in a pipeline where items can go back into the loop or make it all the way through. Either you're doing this somewhat manually, or you have agents determine and do it on their own, or a mix.

You can also introduce forks and various paths (you might not realize you have them at first, but as you introduce state, you'll see that items get "routed" whether intentional or not).

People will argue what orchestration is, how it should be implemented, etc...

But really, coordinating work beyond basic prompts (or leveraging "builtin loops" in your harness), all kind of count in odd ways.

## Talking to the Agent

A cool one people might not realize, is you don't have to figure out the automations yourself.

I tend to talk to my agent and ask it to make automations and skills for those automations. Skills are extremely useful for automations that have state shared between automations and also across harnesses (I have Scout queue items for Copilot App to take on 🤣, there's a shared skill + scripts so they keep the same schema and have understanding on how to communicate through a shared state).

Copilot App has a built in "chat" that's not tied to a specific repo/project and can create/modify automations, skills, and trigger sessions across projects/repos.

So really, talk to your agent/harness, and get it to help setup your automations.

Most of these apps are being designed to trigger a skill to be more self-aware on how to configure themselves.

## Thoughts

It's interesting to me, that something like `/autopilot`, `/goal`, `/loop`, and `/every` can be considered loop engineering and orchestration. But then building automations that take it to a higher level, are also considered loop engineering and orchestration.

I think this is also where the debate of what is "loop engineering" also comes into play and gets people more confused.

People argue that you're doing it wrong, but who cares?

The main point of these are not necessarily "what counts as loop engineering?" But really... Agents are getting more capable and can take on "long horizon tasks." They can work for hours and days. To get this before, required building wrappers and manual tools around a CLI harness/SDK. LLMs sucked at long context before (arguably still do, but less noticeable). Now, of these are built into the desktop apps by default (which pretty much just wrap their CLI apps the way the people of the past did).

The whole loop engineering craze is about pushing automation further and further. It doesn't matter if the way you do it looks identical to the way others did it. It's going to change next week anyways.

The hype is real, but also overhyped 🤣 (companies are trying to keep the AI bubble pumping).

I feel this tech is both so overrated and underrated at the same time.

You can build the funniest and craziest things.

Stop asking for permission and just do it, your imagination isn't limited to just following others and trends.

These things are so much more capable and can be integrated in so many different ways than we give them credit for.

Find those triggers, find those events, chain them together.

That's how we've always built software. None of this is new, it just feels like it is.
