+++
date = 2014-04-30T00:00:00Z
title = "Raspberry Pi swarm - Automatically installing security updates"
aliases = [
  "/blog/2014/04/30/raspberry-pi-swarm-automatically-installing-security-updates.html"
]
+++
Raspberry PI swarm - Automatically installing security updates
==============================================================

When the security 0-day hits the fan, you want to update as fast as super humanly possible. [Responsible disclosure](http://en.wikipedia.org/wiki/Responsible_disclosure) and [embargos](http://en.wikipedia.org/wiki/News_embargo) on major security updates are fantastic, but if the last mile is not fast enough, you will be targeted by opportunistic internet wide scans.

Luckily, setting up automatic security updates on Debian is very easy.

Required packages
-----------------

All you need is [Anacron](http://en.wikipedia.org/wiki/Anacron) and unnatended-upgrades. Technically you don’t even need anacron, if you are sure all your machines will run 24/7.

sudo apt-get install anacron unattended-upgrades

Configuration
-------------

You probably don’t need to configure Anacron. You do need to configure unattended-upgrades a bit though.

There are two main files you need to touch:

  1. `/etc/apt/apt.conf.d/50unattended-upgrades` contains general settings for `unattended-upgrades`. You probably want to set `Unattended-Upgrade::Mail` to your email address.
  2. `/etc/apt/apt.conf.d/02periodic` you probably need to create from scratch. I recommend the following options:

         // Enable the update/upgrade script (0=disable)
         APT::Periodic::Enable "1";
          
         // Do "apt-get update" automatically every n-days (0=disable)
         APT::Periodic::Update-Package-Lists "1";
          
         // Do "apt-get upgrade --download-only" every n-days (0=disable)
         APT::Periodic::Download-Upgradeable-Packages "1";
          
         // Run the "unattended-upgrade" security upgrade script
         // every n-days (0=disabled)
         // Requires the package "unattended-upgrades" and will write
         // a log in /var/log/unattended-upgrades
         APT::Periodic::Unattended-Upgrade "1";
          
         // Do "apt-get autoclean" every n-days (0=disable)
         APT::Periodic::AutocleanInterval "7";
         Testing it out

You can run `unattended-upgrades` by hand and check the log, by default located at `/var/log/unattended-upgrades/unattended-upgrades.log`.

You can try out Anacron by running `anacron -f -n -s -d`.
