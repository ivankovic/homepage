#!/bin/bash

python /root/acme_tiny.py --account-key /root/account.key --csr /root/domain.csr --acme-dir /var/www/challenges/ > /root/signed.crt
wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > /root/intermediate.pem
cat /root/signed.crt /root/intermediate.pem > /root/chained.pem
/etc/init.d/nginx reload

