+++
date = 2014-06-15T10:00:00Z
title = "Remote administration node - reverse SSH setup"
aliases = [
  "/blog/2014/06/15/remote-administration-node-reverse-ssh-setup.html"
]
+++
Remote administration node - reverse SSH setup
==============================================

Sometimes you just need to remotely administer a network 1000 kilometers away. [Thinking ahead](http://tvtropes.org/pmwiki/pmwiki.php/Main/CrazyPrepared) can save you a lot of headache in this situation.

A R-PI node connected to the remote network can open a [reverse SSH tunnel](http://en.wikipedia.org/wiki/Reverse_connection) back to you.

Reverse SSH tunnel setup
------------------------

Because one of the devices is in a physically remote location you **should not reuse any cryptographic materials**.

You should create a new restricted user on the server. When creating the user, remember to **change the login shell to `/bin/false`**. This user is only used for port forwarding so there’s no need for a login shell, and if the ssh key ever falls into the wrong hands, the damage they can do is limited.

On the remote device, [create a new SSH keypair](https://wiki.archlinux.org/index.php/SSH_Keys#Generating_an_SSH_key_pair). Because you will not be there to type the password, the key should be passwordless. Because of this potential vulnerability, this SSH key should only ever be used for the newly created locked down user. You can now copy this key to the newly created user on the server. It’s also probably a good idea to have a key that works the other way, allowing you to connect to the remote device without a password.

Once you have copied the keys, try connecting to the server from the remote device. If this works, you can set up an entry in the `~/.ssh/config` file to simplify further config. The important options are:

  1. `RemoteForward` - This sets up port forwarding. The format is `<port on server> localhost:<ssh port>`. For `<port on server>` you should choose a high enough, random port. This port **doesn’t need to be exposed externally**. You can safely [firewall](http://www.ivankovic.me/blog/2013/11/09/basic-network-security-setup-for-rpi.html) them on both the server and the remote device.

  2. `ServerAliveInterval` - Because this is a long living connection with no traffic, it’s good to send a null packet every now and then. Once every 60 seconds will do.

  3. `ServerAliveCountMax` - On the other hand, if some (for example 2) of these null packets don’t make it, assume that the connection is dead.

Finally, try out your config. Initiate the SSH tunnel from the remote device. You should now be able to SSH to `localhost:<port on server>` on the server itself and get the login prompt for the remote device.

Automatic SSH on startup
------------------------

[autossh](http://www.harding.motd.ca/autossh/) is a nice little program that will start an SSH session and monitor it, restarting it as necessary. There’s a [Debian package](https://packages.debian.org/wheezy/autossh).

You can add it to `rc.local` to make sure it start on every boot. A simple `autossh -M 0 -f -N <host>` will do. For extra points, use `su -c autossh -M 0 -f -N <host> <username> &` to run it as an unprivileged user.
