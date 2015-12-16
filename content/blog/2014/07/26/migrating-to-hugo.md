+++
date = 2014-07-25T22:13:55Z
title = "Migrating to Hugo"
+++
Migrating to Hugo
=================

I was recently looking around for a new static site generator. 
[Nanoc](http://nanoc.ws/) is good, but I have never liked the way you specify
URL paths in it. It's run by a relly stand-up guy though, and the Nanoc website
actually links to a [list of simillar project](http://nanoc.ws/about/#similar-projects).

Going through the [list](http://staticsitegenerators.net/) I noticed something
interesting: [Hugo](http://hugo.spf13.com/). It's one of the most starred generators,
and the only top 15 generator built in a compiled language: Go.

I gave it a try, and was so happy I decided to migrate my webpage completely to it.

Hugo
----

One of the prominent features of Hugo is that it is **fast**. Really fast. It
recompiles this site in 45 ms. This together with the auto-reload functionality
the builtin webserver helpfully adds to each file means that you can literally
type your content and see th changes appear in the browser in almost real-time.

However, what really won me over was the [content organization](http://hugo.spf13.com/content/organization). The defaults really make sense, generate pretty URLs and they even provide the ability to easily transition your existing URLs by using [aliases](http://hugo.spf13.com/extras/aliases).

It's not completely without it's problems. Because it's relatively new, the documentation can sometimes be a bit lacking. It took me a week to figure out *exactly* how it chooses a template for a specific URL.
