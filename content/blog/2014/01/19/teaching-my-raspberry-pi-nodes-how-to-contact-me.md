+++
date = 2014-01-19T09:00:00Z
title = "Teaching my Raspberry Pi nodes how to contact me"
aliases = [
  "/blog/2014/01/19/teaching-my-raspberry-pi-nodes-how-to-contact-me.html"
]
+++
Teaching my Raspberry PI nodes how to contact me
================================================

Like every good little robot, my R-PI nodes need a way to contact me if anything goes wrong. The best way I found was by using good old email. It’s incredibly easy to set up and quite secure (believe it or not).

Since my nodes only ever need to send email to contact me, never to read it, instead of using the more complicated [Sendmail](http://www.sendmail.org/) or [mutt](http://www.mutt.org/), I use [sSMTP](https://wiki.debian.org/sSMTP).

First thing I did was create another Gmail account, to be used by the robots. A single account for all nodes is the best idea. It’s not the most secure option, but it is good enough and the overhead is low.

Note that if you use Gmail for the robots and if you personally use a Gmail account and use TLS (which is mandatory), you in fact have end-to-end **in-transit** encryption for these emails, yay!

There are many tutorials out there on the web that go into details on setting up sSMTP with Gmail. I’ll just summarize the config here.

    root=<ACCOUNT>@gmail.com
    mailhub=smtp.gmail.com:587
    rewriteDomain=
    AuthMethod=LOGIN
    UseTLS=YES
    UseSTARTTLS=YES
    FromLineOverride=YES
    AuthUser=<ACCOUNT>@gmail.com
    AuthPass=<PASSWORD>

As soon as you set up sSMTP, you can send emails with:

    echo <CONTENTS> | mail -s <SUBJECT> <DESTINATION ADDRESS>

If you would like to send attachments (for example images captured by [PiCam](http://www.raspberrypi.org/camera)), you can use either [mailx](http://en.wikipedia.org/wiki/Mailx) or [mpack](http://packages.debian.org/sid/mpack). I personally use mpack, for no particular reason:

    mpack -s <SUBJECT> <FILE> <DESTINATION ADDRESS>

Further improvements
--------------------

This is just a basic communication layer for your PI-s when they need to contact you. You can use it as is, but I would recommend using it in combination with [GPG](http://www.gnupg.org/) to ensure end-to-end at-rest encryption as well.
