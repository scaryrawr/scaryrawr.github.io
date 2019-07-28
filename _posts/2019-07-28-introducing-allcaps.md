---
layout: post
title: Introducing ALLCAPS
categories: [programming,nerd,audio,hacks,win32]
date: 2019-07-28 15:58:34
---

A few weeks ago I was browsing twitch for KH3 streams and was trying to find one in English (for some reason if you're trying to find folks playing older games it's common to find it in other languages), and the person had the language as "ASL/ENG." I wasn't sure what "ASL" meant until I started watching. It turned out the streamer playing the game was deaf. After watching a bit I checked out their profile and saw instructions for setting up captions for your stream. I had never thought about that before.

I started looking into captions and saw that twitch supports closed captions, but couldn't find a stream that actually embedded captions in it. I also found out that OBS on Windows includes a feature for generating captions using the Windows Speech Recognizer.

It got me thinking... If OBS can capture your PC's audio and stream it to twitch, why can't I capture your PC's audio, and send it to the speech recognizer? The APIs support file/audio streams... someone just needs to hook it up.

It turns out after doing so, the Windows Speech Recognizer isn't good at dealing with background noise, and really needs the person to be speaking clearly and... dare I say it... "professionally." The recommendation from the Speech Recognizer itself is to speak as if you were a news broadcaster (which surprisingly we saw best results when testing on news streams).

Here's a video demo:
<iframe width="560" height="315" src="https://www.youtube.com/embed/0Suua6R23BU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I'm not too familiar with working with audio, but I'm wondering if there's ways to filter out the noise (vocal frequencies are within a specific range for example). And what other transforms we can do in real-time to improve the recognition.
