#!/bin/bash

git pull
rsync -ar public/* /var/www/html/
