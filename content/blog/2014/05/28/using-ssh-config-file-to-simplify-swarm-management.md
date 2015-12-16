+++
date = 2014-05-28T10:00:00Z
title = "Using SSH config file to simplify swarm management"
aliases = [
  "/blog/2014/05/28/using-ssh-config-file-to-simplify-swarm-management.html"
]
+++
Using SSH config file to simplify Swarm management
==================================================

While the whole point of having a swarm of devices is to automate things as much as possible, sometimes you just have to SSH into some, or all, of them. Increasing security by using [non-standard ports](http://www.ivankovic.me/blog/2013/11/26/how-to-pick-the-best-non-standard-port-for-ssh-or-other-services.html) will cause some usability problems though. It’s really easy to work around it using a bit of config.

.ssh/config
-----------

[`.ssh/config`](http://linux.die.net/man/5/ssh_config) is a fantastic little file. The most important declaration you need to know is `Host` because it restricts the all other declarations to the host names that match the specified pattern.

I personally use just two types of patterns:

  1. One or two letters or numbers. Because Host patterns match the address specified on the command line, if you create a one letter Host declaration and then give it a HostName declaration that points to a commonly used address it enables you to connect to that host using only a single letter. For example the following setting:

         Host r
         HostName rpi.local

     Will enable you to connect to rpi.local just by typing ssh r.

  2. `"? , ??"` verbatim. This is the catch-all pattern for all one or two letter hosts. Here I can easily specify the non-standard port and the user name. For example:

         Host ? , ??
         Port 1922
         User random

Because the settings that come first take precedence, the `Host ? , ??` declaration should be at the end of the file.

Be careful when using `*` as a pattern. This will match **everything**, so if you specify a non-standard port here it will make connecting to standard SSH servers on the internet very annoying.
