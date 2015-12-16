+++
date = 2014-05-01T12:00:00Z
title = "Saving 20ma on each RPi node"
aliases = [
  "/blog/2014/05/01/saving-20ma-on-each-rpi-node.html"
]
+++
Saving 20mA on each R-PI node
=============================

Most nodes in the R-PI swarm don’t have a display device connected to them. So why keep the display device in standby?

According to [Dave Akerman’s blog post](http://www.daveakerman.com/?page_id=1294) the current usage from these is 20mA.

All you need to do to disable them is run:

    sudo /opt/vc/bin/tvservice --off

Don’t forget to add this to your `/etc/rc.local` file as well.
