#!/bin/bash

echo "Hardening the server..."

echo "PasswordAuthentication no" >> /etc/ssh/sshd_config

echo "Installing Nginx..."

apt-get install nginx

echo "Configuring Nginx..."

mkdir /var/www/challenges
chown -R www-data:www-data /var/www/

echo "Setting up Let's encrypt..."

openssl dhparam -out server.dhparam 2048
openssl genrsa 4096 > account.key
openssl genrsa 4096 > domain.key
openssl req -new -sha256 -key domain.key -subj "/" -reqexts SAN -config <(cat /etc/ssl/openssl.cnf <(printf "[SAN]\nsubjectAltName=DNS:ivankovic.me,DNS:www.ivankovic.me")) > domain.csr

mv nginx.conf /etc/nginx/nginx.conf
