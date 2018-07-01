#!/bin/bash

cd /root/homepage
git pull
rsync -ar public/* /var/www/html/
