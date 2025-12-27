---
layout: post
title: Next Level Copilot - Part 1
categories: [copilot, cli]
date: 2025-12-26
---

I work at Microsoft, where we get access to [GitHub Copilot](https://github.com/features/copilot) through work (which is sweet!). I've been using Copilot like a scrub, but somehow ended up being the "SME" (subject matter expert) on my team for just... randomly experimenting with it (I originally hated Copilot and similar things, but started trying to do "everything" using LLMs, which really changed my viewpoint, especially with more recently models). This post is my own opinion and views, it is not endorsed by Microsoft or GitHub.

> Smee, Smee, what about Smee?

— Mr. Smee, [Hook](https://en.wikipedia.org/wiki/Hook_(film))

If you don't know, the [November release](https://code.visualstudio.com/updates/v1_107) of Copilot (both CLI and VS Code), really narrowed the gap (there's still a gap) between Copilot and [Claude Code](https://claude.com/product/claude-code). Two major things to note:

- [Custom Subagents](https://code.visualstudio.com/updates/v1_107#_run-agents-as-subagents-experimental) (subagents apparently have been a thing since the [September release](https://code.visualstudio.com/updates/v1_105#_isolated-subagents)) - `chat.customAgentInSubagent.enabled`
- [Skills](https://code.visualstudio.com/updates/v1_107#_reuse-your-claude-skills-experimental) - `chat.useClaudeSkills`

There's a lot of other important things to experiment with too ([automagic worktrees](https://code.visualstudio.com/updates/v1_107#_isolate-background-agents-with-git-worktrees)??? multiple simultaneous chats???), but to me, the two listed have been the main focus to play with.

Oh... Also, make sure to increase your turn limit to something insane, mine is a [DBZ](https://en.wikipedia.org/wiki/Dragon_Ball_Z) meme `"chat.agent.maxRequests": 9001`:

![Vegeta over 9000](/assets/over-9000.gif)

With a smaller turn limit, the easiest way to see it is that an agent can call tools say like 15 times before being stopped. With a ridiculously high turn limit, if the agent thinks it needs to call 9000 tools, it'll get to do so on a single prompt.

## Custom Subagents

Custom Subagents are the rebrand of custom chat modes. Custom modes were a way to setup custom system prompts with specific tool sets. Personally, [Beast Mode](https://burkeholland.github.io/posts/beast-mode-3-1/) was the main reason to configure custom modes 🤣, but once Beast Mode was integrated upstream, I didn't see a big reason for custom modes (until now).

With custom subagents, that changes. But let's slow down. Why _should_ you care about subagents?

Well...

1. "Extending" your main chat context window.
2. Abusing the premium request system.
3. Having "more actors" in a "play"/request.

**"Extending" your main chat context window** - Chat context is limited to 128K tokens at this time. With subagents, [each subagent gets their own context window](https://code.visualstudio.com/docs/copilot/chat/chat-sessions#_contextisolated-subagents) (I think 128K tokens each... I wonder if it supports summarization...), and they only "report" their summary back to the main chat (so the cost to main chat is the prompt + summary + tool call overhead).

**Abusing the premium request system** - [Each chat you submit](https://docs.github.com/en/copilot/concepts/billing/copilot-requests#premium-features) to a premium model counts as a premium request (sometimes with a multiplier (I ❤️ [Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5))), [subagents do/should not consume premium requests](https://github.com/microsoft/vscode/issues/276305#issue-3603874658) (for now... I feel this will change...). A chat request can run any number of subagents (this is magical).

**Having "more actors" in a "play"/request** - Think of what phases you do in a job, for coding, you have a planning phase, design review, implementation, code review, testing, etc... Each of these can be a custom agent. Who do you need on your team? What types of tasks are you trying to get done? What types of problems are you trying to debug? Each "actor" on your team can/should be a custom subagent.

Putting these things together, your chat requests are no longer asking Copilot to do things directly (maybe write a custom agent mode for this so it tries to always do things through subagents), but it should be an orchestrator of subagents. That means, you don't just say "Use a subagent to investigate XYZ and then do ABC" but can try to get it to do as much work as possible in a single chat request using subagents:

> Use a planning subagent to create a plan for {{requirements}}, then run the plan by the design review subagent, until the design review subagent signs off iterate between the two subagents. Then use a coding subagent to implement the plan and have them iterate with a code review subagent until the code review agent signs off.

This is funny, but it turns main chat into a subagent agent loop. The goal is that a subagent does work, another subagent reviews the work, then we enter a loop until the reviewer signs off, but here we don't have just one loop, we have a planning loop, followed by an implementation loop. The _hope_, is that main chat uses hardly any context and is just an orchestrator, and if it needs additional prompting, there's still "room" in the main context window for doing so since all the heavy lifting is done by subagents. I feel this style of "[vibe coding](https://x.com/karpathy/status/1886192184808149383)" can help work on larger changes/refactors, but still is running on luck. Each subagent uses up its own context for each subtask, sure the handoff between them won't be perfect, but it really increases the power of a single chat request (it also leans a bit more into artifacts so that subagents can leverage the planning/design document). You can also get away with being a bit more vague at times, since you can start off with a planning subagent who investigates "what the heck is the user even asking for?" without eating main chat's context to figure out what you meant.

> But you had something they didn't, something no one saw but me. Can you guess? Luck.

— Cortana, [Halo 3](https://en.wikipedia.org/wiki/Halo_3)

Other things to note, are that you can configure MCP servers for custom agent modes. I like having a "Performance Agent" ([claude code version](https://github.com/scaryrawr/scaryrawr-plugins/blob/main/external_plugins/chrome-devtools/agents/performance.md)) with [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp/) configured, so I can be like:

> Use a performance subagent to analyze https://localhost:3000 and make suggestions to improve performance, then use a coding subagent to implement the suggestions and have them iterate with a code review subagent until the code review agent signs off. Then have the performance subagent profile it again to get a report on the actual impact of the changes.

Oddly, I think if you use Claude Code, you don't need/want to abuse chats like this (maybe?). GitHub Copilot has a by chat request pricing model vs by token pricing model. That said, subagents are still really important to leverage Claude Code to help manage context as well as parallel subagents for speeding up work/investigations.

Very random note, for Copilot CLI, you need to define a "custom agent agent", otherwise, it won't be able to make a general purpose subagent to make code changes and things. Once you have custom agents defined in copilot CLI, it can only create defined subagents. This _should_ change, since I think it's more of a bug and not intended behavior (I do not work on/with the copilot team though, just how I feel about the behavior).

## Skills

[Agent Skills](https://agentskills.io/home) at first seemed really odd to me. But I think a lot of examples are overly complex. Skills are "lazy loaded" instructions for when something comes up. They can be really detailed instructions. Or even something simple to just highlight "Hey, we have a CLI tool for that.":

```md
---
name: github-cli
description: Use the GitHub CLI tool to interact with GitHub links, repositories, issues, pull requests, and more.
---

The GitHub CLI tool `gh` is installed and available for use. The manual is available at https://cli.github.com/manual/ .
```

This isn't a skill I actually use 🤣 (probably a "bad example" since the description and skill itself are about the same length), but like... if you find that your LLM isn't utilizing the GitHub CLI when you expect it to, something like this will trigger when "GitHub" comes up and cause it to try to leverage the GitHub CLI.

A skill I do use at work is an [azure-cli](https://github.com/scaryrawr/scaryrawr-plugins/blob/main/plugins/azure-devops/skills/azure-cli/SKILL.md) skill. It's mostly generated using copilot, but has some special instructions based on a [stackoverflow answer](https://stackoverflow.com/a/78042219) for getting pull request threads. This enables me to have Copilot/Claude Code lazy load the skill whenever I want to interact with Azure DevOps work items and PRs. Where by default, it would have no idea how to pull comment threads from PRs in Azure DevOps. The skill in its current form can probably be broken into multiple skills, but it's kind of an experiment and see what gets the results you expect (which, is that if I chat with it naturally, it does the thing I expected).

But back to why skills. 

1. Skills save on context (MCP/Tools eat a ton of context). 
2. Skills create "expected behavior" for things where the LLM wasn't doing what you wanted.

**Skills save on context (MCP/Tools eat a ton of context).** The thing that ends up injected in the system prompt is the name + description + file path to lazy load the skill when triggered. Skills can also contain scripts and references (though my personal use cases haven't needed those parts of skills yet). Skills also lean into the model's training data. If the skill is about well known tools/APIs, the model doesn't actually need too much in the `SKILL.md` to explain how to use the tool/API. If it is not well known/documented, then including more details and explicit examples can improve its usage.
 
**Skills create "expected behavior" for things where the LLM wasn't doing what you wanted.** For Azure DevOps PRs, pasting a link to a PR and asking questions, just caused the agent to use the webfetch tool to try scraping the URL. This would never work (needs auth). But with the skill, it can derive from context that I am interacting with Azure DevOps and it has the Azure CLI, and has some instructions on how to interact with PRs. This makes it natural to just say "Make changes to address the comments on the PR https://dev.azure.com/..." and have it do the right thing. I get to type more naturally, and it just works. They can also be a lot more explicit instructions on how to perform specific interactions/tasks.

Since skills are loaded dynamically based on context, you can get very creative on with "when this skill should be used" in the description. It's good to experiment to try... skills might not be just for upfront before/while doing something, but the context could be "after something" as well. You get to setup the context trigger for lazy loaded instructions (it does not guarantee all models will correctly detect the trigger condition, but experiment and have fun!).

I feel the skill stuff is really short compared to subagents 🤣, but I'm also still just getting started in my experiments with it.

## Other Thoughts...

I think it's kind of insane how simple some of these concepts are 🤔, but also how crazy powerful it is. Look at [how to integrate skills](https://agentskills.io/integrate-skills#injecting-into-context), it's literally just telling the agent "You have skills, name, description, path in XML format". And it'll read it automatically 🤯? Subagents... pretty much just launching a separate chat and then pulling the final message from it (maybe...?).

Mentioning skills save on context compared to MCP/tools can cause folks to think "Oh, use skills instead of MCP," but it's not that simple. There are some MCP servers that probably would be best to just replace with a skill if you can, but this doesn't work for all tools/chat apps. Also, MCP servers can kind of enforce a bit more control compared to "Use this full fledge CLI tool." That said, there's also examples of agents using shell to try getting around tool restrictions 🤣, so who knows really. You really need to just find what works in your flow. We all prompt LLMs differently, the skills I write work great for me, but for others it doesn't work. Who knows what they even said in attempt to trigger it 😠?

## Conclusion?

But yeah... uh... a conclusion...

Subagents are a great way to "extend" the context limit of the chat and get multiple "actors" working as a "team".

Skills are a way to make agents act more as you expect for specific interactions by having lazy loaded context aware instructions.

Don't sleep on subagents and skills.

Claude Opus 4.5 is bomb.
