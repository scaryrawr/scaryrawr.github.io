---
layout: post
title: VTT Generator
categories: [programming,nerd,audio,hacks]
date: 2020-04-12 22:31:56
---

Introducing [VTT Generator](https://github.com/scaryrawr/vtt-generator)!

This is a new project for generator Web Video Text Tracks ([WebVTT](https://www.w3.org/TR/webvtt1/)) for videos. I created it after seeing many churches (including my own) go to online services without having subtitles/captions. Yeah... when you upload it to YouTube it'll have auto generated captions, but I think some of the big aspects of still feeling like part of the community is being able to participate in the live chat (note: I'm not part of the hard of heard/deaf community).

How it works is a little... loopy? brute force-ish? lazy? fun? I'll go with fun.

First! We take a video and just tell [ffmpeg](https://www.ffmpeg.org/) to convert it to a [WAV](https://en.wikipedia.org/wiki/WAV). We do this because speech recognition software doesn't work on videos, and only works on a limited type of audio files and formats. Instead of trying to do the conversion ourselves, ffmpeg makes it simple.

Second! We go to [azure cognitive services](https://azure.microsoft.com/en-us/services/cognitive-services/speech-services/) for speech recognition on the audio file, we're able to get call backs with recognized text and timestamps which is what we need for generating VTT files.

Third! When processing recognized text, we do it word by word... which is kind of painful. We can get paragraphs back in one recognition response, so going word by word, we can limit the text on the screen to be only shown for ~2-3 seconds at a time (can be changed as a command line parameter). This limits how much text appears on the screen all at once. What stinks though is that the single word durations come back unformatted, which we do a quick hack of splitting the "Display Text" result and assuming that the displayed text word count always matches the number of words returned in the single word durations. I think this is actually the coolest part because it actually took effort to figure out.

Oddly, there's times where the final percentage reported in the progress doesn't come out to 100%, that's because the audio file might be longer than the spoken text (nothing is recognized towards the end of the file).

Notes! Double check the output. Since it's automated, it can have some incorrectness. [VLC](https://www.videolan.org/vlc/index.html) supports WebVTT files, so you can watch videos with the subtitles and look for oddities (I don't know how proofs actually check and go through...). There's also [subtitle editors](https://en.wikipedia.org/wiki/Comparison_of_subtitle_editors), most of which are free to use. Having bad subtitles/captions is just as bad (maybe even worse) as not having them at all.