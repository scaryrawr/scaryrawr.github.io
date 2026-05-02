---
layout: post
title: "State of Local Agents"
categories: [ai, local-llm, ollama, coding, vibe]
date: 2026-05-01
---

In my post [Next Level Copilot - Part 1]({% post_url 2025-12-26-next-level-copilot-pt1 %}), I gave "next level tips" for taking advantage of the "Premium Request" features.

Turns out... not only were subagents a problem 🤣, but newer models tend to utilize more tokens to be able to do a job "well." So a lot of folks have probably heard that [Copilot is moving to usage based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) and [Anthropic is experimenting with pricing](https://x.com/TheAmolAvasare/status/2046724659039932830?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E2046724659039932830%7Ctwgr%5E1b2bd824bfca21d3eaabf1cb3c14e35f1ce5df68%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Fwww.msn.com%2Fen-us%2Fnews%2Ftechnology%2Fanthropic-cut-claude-code-from-new-pro-subscriptions-calling-it-an-ab-test%2Far-AA21tuZ8). OpenAI is keeping their prices the same, but personally, I feel they're just so far in the negative that the sign bit flips.

I also mentioned in my last post I get GitHub Copilot through work 👀, so I currently don't have to worry about the pricing changes or usage based billing (I'm unlimited baby).

![the limit does not exist](/assets/images/limit-does-not-exist.gif)

Even with unlimited requests though, I find local models fascinating. I bought an 128GB RAM M4 Max last summer to be able to experiment and play around more with local models.

I don't think buying a decked out Apple device will solve your inference issues (for most people), but I think you'd be more impressed with them than you'd expect (if you have enough VRAM...).

## Back in the day

I say back in the day, but it's literally until a couple month ago, local LLMs were pretty slow. Their capabilities all over the place (still are). But, for the longest time, local LLMs just could
not run fast enough in an agentic harness (claude code, opencode, github copilot, etc...). They still are pretty slow in those harnesses 🤣.

Finding a local model that could respond fast enough before raycast AI timed out tool calls heavily limited you to what models you could use with it.
[gpt-oss 20b](https://huggingface.co/openai/gpt-oss-20b) was pretty much the only reasonable thing to run... and it's old, it lacks vision. I like
throwing screenshots at my agent.

If you follow the local model socials, you'll see people swear by gpt-oss 20b and [120b](https://huggingface.co/openai/gpt-oss-120b), as well as [qwen3-coder](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct), [glm 4.5 air](https://huggingface.co/zai-org/GLM-4.5-Air), [glm-4.7-flash](https://huggingface.co/zai-org/GLM-4.7-Flash), etc... (I'm mostly focused what fits on my MacBook)

I think so far everything I've tried in an agentic harness had been painfully slow.

![]
