#!/bin/bash

wget -O - https://github.com/ivankovic/homepage/archive/master.zip > master.zip
unzip master.zip
rsync -ar homepage-master/public/* /var/www/html/
rm -rf homepage-master
rm master.zip
