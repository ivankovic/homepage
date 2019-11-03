#!/bin/bash

python /root/acme-tiny/acme-tiny.py --account-key /etc/ssl/private/account.key --csr /etc/ssl/private/domain.csr --acme-dir /var/www/challenges/ > /etc/ssl/private/signed.crt
wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > /etc/ssl/private/intermediate.pem
cat /etc/ssl/private/signed.crt /etc/ssl/private/intermediate.pem > /etc/ssl/private/chained.pem
/etc/init.d/nginx reload

