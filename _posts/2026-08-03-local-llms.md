---
layout: post
title: "Local Models"
categories: [ai, local-llm]
date: 2026-08-03
---

A weird one to me is what folks consider "Local Models."

If you follow some folks on the tech social media, they'll pretty much tell you all open weight models are local models.

To me... this is both right and wrong 🤣.

With infinite money, sure, you could have the hardware to run anything. A lot of the popular folks on social media have sponsors or donors for hardware and finances to support their "local setup."

Some people who's post you read did former crypto mining, or just have too much money and free time 🤣, or a willingness to go into debt, so they have a ton of GPUs to do local LLM lab setups.

But in reality... How many people plan to build a home lab?

For example, a lot of the questions on [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/) (and other similar subreddits) are "Can I have Claude at home on X GB of VRAM?" (the answer is always no... Though some believe yes.).

To most people, "local models" are something you could run realistically on a "modest" setup. Think... a mid to high end gaming rig or an Apple device with unified RAM.

My personal requirement, not only can I run the model, but can I run it well? 128K+ context over 30 tokens per second generation speed.

I have 2 computers, a MacBook Pro M4 Max with 128GB RAM, and a desktop with an RTX 5060 TI 16GB VRAM. (I love the MacBook).

With 16GB of VRAM (you _can_ do offloading to CPU RAM, but it's not ideal), you end up more limited to things like Qwen3.5 9B and Gemma 4 12B models, you _can_ kind of run Qwen3.6 35B A3B, but it ends up costing you a good bit in performance.

The magic VRAM number to start ends up being >24GB of VRAM. I'm tempted to try 2x 5060 Ti 16GB cards 🤣, but I have not yet. There is another concern of running models on multiple cards versus a single card with more VRAM, but it is one of the cheaper ways to get 32GB of VRAM combined.

So more and more... I love my MacBook 🤣. Unified RAM setups are probably the easiest ways to have a lot more RAM to load and utilize local models. The main options here tend to be:

- DGX Spark (RTX Spark soon)
- "Strix Halo" (AMD's 395 and 495 AI chips)
- Apple Silicon
- Qualcomm maybe...? (Started playing with [GenieX](https://github.com/qualcomm/GenieX)... super slow compared to other solutions, but I have a 64GB Surface Laptop from work 🤣, and most things run under 20TPS and like 4k context... which doesn't meet criteria yet for real workloads)

From reading online, Apple tends to have the fastest inference, Sparks are really easy to setup into a combined home lab, Strix Halo is a mixed bag, but some people love it. Strix Halo I think also can run Windows, where DGX Spark is a specific Linux OS and RTX Spark will be able to run Windows. So depends on your needs (RTX Spark might also be decent for gaming which for some is another fun thing to consider).

Now, some fun stuff, Strix Halo you can get in tablet/laptop form, same with Apple Silicon, RTX Spark will also be in the laptop form factor.

These unlock the ["coding agent on the airplane"](https://x.com/julien_c/status/2047647522173104145) (make sure to plug in, these things drain battery insanely fast).

That "coding agent on the airplane" to me, is the true "running local models." Being able to run an LLM anywhere, offline, etc...

You also see efforts like [dwarfstar](https://github.com/antirez/ds4), [jangq](https://github.com/jjang-ai/jangq), [oQ](https://github.com/jundot/omlx/blob/main/docs/oQ_Quantization.md), [OptiQ](https://mlx-optiq.com/), etc... (apparently, gguf already supports dynamic quantization) Where others also believe in running larger models in smaller memory footprints.

There's a goal to run the biggest thing you possibly can for your machine.

No matter the amount of RAM you have, there always seems to be a "next tier." (I'm always tempted to buy 2 DGX Sparks and hook them up together 🤣).

I think for most people, being able to run something like Qwen3.6 27B or 35B is kind of the ideal spot. They're pretty smart and capable, but definitely not at the point of "Frontier level intelligence." (Now remember, my ideal local setup is something that I can run on my MacBook. If GLM-5.2 could run on it, I'd love it, but realistically, it's pretty much 120B MoE or smaller)

But prompting smaller models is very different from prompting something like Opus or Sol.

Also, models perform differently depending on their quantization. Some folks refuse to go to 4Bit, some swear by 6Bit, etc... (personally, I keep trying mxfp4 or mxfp8 on my MacBook 🤣).

You'll find some models, that seem perfect for local setups (looking at you [Laguna-S-2.1](https://huggingface.co/poolside/Laguna-S-2.1)), don't quantize well at all (at least to something under 128GB).

Prompting smaller models feels closer but still better than prompting say Sonnet 3.7 or GPT-4.1 of last year, which is kind of crazy when you think about it.

Now what's the point of this post...

I don't really know 🤣, I just feel the definitions and terminology in this space are overly broad with multiple meaning/interpretation that are all valid.

It's also exciting to see the advancement in "local models." Except, a lot of the recent announcements in the past few weeks have been things like 1T or 2.5T models (which who has hardware to run that locally 🤷🏼). Qwen just announced there will be a [3.8 27B](https://x.com/Alibaba_Qwen/status/2084100707423289643) (please please please, 35B MoE too, and bring back the 80B MoE models too), so I'm excited to give that a shot, but really miss that 3.5 was the last one where they had models at every single size factor 😥.
