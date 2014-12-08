#!/bin/bash
# VirtualEnv and Django setup
#
# This is a distinct file as it's meant to be run as the primary user we SSH in as

# Grab the environment var, default to 'dev'
ENV=${1-dev}
# ... and pick up related vars
source /www/repo/svr/cfg-$ENV.sh

# Grab the user var, default to 'vagrant'
USER=${2-vagrant}

echo -e "\033[0;34m > Running main-user setup script, with the following parameters:\033[0m"
echo -e "\033[0;34m > Environment: $ENV\033[0m"
echo -e "\033[0;34m > Main User:   $USER\033[0m"

# Set up virtualenv directory for the user if required
if [ ! -d /home/$USER/.virtualenvs ]; then
    echo -e "\033[0;31m > Creating .virtualenvs folder"
    mkdir /home/$USER/.virtualenvs
fi

# write all the profile stuff for the user if required
grep -q PIP_VIRTUALENV_BASE /home/$USER/.bashrc
if [ $? -ne 0 ]; then
    echo -e "\033[0;34m > Updating profile file\033[0m"
    echo "export WORKON_HOME=~/.virtualenvs" >> /home/$USER/.bashrc
    echo "source /usr/local/bin/virtualenvwrapper.sh" >> /home/$USER/.bashrc
    echo "export PIP_VIRTUALENV_BASE=~/.virtualenvs" >> /home/$USER/.bashrc
#    echo "workon dialectic-$ENV" >> /home/$USER/.bashrc
fi

echo -e "\033[0;34m > Setting up virtualenv\033[0m"
export WORKON_HOME=/home/$USER/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh
export PIP_VIRTUALENV_BASE=/home/$USER/.virtualenvs
mkvirtualenv dialectic-$ENV
workon dialectic-$ENV

if [ ! -f /www/$ENV/current/app/dialectic/settings/local.py ]; then
    # Set up local Django settings
    #
    # NB THIS WILL OVERWRITE ANY EXISTING local.py SETTINGS FILE
    #
    echo "from .$ENV import *" > /www/$ENV/current/app/dialectic/settings/local.py
    echo "DATABASES = { 'default': { 'ENGINE': 'django.db.backends.postgresql_psycopg2', 'NAME': '$DB_NAME', 'USER': '$DB_USER', 'PASSWORD': '$DB_PASS', 'HOST': '127.0.0.1', 'PORT': '5432', }}" >> /www/$ENV/current/app/dialectic/settings/local.py
fi