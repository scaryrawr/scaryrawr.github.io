---
layout: post
title: Haters Gonna Hate C++
categories: [nerd, languages]
date: 2018-07-11 22:33:17
---

!["Is C++ a really terrible language?" Elon Musk: Yes]({{ "/assets/images/haters/terriblec.png" | absolute_url }})

**WARNING, Linus' rants have strong language**
[Linus Torvalds on C++](http://harmful.cat-v.org/software/c++/linus)

## Why the hate

So, Linus Torvalds' rant is a fun read (which really, all of them are),
and the reply from Elon Musk on "Is C++ a 'Really Terrible Language'?" Is
also super entertaining for me.

Both appear to be more welcoming to C, but not C++.

C++ introduced a lot of new features that make programming easier, but
in fact introduce a lot of problems under the hood.

## ABI Incompatibility

Let's say you want to write a function that takes a string, and reverses it.

{% highlight c++ %}
// reverses a string
std::string reverse(const std::string& str);
{% endhighlight %}

You build it, throw it into a shared library. You then share and publish
your string reverse function. What tool set did you use? GCC? VS? What
happens if I try to consume it from the other one? The implementation of
std::string might be different. Not even just between GCC or VS, but even
between different versions of the same tool set.

That might not make too much sense, so let's use a simpler example.

{% highlight c++ %}
struct StringWrapper {
    int length;
    char* str;
    int getLength() { return length; }
}
{% endhighlight %}

Later on someone changes it to:

{% highlight c++ %}
struct StringWrapper {
    char* str;
    int length;
    int getLength() { return length; }
}
{% endhighlight %}

And then, to save memory:
{% highlight c++ %}
struct StringWrapper {
    char* str;
    int getLength() { return strlen(str); }
}
{% endhighlight %}

Are they still compatible? All your code still builds, but the memory
layout of the struct is now changed. So if you had a library that took it
as a parameter that wasn't rebuilt, what order does it expect it to be in
memory? It probably won't break until runtime when you try to dereference
`str`, or call `getLength()`.

## Is it exceptional

Another issue is you don't really know if what you're alling will throw
an exception. In Java, exceptions are part of a method signature (but not
all exceptions types require this... and \*insert Java rant\*), in C there
just aren't exceptions.

## No one understands \*insert feature\*

C++ has a ton of features and has been playing catchup adding more and more.
The issue is... to get the maximum out of it takes a lot more effort than it
should. People aren't comfortable with it, and C++ has turned into glorified
C with more complexities. C++ is an extremely powerful language, but majority
of the time... you're not going to be using it to it's full potential and are
probably better writing in something different (sorry C++).

## Works on my machine

Not all C++ implementations are created equal. Sure, your code compiles, but
at times the performance is completely different. Take `std::async` for
instance. `std::async` takes a `std::launch` policy, either `async` and/or
`deferred`. Async launches it on another thread, where deferred runs it on
the same thread when you try getting the result. On Windows, if you `|` them
together, on MSVC it's really nice... on GCC (last I checked)... it ends up
really meh (thread creation is actually pretty expensive, where Windows will
use thread pool threads or run it deferred as well).

## It's missing \*insert missing thing\*

Majority of other language come with a lot more... support? Does C++ have a
standardized Socket library? We just got threads in C++11.

## My thoughts on C++

C++ is a ton of fun. The more you get into it, the more crazy things you can
pull off. You can fine tune things, and force things to be at runtime or
compile time. The thing is... do you need to?

My take, is write code that's maintainable and testable. When you right
software, it has requirements, pick tools and languages that help meet those
requirements.

I think C++ is also great for education and learning.
