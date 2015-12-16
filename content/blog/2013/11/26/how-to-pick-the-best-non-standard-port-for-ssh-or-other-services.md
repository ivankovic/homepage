+++
date = 2013-11-26T22:59:00Z
title = "How to pick the best non standard port for SSH or other services"
aliases = [
  "/blog/2013/11/26/how-to-pick-the-best-non-standard-port-for-ssh-or-other-services.html"
]
+++
How to pick the best non-standard port for SSH (or other services)
==================================================================

I won’t get in the discussion if this is a [good](http://www.danielmiessler.com/blog/putting-ssh-another-port-good-idea) or a [bad](http://www.adayinthelifeof.nl/2012/03/12/why-putting-ssh-on-another-port-than-22-is-bad-idea/) idea. Other people have done that. I’m just going to assume you decided by yourself this is a good idea and are now wondering: “How do I pick the best port?”.

Let’s look at the threat model first. The reason to move a service to a non-standard port is to hide it from a scan. The broader the scan, the less ports it usually covers. Internet wide scans come in a few types:

  1. Large scale botnet owners manually looking for targets (this is usually over in a day or two)
  2. Worms/trojans searching for specific vulnerabilities (this can last for weeks or months, as long as the worm propagates)
  3. [Researchers](http://www.youtube.com/watch?v=R_vHhEzxYkY) [scanning](http://blog.erratasec.com/2013/09/we-scanned-internet-for-port-22.html#.UpOnHVSJDAQ) the Internet as part of their research.
  4. These scans usually cover a few specific ports of interest looking for specific versions of services.

On the opposite side of the spectrum is the narrow scan. A targeted attack against a single machine. Scanning all possible ports on a single machine takes a few hundred seconds at most even over a very crappy connection. With a very paranoid approach, scanning a single port once per minute, you can scan all 65535 ports in 6 weeks.

Hiding from a targeted attack
-----------------------------

Let’s get this out of the way first.

Hiding from a targeted attack is difficult. You could use [port knocking](http://en.wikipedia.org/wiki/Port_knocking) to completely hide your machine. Port knocking has some serious disadvantages though: it introduces a single point of failure, **increases** the attack surface and is a significant usability loss.

With that said, let’s look at the more broader scans.

Three big port groups
---------------------

First of, you should know that there are three big port groups (and one small one):

**Port 0** - This is a special port. You cannot actually listen on port 0 for most intents and purposes. In fact, binding to port 0 in most (if not all) networking stacks will instead bind you to a random free port. This is an “unofficial standard”. Keep in mind that it is still technically possible to [forge a TCP packet to port 0](http://tools.cisco.com/security/center/viewAlert.x?alertId=19935).

**Ports 1 to 1024** - These are called [privileged ports](http://www.w3.org/Daemon/User/Installation/PrivilegedPorts.html). The interesting property of these ports is that, on *Linux/FreeBSD/OSX*, only programs executing under **root** privileges can listen on these ports.

There is a bit of a discussion (just look at the comment sections for any of the linked posts from the introduction) if using a privileged port offers more security or not. I believe it does not. A relatively simple argument is that picking a privileged port is supposed to make the *client* feel safer, but the actual privilege is enforced on the *server*. I’m not sure why the client would assume that the server is actually enforcing privilege, and in fact some of them don’t.

However *network scanners* are aware of privileged ports as well, and are more likely to scan them. In fact, `nmap` used to scan ports 1 - 1024 by default. So picking a privileged port is probably a bad idea.

**Ports 1025 to 49152** - [IANA registered ports](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.txt). Nothing special here. Just ports somebody bothered to register at some point, so they have an officially registered service mapped to them. This doesn’t prevent un-official use, so why bother :)
b
**Ports 49153 to 65535** - Dynamic or private ports. Unlike the registered version, these cannot be registered and are to be used for dynamic or ephemeral purposes.

Choosing a port
---------------

We can discard ports 0 - 1024. As explained above, they are either unusable or defeat the purpose somewhat.

I am not aware of any research into frequency of ports used for Internet wide scans, but there is a reverse list. Fyodor of Nmap fame maintains a [list](http://nmap.org/book/nmap-services.html) of frequencies of open ports in the world (his list is more extensive than just the Internet, for details I recommend his [DEFCON video](http://www.youtube.com/watch?v=R_vHhEzxYkY))

If you have nmap installed on your system, you can find a file called `nmap-services`, probably located at `/usr/share/nmap/nmap-services` listing a lot of open ports (19891 ports at the time of this post). The second and third column of the file are most interesting for us. With a quick bash one liner we can get a sort of ports by frequency:

    tail -n +23 /usr/share/nmap/nmap-services | grep tcp | awk '{ print $3" "$2 }' | sort -n

At the time of this post, the TCP results larger than 0.1 are:

    0.131314 25/tcp # SMTP
    0.182286 22/tcp # SSH
    0.197667 21/tcp # FTP control port
    0.208669 443/tcp # HTTPS
    0.221265 23/tcp # Telnet (!!)
    0.484143 80/tcp # HTTP

Not surprisingly, port 80 (HTTP) is by far most prominent. I find it unbelievable that telnet is still so prominent in this day and age.

If we believe that more frequently open ports are more likely to be scanned, we can now quantitatively compare two port choices.

It’s important to note that if a port is not present in the nmap-services file at all, the frequency is assumed to be zero. At the time of this post, the file lists 17036 registered or dynamic ports. This means that your chances of picking a port with lowest possible frequency is actually reasonably good at 0.736 or almost 3 out of 4 random ports between 1025 and 65535.

So just pick a random number between 1025 and 65535, and check your choice with:

    tail -n +23 /usr/share/nmap/nmap-services | grep -e "\s<PORT>/"

For extra points, you can also check that there are no registered services assigned to that port.

