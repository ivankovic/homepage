+++
date = 2014-01-23T09:00:00Z
title = "Detecting the presence of a specific smartphone device on the network"
aliases = [
  "/blog/2014/01/23/detecting-the-presence-of-a-specific-smartphone-device-on-the-network.html"
]
+++
Detecting the presence of a specific smartphone device on the network
=====================================================================

Some parts of my R-PI swarm are more useful when I am at home, and some only make sense if my apartment is empty. It would be relatively easy to do some form of active notification that would require me to press a button, scan an NFC tag or some other action when I enter and leave my apartment, but it would be really cool if each drone in my R-PI swarm could figure out on it’s own if I am at home or not.

A good proxy for me being at home is my phone being connected to my wireless network. In theory, I can run a scan each minute scanning my entire network for a specific [MAC address](http://en.wikipedia.org/wiki/MAC_address). As long as the device responds to at least one ping, it will work.

As it turns out, getting smartphones to respond to that one critical ping is not as simple, but the following Bash script seems to be reliable enough. I have run this for some time now and it works reasonably well with my Nexus 4. If the device is present it usually picks it up in 2-4 seconds (after the script is run, which is every 60 seconds). If the device is not present, or the arp cache is wrong, it takes about 15-20 seconds to sweep the entire network.

Dependencies
------------

The script depends on the [fping](http://fping.org/) fast ping tool. If you are using [Raspbian](http://www.raspbian.org/) you can just `apt-get` the appropriate [package: fping](http://packages.debian.org/wheezy/fping).

Bash script
-----------

    #!/bin/bash
    
    SUBNET=<LOCAL IP SUBNET>
    TARGET1=<MAC ADDRESS>
    TARGET2=<MAC ADDRESS>
    EMAIL=<EMAIL>
    
    function extract_ip_from_arp {
      ip=`/usr/sbin/arp -a -n | grep $1 | cut -f 2 -d' ' | tr -d '()'`
    }
    
    function ping_exact_ip {
      if [ -n "$ip" ]; then
        alive=`fping -r 2 -a $ip 2>/dev/null`
      else
        alive="Not found"
      fi
    }
    
    function is_device_here {
      if [ -n "$ip" ] && [[ "$alive" == *"$ip"* ]]; then
        return 0
      else
        return 1
      fi
    }
    
    function stop_motion {
      if pgrep -x motion; then
        /etc/init.d/motion stop
      fi
      echo "Motion not running."
      exit 0
    }
    
    function start_motion {
      if pgrep -x motion; then
        echo "Motion already running."
      else
        /etc/init.d/motion start
        echo "Motion detection running" | mail -s "Notice: Motion detection running" $EMAIL
      fi
      exit 0
    }
    
    function try_device {
      echo "Looking for $1."
      extract_ip_from_arp $1
      echo "$1 is $ip."
      ping_exact_ip
    
      if is_device_here; then
        stop_motion;
      fi
      echo "$1 not found."
    }
    
    try_device $TARGET1
    try_device $TARGET2

    start_motion

Usage
-----

The script is designed to run as a [cron](http://en.wikipedia.org/wiki/Cron) job. Don’t forget, while you have an expanded `PATH` variable when you log-in to your shell, the `cron` jobs don’t. So while you are editing your `crontab` with `crontab -e` don’t forget to add this somewhere in your file:

    PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

It’s also probably a good idea to add `MAILTO=””` to your crontab to prevent any emails going out in case of failures (or even just outputs).

Analysis
--------

What the script does is:

  1. Try to extract the IP address of the phone from the existing ARP cache.
  2. If the IP was extracted, try to ping it with 3 packets.
  3. Check to see if the ping was successful. If it was, perform the at-home action (in my case, stop the motion detector) and exit.
  4. If the ping failed, we force an ARP table update by performing a sweeping single packet ping scan over the entire network.
  5. Repeat the IP extraction
  6. Try to ping the exact IP again. This is essential because we don’t know if the ARP table was really updated because of the sweep or if the cached information is there but the device just didn’t respond to pings.
  7. If the ping was successful, perform the at-home action (stop motion detection). If the ping failed, perform the not-at-home action (start motion detection).

I am using this on my security nodes to start the [Motion](http://www.lavrsen.dk/foswiki/bin/view/Motion/WebHome) motion detector deamon, but you can use it for other things as well. If you put this on an [XBMC](http://xbmc.org/) node, you can have it autostart your music when you get home.

It would be really interesting to see how you could use this to enhance your network security as well. After all, if the firewall knows I am at home, there’s no real reason for keeping the external access port open.

Update: 27th of April 2014
--------------------------

I refactored the script to enable searching for more than one device.
