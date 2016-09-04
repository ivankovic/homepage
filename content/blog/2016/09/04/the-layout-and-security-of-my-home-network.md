+++
date = "2016-09-04T18:16:49+02:00"
title = "The layout and security of my home network"
+++
The layout and security of my home network
==========================================

I wanted to write this post for quite some time now. Mostly to have an opportunity to critically examine my own setup. If someone else finds this useful, that's just extra.

In this post I will describe the layout and security layers of my entire home network. I personally strongly believe that security can only come from usability, and I will try to point out in this post paths not taken. Paths that would lead to theoretically safer designs that would practically be less safe because they would be unusable.

Human considerations
--------------------

The most usable security systems are those that don't even have any usability considerations because they have no user interface. These are by definition completely automated and wherever possible such systems will be preferred. Unfortunately, these are also the rarest. The only systems that I am aware of that fit this description are all on Chromebooks. The Chromebook full disk encryption and secure fully automatic updates Just Work. And they don't just work in best case scenario, they **always work** without any debugging.

The next level are setup-only UI systems. They require me to invest time up-front to set them up, but once they are set up they require no further interaction ever. A good example of this would be `/home` directory encryption on Ubuntu. Some setup is required, but generally once it is set-up, it works. Note that this implies that they are also rock solid and can **never fail**. Because if they fail, they fall under the class of...

Non-periodic interaction systems. Hopefully very very rarely interactive systems. These systems do have a UI, but you interact with it only on-demand when it cannot possibly be avoided. A good example of this is The Master Key. Usually stored as safe as possible behind as many security countermeasures as possible, the only time it gets used is when issuing more specific keys, which in my case is basically only when provisioning a new trusted device on the network. Note that the interaction must be non-periodic. In other words, you cannot ever have this knowingly scheduled in advance, because if you do it is…

Scheduled interaction systems. These are all the systems that the users will interact with over and over and over again. Because of this, they must be **incredibly fast** and **easy to use**. Logging in to a laptop falls under this, as does the yearly rotation of PGP keys. Note that within this class there are definite subclasses based on the period of the interaction. Something you do every day must be as frictionless as possible, but also requires less documentation and instructions. On the other hand, something done once per year can be a bit more complex, but must be documented very very well because you are likely to forget it.

Use cases and classes of devices on the network
-----------------------------------------------

The network consists of the following classes of devices and the supported use cases:

*  **Chromebooks and Androids** - I group the two together because most Android apps talk to "The Cloud" using `http`, or hopefully `https`, so from the perspective of the network they are very similar. These are also the devices that are used most of the time.

*  **Smart TV and Sonos audio system** - These two are grouped together because I can't fucking trust them. They are completely closed source and could be doing anything, so the network must isolate them and treat them as semi-hostile elements at all times.

*  **NAS** - Basically dumb storage nodes. Everything that lands on them should be encrypted or to be shared with the entertainment system anyhow and they should only store things with appropriate replication.

*  **Small home servers** - I have a couple of RPis that I use as various servers in my home network. Things like SSH from outside, git repositories, media servers.

*  **Physical security** - I have a couple of RPis running as security cameras.

*  **Network infrastructure** - An Asus RT-AC68U running open source firmware and a cable modem + router combination I got from the ISP.

Physical layer
--------------

Any attacks on the physical layer would require the attacker to be in close physical proximity to the network. I have a door. I have custom made RPi security cameras.

Link layer
----------

MAC address leaks. The one I am really worried about here is the ISP provided router. So I keep that one segregated behind the RT-AC68U.

I guess the smart TV, Sonos and all the other closed source elements can also be collecting MAC addresses and phoning them home, but since I need to connect to those in order for them to function at all there's not much one can do at this layer.

Of course, I also leak the addresses over WiFi, but that requires physical proximity.

A funny attack here is the ISP router recognizing this situation and silently sniffing the WiFi traffic around it. Which is why I have it in a metal box bricked into the armed concrete wall, with the antennas screwed out.

I'm not that worried about DoS attacks at link layer, like table exhaustions. Those can happen because of accidents as well and I expect the router software to mostly have those patched at this point. And if they don't, I can just reboot the whole thing if need be.

Internet and transport layer
----------------------------

I'm still waiting for IPv6 :(

Before that happens, not much. The NAT between the WAN and LAN helps keep things segregated quite a bit. For defense in depth I also map the externally accessible port on the NAT to a random port. Doesn't stop a dedicated, provisioned or adept attacker but it does stop random people that go around scanning port 22 and 80.

I did purposefully host my personal website on a server rather than from my home so I don't expose my external IP address, so there's that.

I considered IPSec and might revisit the decision in the future but for now, it's more trouble than it's worth.

Application layer
-----------------

Here's where the fun starts. On all devices that I completely control I try to reduce the application layer to only two endpoints: SSH and HTTPS.

Note that both SSH and HTTPS secure my information even if the underlying network is outright hostile. Defense in depth.

### HTTPS

HTTPS is used for end to end encryption of all "nice UI" parts of the network, like the camera dashboard. I use [Nginx as a reverse SSL proxy](/blog/2014/04/12/encrypting-access-to-all-local-web-consoles-using-nginx-as-reverse-ssl-proxy/) which allows me to encrypt any tool with a web UI.

I use a private root certificate to issue SSL certificates for all trusted devices, **including smartphones and Chromebooks**, which conveniently allows me to set up 2-way SSL.

This means that my actual useful information is secure even if someone obtains unauthorized access to my private network, even active access to the network infrastructure like the router.

This also means that I could even expose the HTTPS endpoints to the Internet and access them over crappy hotspot networks and still be OK. Of course I don't actually do this, because it would leak some metadata, but I could make this usability choice if I wanted to.

### SSH

SSH is my control channel. I mostly use it for settings and configuration. Ideally very rarely.

I have the standard set of precautions in place.

I [run SSH on a non-standard port](/blog/2013/11/26/how-to-pick-the-best-non-standard-port-for-ssh-or-other-services/), [using a config](blog/2014/05/28/using-ssh-config-file-to-simplify-swarm-management/) to counteract the usability loss.

I only allow public key logins, and I use the shiny new [Ed25519](https://en.wikipedia.org/wiki/EdDSA) which probably makes the passphrase the weakest link of the entire scheme.

Usability
---------

Almost everything is setup only. Once the keys are distributed on the devices they just work.

The only non-periodic interaction is entering the SSH key.

Note that this means that devices that belong to family members get security completely transparently as far as their users are concerned.

Adding a new device is a rare event (1 / year). For HTTPS it's just provisioning a new certificate and figuring out how to load it on the device. For SSH it's a bit more work to verify the connections as I establish them.

Rotating the root certificate is a very rare event (0.5 / year) and would require a bit more work to rotate all HTTPS certificates on all devices. Obviously this doesn't impact SSH.

Next up
-------

Individual device security.

