+++
date = "2015-12-23T23:29:21+01:00"
title = "Self-hosting a static personal homepage - Security"
+++
Self-hosting a static personal homepage - Security
==================================================

I recently switched my website from GitHub pages to an unmanaged VPS. I wanted to enable SSL for my domain and I wanted to experiment with Let's Encrypt.

I also like to do the occasional exercise in over engineering. This blog post documents the security setup of my homepage.

Why VPS
-------

I chose an unmanaged VPS because they are [cheap](http://lowendbox.com/) and provide good operational isolation. The webpage is now hosted on a separate IP, network and machine from anything else I have so if the web page is under attack I don't have any other problems.

It does introduce a new actor to the security model, a possibly dodgy VPS provider, but I like the tradeoff. Especially since there are simple technical solutions to solve some of the problems that come from it. vector, the malicious VPS provider. It's a tradeoff I accept, because it's easier to defend against that then against a DDoS that also takes out your personal network connection.

Static vs dynamic
-----------------

My homepage is 100% static. I use [Hugo](https://gohugo.io/) for generation and have hand-crafted CSS and layout optimized to work for command line, desktop UI and mobile.

This allows me to do quite a few nifty things:

1.    I only accept GET and HEAD requests. Nginx has a nifty `limit_except GET { deny all; }` directive you can use for that.
2.    I can store the contents of my homepage on GitHub and automatically import it to the VPS.
3.    I can diff the contents served by the VPS and those stored on GitHub from a probe device. If they differ, I know that something is up. For extra points I can do this through Tor with a different exit node each time.
4.    I can set the cache expiration time for all URLs to be very large. This has an interesting side effect of making DDoS a little bit more difficult to perform. A naive DDoS that just uses the user's browser will not work. It's not much, but it is funny. If I didn't also plan to switch my site to SSL, it would actually be a much more interesting interaction since intermediate servers would be able to cache much better, but hey.

Let's Encrypt
-------------

Experimentation with Let's Encrypt and switching my domain to SSL is my motivation for this whole thing. I tried out Let's Encrypt before when it was in closed beta and the UX of the official client was, less than impressive. To be fair, I tried a non-recommended flow trying to issue the certificate manually. This was a mistake.

So for the VPS, I decided to use [acme-tiny](https://github.com/diafygi/acme-tiny) and decided on a fully automated once per month renewal.

Key material op-sec
-------------------

For a fully automatic experience, certain key material has to be stored on the VPS.

I assume that the VPS provider has full read/write access to the machine. This means that any key material that reaches the machine has to be public or assumed compromised.

There are 2 private keys needed for a fully automatic Let's Encrypt SSL setup:

1.    The private key of the currently used SSL certificate, also known as the domain key.
2.    The private key registered with Let's Encrypt that was used to prove ownership of the domain, also known as the account key.

If someone has access to the domain key, they can impersonate the server, passively decrypt all communication between the server and readers or change the response and send arbitrary code to the readers.

If someone has access to the account key, they can revoke the existing certificate and ask Let's Encrypt for a new one.

Because I want fully automatic key renewal, both of these **must** be on the server and both **must** be in plain text. So I have to assume that the VPS provider has access to them. 

Since keeping the keys secret is not going to work, I decided instead to focus on detecting malicious behaviour. Turns out, since my homepage is 100% static and the code is also hosted on GitHub, there's not much secret data a passive listener could observe. If a reader was using Tor, the only information gained would be that some machine somewhere accessed a specific web page. This information is so useless we can ignore this attack.

Now, a more active attacker might choose to send back malicious code. This would be super easy to detect though, because a perfect copy of the page exists on GitHub and my server doesn't set any cookies or use any non-standard headers. All I need to do is have a simple script that will crawl my page once per hour, checksum the results and compare them to a list of well known hashes.

To make sure the server is not serving the real page only to the probe I hide each probe behind Tor or VPN.

SSH
---

Of course the server also runs SSH, with the usual precautions: running on non standard port, public key authentication only, using Ed25519. The key is not used on any other server.

I'm not aware of any useful attack anyone could have on this.

Lower levels
------------

Of course, defense in depth is a thing so I also have a very strict iptables based firewall that blocks everything except ports 80, 443 and the SSH port.

Fail2ban connects the firewall to SSH and Nginx.
