---
layout: post
title: "State of Local Agents"
categories: [ai, local-llm, ollama, coding, vibe]
date: 2026-05-01
---

In my post [Next Level Copilot - Part 1]({% post_url 2025-12-26-next-level-copilot-pt1 %}), I gave "next level tips" for taking advantage of the "Premium Request" features.

Turns out... not only were subagents a problem 🤣, but newer models tend to utilize more tokens to be able to do a job "well" and can run longer running tasks on a single prompt, and utilize thinking/reasoning tokens a ton... So a lot of folks have probably heard that [Copilot is moving to usage based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) and [Anthropic is experimenting with pricing](https://x.com/TheAmolAvasare/status/2046724659039932830?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E2046724659039932830%7Ctwgr%5E1b2bd824bfca21d3eaabf1cb3c14e35f1ce5df68%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Fwww.msn.com%2Fen-us%2Fnews%2Ftechnology%2Fanthropic-cut-claude-code-from-new-pro-subscriptions-calling-it-an-ab-test%2Far-AA21tuZ8). OpenAI is keeping their prices the same, but personally, I feel they're just trying to go so far in the negative that the sign bit flips (infinite money glitch).

I also mentioned in my last post I get GitHub Copilot through work 👀, so I currently don't have to worry about the pricing changes or usage based billing (I'm unlimited baby).

![the limit does not exist](/assets/images/limit-does-not-exist.gif)

Even with unlimited requests though, I find local models fascinating. I bought an 128GB RAM M4 Max last summer to be able to experiment and play around more with local models.

I don't think buying a decked out Apple device will solve your inference issues (for most people), but I think you'd be more impressed with them than you'd expect (if you have enough VRAM...).

## Back in the day

I say back in the day, but it's literally until a couple month ago, local LLMs were pretty slow. Their capabilities all over the place (still are). But, for the longest time, local LLMs just could not run fast enough in an agentic harness (claude code, opencode, github copilot, etc...). They still are pretty slow in those harnesses 🤣.

Finding a local model that could respond fast enough before raycast AI timed out
tool calls heavily limited you to what models you could use with it.
[gpt-oss 20b](https://huggingface.co/openai/gpt-oss-20b) was pretty much the only reasonable thing to run... and it's old, it lacks vision. I like
throwing screenshots at my agent.

If you follow the local model socials, you'll see people swear by gpt-oss 20b and [120b](https://huggingface.co/openai/gpt-oss-120b), as well as [qwen3-coder](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct), [glm 4.5 air](https://huggingface.co/zai-org/GLM-4.5-Air), [glm-4.7-flash](https://huggingface.co/zai-org/GLM-4.7-Flash), etc... (I'm mostly focused on what fits on my MacBook)

Also thought that bigger must be better.

I think so far everything I've tried in an agentic harness had been painfully slow.

![slow matrix snail](/assets/images/pixar-snail-matrix-v3.png)

> (I'm just playing with [x/z-image-turbo in ollama](https://ollama.com/blog/image-generation) and [qwen3.6-35b](https://huggingface.co/Qwen/Qwen3.6-35B-A3B) iterating on an image prompt)

## A few weeks ago

Copilot CLI [announced local models support](https://github.blog/changelog/2026-04-07-copilot-cli-now-supports-byok-and-local-models/). I was super excited. I made my first PR into ollama adding [`ollama launch copilot`](https://github.com/ollama/ollama/commit/7d271e6dc9fb114d48b91a1ed2ed3d414178a883). You might not know this, but I have a huge love/hate relationship with ollama. Ollama did some customization on top of models/chat templates/stuff... that originally made it struggle with tool calling (it appears to be fixed now), but for a while made it painful to use in agentic loops (but for some reason VS Code had built in support for it).

So! I started playing more and more with `ollama launch copilot` and qwen3.6 35b and [27b](https://huggingface.co/Qwen/Qwen3.6-27B) got released. I don't know if you've heard, but [qwen3.5 27b](https://huggingface.co/Qwen/Qwen3.5-27b) was praised as the like "opus-tier" local model, and qwen3.6 35b (a3b (3 billion active parameters)), benchmarked roughly as well as 3.5 27b and even better in some areas. I try not to over read into bench marks, but a MoE scoring as well as a dense model that is heavily praised I feel deserves a serious look.

Dense models tend to run crazy slow, where MoE models "take a hit" in capabilities compared to dense models for immense speed gains.

In a 1-on-1 chat, you might not notice the issue too much, but in an agentic loop, you'll really feel the difference if you're trying to work with an agent in real time.

Another big thing that's had many crazy updates is [mlx](https://github.com/ml-explore/mlx-lm) and [mlx-vlm](https://github.com/Blaizzy/mlx-vlm).

Ollama's nvfp4 and mxfp8 lose the vision capabilities, but ran really fast (it has MLX support). It sounds like vision support is in the works, so it'll be exciting to see.

I decided to grab the [mxfp4](https://huggingface.co/mlx-community/Qwen3.6-35B-A3B-mxfp4) and [mxfp8](https://huggingface.co/mlx-community/Qwen3.6-35B-A3B-mxfp8) versions of 35b and [27b](https://huggingface.co/mlx-community/Qwen3.6-27B-mxfp4).

I had to have copilot "tweak/hack" [lmstudio's mlx-engine](https://github.com/lmstudio-ai/mlx-engine) to update it to support qwen3.6 mlx versions. And then configured the recommended settings from [unsloth's guides](https://unsloth.ai/docs/models/qwen3.6#thinking-mode):

| Setting            |   General tasks | Precise coding tasks |
| ------------------ | --------------: | -------------------: |
| temperature        |             1.0 |                  0.6 |
| top_p              |            0.95 |                 0.95 |
| top_k              |              20 |                   20 |
| min_p              |             0.0 |                  0.0 |
| presence_penalty   |             1.5 |                  0.0 |
| repetition_penalty | disabled or 1.0 |      disabled or 1.0 |

I don't typically try to measure my tokens per second (TPS). Doing rough fuzzy estimates using LM Studio Chat:

| Model             |  TPS |
| ----------------- | ---: |
| qwen3.6 35b mxfp4 | ~108 |
| qwen3.6 35b mxfp8 |  ~81 |
| qwen3.6 27b mxfp4 |  ~28 |
| qwen3.6 27b mxfp8 |  ~14 |

When running qwen3.6 35b both mxfp4 or mxfp8 in Copilot CLI, I noticed that after it processed the initial prompt, it was fast enough for "real work." The initial prompt with Copilot/Claude is where you definitely see the biggest hit/hurdle powering it with a local model.

Now what do I mean fast enough "real work":

- Model is generating content at a consistently quick pace
- Model is able to make and process tool calls without noticeable delay
- Model is able to accurately make tool calls

## Today (Stop waiting for the initial prompt processing)

If you're following LLM trends on social media, you've probably already seen a lot of mentions of [pi](https://pi.dev/). I heavily recommend you watch the talk from the creator [I Hated Every Coding Agent, So I Built My Own — Mario Zechner (Pi)](https://www.youtube.com/watch?v=Dli5slNaJu0) and [
Building pi in a World of Slop — Mario Zechner](https://www.youtube.com/watch?v=RjfbvDXpFls). He explains how pi has a very minimal system prompt and only 4 default tools, he also walks through fatal flaws in various popular harnesses, and lots of fun insights, heavily recommend checking out his [blog](https://mariozechner.at/). pi is also easily extensible to the point where it's kind of addicting because it really is "yours". The minimalism and lightness is where it really sets itself apart for using it as the agentic harness for local models.

With pi, I no longer wait for that initial prompt processing (apparently it's called the "prefill stage"). It's just instant. I send a prompt, and tokens just start generating. You don't see this with Copilot/Claude.

Some caveats though, is pi is "yolo by default." You need to add permissions using an extension (there's a few, I've playing with my own [smart "auto mode"](https://github.com/scaryrawr/pi-automode), and a previous [manual shell permissions](https://github.com/scaryrawr/pi-permissions), there's [probably better ones](https://pi.dev/packages?name=permissions), but I'm still experimenting 🤣).

With pi + local models, I feel the thing is fast enough to be working with interactively comfortably.

## The Caveats

So far, our main focus has been on hitting "real work" speeds, but hasn't touched on quality.

Quality wise, these are not giving you "opus-tier" results (let's be real). I'm not sure how to do a real metric/grade on where these land.

Personal "feeling" wise, the results feel closer to Sonnet 3.5/3.7 or GPT-4.1 of last year, which to me is honestly still really impressive. Sonnet 3.7 was the first model where I felt you could start doing real work with it. You had to take things way more incrementally and wouldn't try to throw it at a large piece of existing code. Benchmarks will say it's higher or somewhere else, but I have no idea (I'm also not pulling out older models to really compare the side-by-side feeling...), so it really is "the feeling" 🤣.

Being more intentional while working with an LLM is very refreshing. The current industry trend is trying to race and go as fast as possible and you have daily status updates where people are wondering why the LLM hasn't already solved all your problems already.

Being able to work with a model, really think through the approach, get it to generate small incremental changes, have to manually tweak things here and there. Is oddly a much more enjoyable way to work! Getting to take breathers, and get time to question and ponder the results, and _trying_ to polish it up.

I plan to try this out more for side projects. pi is super fun to work with and build extensions. Local models feel very "real" to keep an eye on and work with. I don't recommend buying hardware just to run local models, but there is a lot of comfort in not relying on external inference providers and being to keep everything local.
