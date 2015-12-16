+++
date = 2013-11-09T17:50:00Z
title = "Raspberry Pi - minimal network security setup for a headless Pi"
aliases = [
  "/blog/2013/11/09/basic-network-security-setup-for-rpi.html"
]
+++
Raspberry PI - Minimal network security setup for a headless PI
===============================================================

I run a couple of purely headless Raspberry PI units connected to my network. The following is a list of minimal security precautions I use on all units. I am using Raspbian, since it is far more stable and easier to configure securely than Arch. I would recommend everyone to install Arch at least once and play around as much as possible. But for systems you actually plan to use 24/7, Raspbian is a better choice.

Password and user
-----------------

If possible, before connecting the PI to the network you should change the default username and password. When adding the new user, don’t forget to set the appropriate groups.

    passwd
    adduser -G sudo NewUserName
    userdel -r pi

Remove the PI user from the sudoers file
----------------------------------------

The pi user has passwordless access to sudo. We deleted the user already, so there is no reason to leave this in.

    sudo visudo

Search for

    pi ALL=(ALL) NOPASSWD: ALL

and remove that line.

Move SSH to a different port
----------------------------

There is a lot of controversy around this one. A lot of people claim that moving SSH to a port different from 22 is [security through obscurity](http://en.wikipedia.org/wiki/Security_through_obscurity). The other side is claiming, and I believe rightfully so, that it is instead [defense in depth](http://en.wikipedia.org/wiki/Defense_in_Depth_(computing)).

As anecdotal evidence, during the [2008 Debian SSL Key Generator Incident](http://www.debian.org/security/2008/dsa-1571) servers running on standard SSH port were automatically targeted by broad sweeping scans of the entire Internet. Servers running on wacky ports were not, because it is cheaper to scan a single port when scanning the entire Internet.

So, move SSH to a different port. Arguably, you should choose a port lower than 1024, because these are restricted in Linux and only the root user can listen on them. However, they are also more likely to be scanned, so it’s a tradeoff.

Changing the SSH port is reasonably simple.

    sudo vim /etc/ssh/sshd_config
    :s/Port 22/Port 1012
    sudo /etc/init.d/ssh restart

If you were using SSH to do this, you will now be kicked out. Reconnect to the new port.

Set up a simple firewall with iptables
--------------------------------------

[Iptables](http://www.netfilter.org/) is the standard way of configuring the Linux kernel firewall. Following the defense in depth principle, the firewall will be configured to stop behaviour which is **definitely** unnecessary for a headless SSH-only R-PI.

**If you do something wrong and lock yourself out of the PI, you can power-cycle the device and the rules will be cleared.**

**If you do something wrong and save the rules that lock you out, you can plug the SD card in your desktop or laptop and edit** `/etc/iptables/rules.v4.`

We start by dropping all FORWARD packets. Unless the PI is running as a router, there is no need for it to deal with these packets.

    iptables -P FORWARD DROP

The OUTPUT chain should default to ACCEPT. If not, this can always be ensured with:

    iptables -P OUTPUT ACCEPT

We allow all traffic on the loopback.

    iptables -A INPUT -i lo -j ACCEPT

This rule allows any packets related to existing connections. This is important because ICMP messages related to existing connections have to go through.

    iptables -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT

If we end up with INVALID packets related to existing connections, we silently drop these.

    iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

(*Optional*) If you would like ICMP echo (a.k.a. ping) requests to pass through the firewall, you need to add:

    iptables -A INPUT -p icmp --icmp-type 8 -m conntrack --ctstate NEW -j ACCEPT

It’s a good organizational idea to keep the particular service related rules in a user-defined chain.

    iptables -N TCP

We can send packets starting new sessions to this rule with:

    iptables -A INPUT -p tcp --syn -m conntrack --ctstate NEW -j TCP

Now we allow incoming connections to the SSH port (which we changed previously!):

    iptables -A TCP -p tcp -m tcp --dport 1012 -j ACCEPT

We can now finally drop everything else.

    iptables -P INPUT DROP

(*Optional*) You can make your system behave a little more friendly by adding the following two rules. They make the system RFC compliant but make the PI a bit more visible in the network because it will reject incoming connections with ICMP port unreachable or TCP RST packets. However, if you have ICMP echo packets (ping) enabled, then this doesn’t expose any new information but speeds up any clients connecting to closed ports.

    iptables -A INPUT -p tcp -j REJECT --reject-with tcp-rst
    iptables -A INPUT -j REJECT --reject-with-icmp-port-unreachable

**All these changes are temporary**. If you want to persist them after a reboot, install the handy iptables-persistent package:

    sudo apt-get install iptables-persistent

This setup is only related to the IPv4 firewall. I’ll be posting the IPv6 version once I complete it :)

Update the system
-----------------

Do this every so often. If possible, keep track of [release notes](http://downloads.raspberrypi.org/raspbian/release_notes.txt) from Raspbian.

    sudo apt-get update
    sudo apt-get upgrade
