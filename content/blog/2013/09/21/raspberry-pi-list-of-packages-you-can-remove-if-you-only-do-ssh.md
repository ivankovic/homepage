+++
date = 2013-09-21T19:28:00Z
title = "Raspberry Pi - List of packages you can remove if you only do SSH"
aliases = [
  "/blog/2013/09/21/raspberry-pi-list-of-packages-you-can-remove-if-you-only-do-ssh.html"
]
+++
Raspberry PI - List of packages you can remove if you only do SSH
=================================================================

If you, like me, only access your R-PI over SSH, don’t have a printer connected to it and don’t use it to play music, you might have a few packages installed that you will never ever use.

Here’s a nice list to help you remove them:

`alsa-base alsa-utils cups-bsd cups-client cups-common debian-reference-common debian-reference-en desktop-base desktop-file-utils dillo galculator gconf-service gconf2 gconf2-common gnome-icon-theme gnome-themes-standard gnome-themes-standard gpicview gsettings-desktop-schemas gtk2-engines:armhf hicolor-icon-theme idle idle idle3 leafpad leafpad libcups2:armhf libcupsimage2:armhf libgail-3-0:armhf libgail18:armhf libgconf-2-4:armhf libgnome-keyring0:armhf lightdm lxappearance lxde lxde-common lxde-core lxde-icon-theme lxinput lxmenu-data lxpanel lxpolkit lxrandr lxsession lxsession-edit lxshortcut lxshortcut lxtask lxterminal menu-xdg midori netsurf-common netsurf-gtk obconf omxplayer openbox penguinspuzzle pistore plymouth raspberrypi-artwork smartsim tk8.5 whiptail wpagui x11-common x11-utils x11-xserver-utils xarchiver xarchiver xauth xdg-utils xfonts-encodings xfonts-utils xinit xpdf xserver-common xserver-xorg xserver-xorg-core xserver-xorg-video-fbdev xterm zenity`

Don’t forget to run

    apt-get autoremove 
    apt-get purge

after to get rid of dependencies.

Of course, you could just use Arch Linux instead, but I prefer stable distributions for non-testing boxes.
