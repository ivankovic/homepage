+++
date = 2014-10-13T22:35:37Z
title = "SwarmCast: Autostart Tmux with SSH"
+++
SwarmCast: Autostart Tmux with SSH
==================================
Maintenance tasks on the RPi Swarm nodes can be a bit of a chore. Of course the idea is to [automate](http://www.ivankovic.me/blog/2014/04/30/raspberry-pi-swarm-automatically-installing-security-updates/) as much as possible, but sometimes you just need to do the same exact sequence of commands on all nodes at once.

Luckily, Tmux combined with SSH (using SSH keys and [SSH config](http://www.ivankovic.me/blog/2014/05/28/using-ssh-config-file-to-simplify-swarm-management/)) is just the thing we need.

Starting Tmux from a Bash script
--------------------------------

Tmux has a [really powerfull set of commands](http://manpages.ubuntu.com/manpages/precise/man1/tmux.1.html). They allow you to completely control a Tmux session from a Bash script. In this case, we use it to prepare the window with 4 panes, each one with an SSH session to a different swarm node. At the end it turns `synchronize-panes` option on. This will instruct Tmux to send all keystrokes to all windows at once.

    #!/bin/bash

    tmux new-session -d -n SwarmCast -s swarmcast "ssh <NODE1>"
    tmux split-window "ssh <NODE2>"
    tmux split-window -h "ssh <NODE2>"
    tmux split-window -h -t 0 "ssh <NODE4>"
    tmux set-window-option synchronize-panes 
    tmux attach-session -t swarmcast

One interesting thing to note: if a node fails to connect, it's pane will simply disappear and you can just continue working on the online nodes.
