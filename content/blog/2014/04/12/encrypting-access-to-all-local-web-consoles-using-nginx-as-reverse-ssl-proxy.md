+++
date = 2014-04-12T20:00:00Z
title = "Encrypting access to all local web consoles using Nginx as reverse SSL proxy"
aliases = [
  "/blog/2014/04/12/encrypting-access-to-all-local-web-consoles-using-nginx-as-reverse-ssl-proxy.html"
]
+++
# Encrypting access to all local web consoles (using Nginx as reverse SSL proxy) #

A lot of software I run on Raspberry PI nodes comes with built-in web interfaces. Making sure all of these are encrypted, only allow authenticated users and don’t have vulnerabilities is tiresome and prone to errors. Some interfaces will allow you to hook up to existing Nginx or Apache servers, but some stubbornly insist on using their own built in web server.

Using Nginx and Iptables, we can solve the problem in the other direction, and use a good, secure Nginx server to forward requests to local interfaces.

The idea is:

  1. Use Nginx reverse SSL proxy for encryption.
  2. Require client side SSL certificates for authentication.
  3. Use Iptables to block all incoming ports except for HTTPS and SSH.

## SSL certificate generation ##

There are [many](https://www.google.com/search?q=openssl+public+key+tutorial) tutorials online on SSL certificate generation. [ArchWiki](https://wiki.archlinux.org/index.php/OpenSSL) has a particularly good one that uses OpenSSL.

The important things to look for are:

  1. **Message digest** (`default_md` in OpenSSL) should be at least SHA256. *Never use MD5* it [has been completely broken and should not be used](http://www.kb.cert.org/vuls/id/836068). If you have to use SHA1, you are probably safe for the very near future, but [should migrate to SHA256 as soon as posible](https://www.schneier.com/blog/archives/2005/02/cryptanalysis_o.html).

  2. **Key size** (`default_bits`) should be at least 2048. 4096 is not a huge performance hit, so you should at least try it out and see if it works.

  3. Choose a comfortable duration. 1 year from now you will forget you set a 1 year duration and be amazed when things mysteriously start to break. Since you fully control devices on both ends, limiting duration is not as important as for publicly accessible web sites.

## Nginx configuration ## 

### Nginx SSL ###

Nginx has a very good [SSL module](http://wiki.nginx.org/HttpSslModule). Important directives are:

  1. `ssl_verify_client` - This should be set to on. We demand client certificates for all requests.

  2. `ssl_prefer_server_chipers` - This should be set to on. Since you control devices on both ends, you need to set up the cipher list just once on the server. This also helps catch bugs where clients don’t support good quality ciphersuites.

  3. `ssl_protocols` - You should consider forcing TLS1.2.

  4. `ssl_ciphers` - **This is important**. You need to make sure that the chipers you use support [forward secrecy](http://en.wikipedia.org/wiki/Forward_secrecy). By default, the config is set to `HIGH:!aNULL:!MD5`, in [OpenSSL cipher list format](https://www.openssl.org/docs/apps/ciphers.html). The default translates to “high encryption cipher suites (mostly based on key size) but never suites that don’t offer authentication (`!aNULL`) and most certainly never MD5.”. The exact value for `HIGH` depends on your OpenSSL version. You should check that `ECDHE-*` schemes are the preferred suites. The last `E` in `ECDHE` means ephemeral and that is what gives forward secrecy. You could consider forcing the algorithms to explicitly list those that use forward secrecy, but then you might miss out on future upgrades, unless you remember to update the config.

Mozilla maintains a fantastic [wiki](https://wiki.mozilla.org/Security/Server_Side_TLS) for anyone who wants an in-depth analysis.

## Browser configuration ##

*Do not import the CA certificate in the keychain*. Even though you control it, there’s no real reason to do this. It’s much better to trust the server certificates on a case by case basis.

Currently I use Firefox to access these internal sites. This is because Firefox works much better with self-signed and self-CA certificates. [Trusting a certificate in Firefox](https://www.google.com/search?q=firefox+trust+certificate) is easy to do once, and from then on you are safe and don’t get any warnings.

I didn’t yet figure out how to do this in Chrome, but I didn’t try too hard either. Using different browsers makes XSS attacks against my internal systems much more difficult.

## Locking it all down ##

You should [already](http://www.ivankovic.me/blog/2013/11/09/basic-network-security-setup-for-rpi.html) be using Iptables to block all incoming traffic to your machine. Now simply add https (TCP port 443) to the list of allowed ports in the TCP chain and you are done.

At this point, you probably don’t need any more TCP ports exposed on your machine. You should be able to tunnel everything through SSH and SSL, with the possible exception of [mDNS](http://en.wikipedia.org/wiki/Multicast_DNS) (if you need local machine name resolution).
