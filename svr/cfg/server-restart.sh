#!/bin/bash
# Restart Server
# kills nginx and gunicorn, checks .pyc has been created, restarts servers

# Grab the environment var, default to 'dev'
ENV=${1-dev}

echo -e "\033[0;34m > Stopping gunicorn\033[0m"
sudo supervisorctl stop gunicorn-$ENV
echo -e "\033[0;34m > Removing .pyc files from $ENV\033[0m"
find /www/$ENV/current/app -name *.pyc -exec rm -rf {} \;
echo -e "\033[0;34m > Starting gunicorn\033[0m"
sudo supervisorctl start gunicorn-$ENV

echo -e "\033[0;34m > Restarting nginx\033[0m"
sudo service nginx restart