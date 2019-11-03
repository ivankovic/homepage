#!/bin/bash

echo "Configuring Nginx..."

mkdir /var/www/challenges
chown -R www-data:www-data /var/www/

echo "Setting up Let's encrypt..."

mkdir /root/acme-tiny
wget -O - "https://raw.githubusercontent.com/diafygi/acme-tiny/master/acme_tiny.py" > /root/acme-tiny/acme-tiny.py

openssl dhparam -out /etc/ssl/private/server.dhparam 2048
openssl genrsa 4096 > /etc/ssl/private/account.key
openssl genrsa 4096 > /etc/ssl/private/domain.key
openssl req -new -sha256 -key /etc/ssl/private/domain.key -subj "/" -reqexts SAN -config <(cat /etc/ssl/openssl.cnf <(printf "[SAN]\nsubjectAltName=DNS:www.ivankovic.me")) > /etc/ssl/private/domain.csr

chown -R root:www-data /etc/ssl/private/
chmod 750 /etc/ssl/private/

cp nginx.conf /etc/nginx/nginx.conf
